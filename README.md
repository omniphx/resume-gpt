# Resume-GPT

ResumeGPT is an AI chatbot powered by [OpenAI](https://openai.com)'s chat completion API. Developed using [Next.js](https://nextjs.org) and hosted on [Vercel](https://vercel.com), this site enables you to inquire about my resume or ask questions specifically about the chatbot itself.

![Screenshot 2023-06-30 at 12 14 25 PM](https://github.com/omniphx/resume-gpt/assets/3722405/0587587e-280a-43d5-a3f7-e3f506a148f7)

## Resume data source

By default, the chatbot loads resume context from `data/resume.md`.

You can override that source without changing code:

- `RESUME_CONTEXT_FILE=path/to/resume.md`
- `RESUME_CONTEXT_URL=https://example.com/resume.md`

Directly scraping a public LinkedIn profile is not reliable because LinkedIn serves an auth wall to unauthenticated requests. A practical setup is to point `RESUME_CONTEXT_FILE` or `RESUME_CONTEXT_URL` at a LinkedIn export or another maintained resume source.

## Try it yourself

```bash
# Install dependencies
yarn install

# Create a .env.local with your OpenAI API Key
echo OPENAI_API_KEY="sk-###" > .env.local

# Run
yarn dev
```
