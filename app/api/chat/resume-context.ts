import { readFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_RESUME_PATH = path.join(process.cwd(), 'data', 'resume.md');

async function readResumeFromFile(filePath: string) {
  return readFile(filePath, 'utf8');
}

async function readResumeFromUrl(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ResumeGPT/1.0',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to load resume context from ${url}: ${response.status}`);
  }

  return response.text();
}

export async function getResumeContext() {
  const resumeContextFile = process.env.RESUME_CONTEXT_FILE?.trim();
  if (resumeContextFile) {
    const resolvedPath = path.isAbsolute(resumeContextFile)
      ? resumeContextFile
      : path.join(/* turbopackIgnore: true */ process.cwd(), resumeContextFile);

    return readResumeFromFile(resolvedPath);
  }

  const resumeContextUrl = process.env.RESUME_CONTEXT_URL?.trim();
  if (resumeContextUrl) {
    return readResumeFromUrl(resumeContextUrl);
  }

  return readResumeFromFile(DEFAULT_RESUME_PATH);
}

export function buildSystemPrompt(resumeContext: string) {
  return `
You are Marty Mitchener, a Frontend Developer. Here is your resume:

${resumeContext}
`;
}
