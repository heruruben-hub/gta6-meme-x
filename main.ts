// gta6-meme-x-01 — "Post a GTA 6 meme on X"
//
// The entry for this bounty is not really this program. The entry is a post
// on X: a GTA 6 meme (see meme.png) whose text links to the bounty page on
// make.fun and carries my play code. The judges read the post itself — its
// picture and its words — straight from X.
//
// So what does this program do? It hands in the post's address. POST.json,
// sitting next to this file in the bot directory, holds a single field,
// "url", naming the X post. The grader expects that file to turn up in the
// output directory, so this program copies it there — but only after
// reading it and checking that it really names an X post. A leftover
// placeholder or a malformed file is refused, not handed in:
//
//   bot dir    (MAKEFUN_BOT_DIR,    default /bot)    -- POST.json lives here
//   output dir (MAKEFUN_OUTPUT_DIR, default /output) -- POST.json lands here
//
// Node 22, standard library only. If POST.json is unusable, or the copy
// cannot be made (missing file, bad permissions, ...), the program says so
// on stderr and exits 1, so a broken hand-in fails loudly instead of
// silently scoring zero.
//
// Run it locally the same way the grader does, with the env vars pointed at
// this repo and a scratch output folder:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const destination = join(outputDir, 'POST.json');

// Read and check POST.json before handing anything in. The file is only
// worth copying if it really names an X post: JSON with a "url" string
// that starts with "https://x.com/" and contains "/status/". Anything else
// fails here, before any copy, with the reason on stderr.
let postUrl: string;
try {
  const parsed: unknown = JSON.parse(readFileSync(source, 'utf8'));
  const url =
    parsed !== null && typeof parsed === 'object'
      ? (parsed as { url?: unknown }).url
      : undefined;
  if (
    typeof url !== 'string' ||
    !url.startsWith('https://x.com/') ||
    !url.includes('/status/')
  ) {
    throw new Error(
      'expected JSON with a "url" string naming an X post, like "https://x.com/<handle>/status/<id>"',
    );
  }
  postUrl = url;
} catch (err) {
  console.error(
    `could not hand in the post address: ${source} is not a usable POST.json: ${(err as Error).message}`,
  );
  process.exit(1);
}

// Create the output directory first: on a fresh grader run it may not
// exist yet, and copyFileSync will not create it for us.
mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(source, destination);
} catch (err) {
  console.error(
    `could not hand in the post address: failed to copy ${source} to ${destination}: ${(err as Error).message}`,
  );
  process.exit(1);
}

console.log(`handed in the post address: ${source} -> ${destination}`);
// Name the post this entry points at, so a human running the program can
// see at a glance that the hand-in is the post they meant to enter.
console.log(`entry post: ${postUrl}`);
