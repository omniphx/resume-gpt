import { NextResponse } from 'next/server';
import { buildSystemPrompt, getResumeContext } from './resume-context';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const runtime = 'nodejs';

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
        max_tokens: 512,
        temperature: 0.75,
      }),
    });

    const payload = await openAIResponse.json();

    if (!openAIResponse.ok) {
      const errorMessage =
        payload?.error?.message ?? 'OpenAI request failed before a response was generated.';
      return NextResponse.json({ error: errorMessage }, { status: openAIResponse.status });
    }

    const content = payload?.choices?.[0]?.message?.content;

    if (typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'OpenAI returned an empty response.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: content });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'The server failed to process the chat request.' },
      { status: 500 },
    );
  }
}
