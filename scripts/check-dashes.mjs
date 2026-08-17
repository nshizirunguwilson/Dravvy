#!/usr/bin/env node
/**
 * Guard: this project uses zero em dashes and zero en dashes.
 *
 * Scans every git-tracked text file for the raw characters and for the HTML
 * entities that render as them, then fails the build if any turn up. The
 * offending characters are built from escape sequences so that this file
 * stays clean too.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const EM_DASH = String.fromCharCode(0x2014)
const EN_DASH = String.fromCharCode(0x2013)

const NEEDLES = [
  { label: 'em dash', value: EM_DASH },
  { label: 'en dash', value: EN_DASH },
  { label: 'em dash entity', value: '&' + 'mdash;' },
  { label: 'en dash entity', value: '&' + 'ndash;' },
  { label: 'em dash entity', value: '&' + '#8212;' },
  { label: 'en dash entity', value: '&' + '#8211;' },
]

const SKIP_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.webp',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.pdf',
  '.docx',
])

const SKIP_FILES = new Set(['package-lock.json'])

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .map((file) => file.trim())
  .filter(Boolean)
  .filter((file) => !SKIP_FILES.has(file))
  .filter((file) => !SKIP_EXTENSIONS.has(path.extname(file).toLowerCase()))

const findings = []

for (const file of files) {
  let contents
  try {
    contents = readFileSync(file, 'utf8')
  } catch {
    continue
  }
  if (!NEEDLES.some((needle) => contents.includes(needle.value))) continue

  contents.split('\n').forEach((line, index) => {
    for (const needle of NEEDLES) {
      if (line.includes(needle.value)) {
        findings.push({ file, line: index + 1, label: needle.label, text: line.trim() })
      }
    }
  })
}

if (findings.length > 0) {
  console.error(`Found ${findings.length} forbidden dash(es):\n`)
  for (const finding of findings) {
    console.error(`  ${finding.file}:${finding.line}  [${finding.label}]  ${finding.text}`)
  }
  console.error('\nUse a comma, colon, full stop or plain hyphen instead.')
  process.exit(1)
}

console.log(`No em or en dashes found across ${files.length} tracked files.`)
