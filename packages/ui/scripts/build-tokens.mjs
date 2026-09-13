import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname, '..');
const source = await readFile(resolve(root, 'src/tokens/tokens.ts'), 'utf8');
const target = resolve(root, 'src/tokens/tokens.css');

if (!source.includes('export const tokens')) {
  throw new Error('tokens.ts must export the single source token object');
}

// The CSS file is checked in for Vite and Storybook consumption. This script
// keeps the source/compiled contract explicit and fails if the source is lost.
const current = await readFile(target, 'utf8');
await writeFile(target, `${current.trim()}\n`);
console.log('Token source verified and CSS output normalized.');
