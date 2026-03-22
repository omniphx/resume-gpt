import { NextResponse } from 'next/server';
import { buildSystemPrompt, getResumeContext } from './resume-context';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const runtime = 'nodejs';

function parseOpenAIStream(stream: ReadableStream<Uint8Array>) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const enqueueContentFromEvent = (
    controller: ReadableStreamDefaultController<Uint8Array>,
    event: string,
  ) => {
    const lines = event
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('data:'));

    for (const line of lines) {
      const data = line.slice(5).trim();

      if (!data || data === '[DONE]') {
        continue;
      }

      try {
        const payload = JSON.parse(data);
        const content = payload?.choices?.[0]?.delta?.content;

        if (typeof content === 'string' && content.length > 0) {
          controller.enqueue(encoder.encode(content));
        }
      } catch {
        // Ignore incomplete or non-content SSE payloads and wait for the next chunk.
      }
    }
  };

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = stream.getReader();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const event of events) {
            enqueueContentFromEvent(controller, event);
          }
        }

        const finalChunk = decoder.decode();
        if (finalChunk) {
          buffer += finalChunk;
        }

        if (buffer.trim().length > 0) {
          enqueueContentFromEvent(controller, buffer);
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY. Add it to .env.local and restart the dev server.' },
        { status: 500 },
      );
    }

    const { messages } = (await req.json()) as { messages?: ChatMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Request must include at least one message.' },
        { status: 400 },
      );
    }

    const resumeContext = await getResumeContext();

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: buildSystemPrompt(resumeContext),
          },
          ...messages,
        ],
        stream: true,
        max_completion_tokens: 1600,
        temperature: 0.75,
      }),
    });

    if (!openAIResponse.ok) {
      const payload = await openAIResponse.json().catch(() => null);
      const errorMessage =
        payload?.error?.message ?? 'OpenAI request failed before a response was generated.';
      return NextResponse.json({ error: errorMessage }, { status: openAIResponse.status });
    }

    if (!openAIResponse.body) {
      return NextResponse.json(
        { error: 'OpenAI returned an empty response stream.' },
        { status: 502 },
      );
    }

    return new Response(parseOpenAIStream(openAIResponse.body), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'The server failed to process the chat request.' },
      { status: 500 },
    );
  }
}
