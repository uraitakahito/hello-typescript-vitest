// Keeps docs/en and docs/ja in step:
// - every page has a page of the same name in the other language,
// - each pair has the same outline (heading levels and code-block languages, in order),
// - each page starts with the line that switches to its pair,
// - every relative link in README.md and the docs points to an existing file.
// The prose itself is not compared; reviewers check the translation.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, posix } from 'node:path';

const languages = ['en', 'ja'] as const;
type Language = (typeof languages)[number];

const switchLine = (language: Language, pairLink: string): string =>
  language === 'en' ? `English | [日本語](${pairLink})` : `[English](${pairLink}) | 日本語`;

const errors: string[] = [];

function listPages(language: Language): string[] {
  const root = join('docs', language);
  if (!existsSync(root)) {
    return [];
  }
  return readdirSync(root, { recursive: true, encoding: 'utf8' })
    .filter(name => name.endsWith('.md'))
    .map(name => name.split('\\').join('/'))
    .sort();
}

// Lines outside fenced code blocks, plus the language of each fence, in order.
function scan(text: string): { prose: string[], outline: string[] } {
  const prose: string[] = [];
  const outline: string[] = [];
  let inFence = false;
  for (const line of text.split('\n')) {
    const fence = /^```(\S*)/.exec(line);
    if (fence) {
      if (!inFence) {
        outline.push(`code ${fence[1] || '(none)'}`);
      }
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }
    prose.push(line);
    const heading = /^(#{1,6}) /.exec(line);
    if (heading) {
      outline.push(`h${heading[1].length}`);
    }
  }
  return { prose, outline };
}

function checkLinks(file: string, prose: string[]): void {
  for (const line of prose) {
    // Ignore inline code, where brackets are not links.
    const text = line.replace(/`[^`]*`/g, '');
    for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/.test(target)) {
        continue;
      }
      const path = posix.join(posix.dirname(file), target.split('#')[0]);
      if (!existsSync(path)) {
        errors.push(`${file}: broken link ${target}`);
      }
    }
  }
}

const pages = Object.fromEntries(languages.map(language => [language, listPages(language)])) as Record<Language, string[]>;

for (const language of languages) {
  const other = language === 'en' ? 'ja' : 'en';
  for (const page of pages[language]) {
    const file = posix.join('docs', language, page);
    const pairFile = posix.join('docs', other, page);
    const { prose, outline } = scan(readFileSync(file, 'utf8'));
    checkLinks(file, prose);

    const expected = switchLine(language, posix.relative(posix.dirname(file), pairFile));
    if (prose[0] !== expected) {
      errors.push(`${file}: the first line must be "${expected}"`);
    }

    if (!pages[other].includes(page)) {
      errors.push(`${file}: ${pairFile} is missing`);
      continue;
    }
    // Compare each pair once, from the English side.
    if (language === 'en') {
      const pairOutline = scan(readFileSync(pairFile, 'utf8')).outline;
      if (outline.join(', ') !== pairOutline.join(', ')) {
        errors.push(`${file} and ${pairFile} differ in outline:\n  en: ${outline.join(', ')}\n  ja: ${pairOutline.join(', ')}`);
      }
    }
  }
}

checkLinks('README.md', scan(readFileSync('README.md', 'utf8')).prose);

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`docs: ${pages.en.length} pages in each language, all in step`);
