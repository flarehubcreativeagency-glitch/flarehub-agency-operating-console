import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['src', 'docs', 'public'];
const badPatterns = [
  { name: 'mojibake', re: /Ã|Â|�|â€™|â€œ|â€|â†|â€¢|ï¿½/ },
  { name: 'lorem', re: /lorem ipsum/i },
  { name: 'todo-ui', re: /TODO UI|Untitled|Test Client/i },
  { name: 'secret', re: /(api[_-]?key|private[_-]?key|service_account|firebase.*secret|webhook.*secret)\s*[:=]\s*['"][^'"]{8,}/i },
  { name: 'broad-rule', re: /allow\s+read,\s*write:\s*if\s+true/i },
  { name: 'huly-dependency', re: /@hcengineering|hcengineering\/platform|from ['"].*huly|import .*huly/i },
  { name: 'dangerous-credential-copy', re: /clipboard|writeText|copy API|copy.*credential/i }
];

function files(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return files(path);
    return [path];
  });
}

function auditInteractions(file, text) {
  if (!file.endsWith('.tsx') && !file.endsWith('.jsx')) return false;

  let failed = false;
  for (const match of text.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const attrs = match[1];
    const body = match[2].replace(/<[^>]+>/g, '').trim();
    if (!/onClick=|disabled|data-action=/.test(attrs)) {
      console.error(`button-without-behavior: ${file}: ${match[0].slice(0, 100)}`);
      failed = true;
    }
    if (!/type=/.test(attrs)) {
      console.error(`button-without-type: ${file}: ${match[0].slice(0, 100)}`);
      failed = true;
    }
    if (!body && !/aria-label=/.test(attrs)) {
      console.error(`icon-button-without-aria-label: ${file}: ${match[0].slice(0, 100)}`);
      failed = true;
    }
  }

  for (const match of text.matchAll(/<button\b([^>]*)\/>/g)) {
    const attrs = match[1];
    if (!/onClick=|disabled|data-action=/.test(attrs)) {
      console.error(`self-closing-button-without-behavior: ${file}: ${match[0].slice(0, 100)}`);
      failed = true;
    }
    if (!/type=/.test(attrs)) {
      console.error(`self-closing-button-without-type: ${file}: ${match[0].slice(0, 100)}`);
      failed = true;
    }
    if (!/aria-label=/.test(attrs)) {
      console.error(`self-closing-icon-button-without-aria-label: ${file}: ${match[0].slice(0, 100)}`);
      failed = true;
    }
  }

  for (const match of text.matchAll(/<a\b([^>]*)>/g)) {
    const attrs = match[1];
    if (!/href=|onClick=|data-action=/.test(attrs)) {
      console.error(`anchor-without-action: ${file}: ${match[0].slice(0, 100)}`);
      failed = true;
    }
  }

  return failed;
}

let failed = false;
for (const file of roots.flatMap(files)) {
  const text = readFileSync(file, 'utf8');
  for (const pattern of badPatterns) {
    if (pattern.re.test(text)) {
      console.error(`${pattern.name}: ${file}`);
      failed = true;
    }
  }
  if (auditInteractions(file, text)) failed = true;
}

if (failed) process.exit(1);
console.log('source QA passed');
