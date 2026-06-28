import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// Minimal RGBA PNG encoder (no dependencies).
function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  // rest 0 (compression, filter, interlace)
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function px(buf, w, x, y, [r, g, b, a]) {
  if (x < 0 || y < 0 || x >= w) return
  const i = (y * w + x) * 4
  // simple alpha-over compositing
  const sa = a / 255
  buf[i] = Math.round(r * sa + buf[i] * (1 - sa))
  buf[i + 1] = Math.round(g * sa + buf[i + 1] * (1 - sa))
  buf[i + 2] = Math.round(b * sa + buf[i + 2] * (1 - sa))
  buf[i + 3] = 255
}

function disc(buf, w, cx, cy, radius, color) {
  const r2 = radius * radius
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx
      const dy = y - cy
      const d2 = dx * dx + dy * dy
      if (d2 <= r2) {
        // anti-alias edge
        const edge = radius - Math.sqrt(d2)
        const a = Math.max(0, Math.min(1, edge)) * (color[3] / 255)
        px(buf, w, x, y, [color[0], color[1], color[2], Math.round(a * 255)])
      }
    }
  }
}

function drawIcon(size, { bleed }) {
  const buf = Buffer.alloc(size * size * 4)
  // Background (brand). For maskable, fill the whole square (bleed).
  const bg = [123, 74, 45, 255]
  if (bleed) {
    for (let i = 0; i < size * size; i++) {
      buf[i * 4] = bg[0]
      buf[i * 4 + 1] = bg[1]
      buf[i * 4 + 2] = bg[2]
      buf[i * 4 + 3] = 255
    }
  } else {
    // rounded square
    const r = size * 0.22
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const inX = Math.min(x, size - 1 - x)
        const inY = Math.min(y, size - 1 - y)
        let inside = true
        if (inX < r && inY < r) {
          const dx = r - inX
          const dy = r - inY
          inside = dx * dx + dy * dy <= r * r
        }
        if (inside) {
          const i = (y * size + x) * 4
          buf[i] = bg[0]
          buf[i + 1] = bg[1]
          buf[i + 2] = bg[2]
          buf[i + 3] = 255
        }
      }
    }
  }

  const c = size / 2
  // For maskable, keep the cookie within the safe zone (~80%).
  const cookieR = size * (bleed ? 0.3 : 0.32)
  disc(buf, size, c, c, cookieR, [217, 165, 102, 255]) // cookie
  disc(buf, size, c, c, cookieR, [0, 0, 0, 18]) // subtle shade

  // chocolate chips, positioned relative to cookie radius
  const chip = [90, 52, 19, 255]
  const chips = [
    [-0.4, -0.35, 0.16],
    [0.35, -0.45, 0.13],
    [0.45, 0.3, 0.15],
    [-0.45, 0.35, 0.13],
    [0.02, 0.05, 0.12],
    [-0.05, -0.55, 0.1],
    [0.55, -0.05, 0.11],
  ]
  for (const [fx, fy, fr] of chips) {
    disc(buf, size, c + fx * cookieR, c + fy * cookieR, fr * cookieR, chip)
  }

  return encodePNG(size, size, buf)
}

// Default to the project's public/ folder so this can run from npm scripts
// (prebuild/predev) with no arguments.
const here = dirname(fileURLToPath(import.meta.url))
const outDir = process.argv[2] ?? resolve(here, '..', 'public')
mkdirSync(`${outDir}/icons`, { recursive: true })

writeFileSync(`${outDir}/icons/icon-192.png`, drawIcon(192, { bleed: false }))
writeFileSync(`${outDir}/icons/icon-512.png`, drawIcon(512, { bleed: false }))
writeFileSync(
  `${outDir}/icons/icon-512-maskable.png`,
  drawIcon(512, { bleed: true }),
)
writeFileSync(`${outDir}/apple-touch-icon.png`, drawIcon(180, { bleed: true }))

console.log('Icons generated in', outDir)
