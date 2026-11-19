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
// output directory, so this program simply copies it there:
//
//   bot dir    (MAKEFUN_BOT_DIR,    default /bot)    -- POST.json lives here
//   output dir (MAKEFUN_OUTPUT_DIR, default /output) -- POST.json lands here
//
// Node 22, standard library only. If the copy cannot be made (missing file,
// bad permissions, ...) the program says so on stderr and exits 1, so a
// broken hand-in fails loudly instead of silently scoring zero.
//
// Run it locally the same way the grader does, with the env vars pointed at
// this repo and a scratch output folder:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const destination = join(outputDir, 'POST.json');

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
