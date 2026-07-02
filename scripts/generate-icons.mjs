// Writes the app icon files under public/ at build time (kept out of git).
// The icon is Abi's portrait, stored as compact base64 text in src/assets/logo.ts
// (so it can be committed as text and pushed via the API). Here we decode it and
// write it to each icon slot. Runs from the prebuild/predev npm scripts (with
// Node's --experimental-strip-types so the .ts import works).
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { portraitJpegBase64 } from '../src/assets/logo.ts'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = process.argv[2] ?? resolve(here, '..', 'public')
const bytes = Buffer.from(portraitJpegBase64, 'base64')

const targets = [
  'icons/icon-192.jpg',
  'icons/icon-512.jpg',
  'icons/icon-512-maskable.jpg',
  'apple-touch-icon.jpg',
]

for (const rel of targets) {
  const path = resolve(outDir, rel)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, bytes)
}

console.log(`Wrote ${targets.length} icon files to ${outDir}`)
