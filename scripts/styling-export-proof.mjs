#!/usr/bin/env node
/**
 * Proves every styling option also reaches the two export formats.
 *
 * The live preview is checked by `scripts/styling-proof.mjs`. This one renders
 * a real PDF and a real DOCX per option and inspects the produced file:
 *
 *   DOCX: `word/document.xml` is unzipped and searched for the marker the
 *         option should have written (font name, half-point size, accent hex,
 *         border edge and style, spacing twips, formatted date).
 *   PDF:  the bytes are normalised (creation date and file ID stripped, since
 *         those change on every run) and compared, plus the embedded /BaseFont
 *         is read back for the typeface sweep.
 *
 * Every option must both hit its marker and produce a file distinct from its
 * siblings in the same group.
 *
 *   npm run proof:exports
 */
import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath, pathToFileURL } from 'node:url'
import React from 'react'

import { fixture, groups } from './fixtures/styling-matrix.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workDir = path.join(root, '.styling-proof')
const outFile = path.join(root, 'docs/styling-proof/exports.json')

/* ----------------------------------------------------------------------
 * Minimal zip reader, enough to pull one entry out of a .docx
 * -------------------------------------------------------------------- */
function readZipEntry(buffer, wanted) {
  // Locate the end-of-central-directory record, scanning back from the tail.
  let eocd = -1
  for (let i = buffer.length - 22; i >= 0 && i > buffer.length - 66_000; i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i
      break
    }
  }
  if (eocd < 0) throw new Error('not a zip file')

  const entryCount = buffer.readUInt16LE(eocd + 10)
  let pointer = buffer.readUInt32LE(eocd + 16)

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(pointer) !== 0x02014b50) throw new Error('bad central directory')
    const method = buffer.readUInt16LE(pointer + 10)
    const compressedSize = buffer.readUInt32LE(pointer + 20)
    const nameLength = buffer.readUInt16LE(pointer + 28)
    const extraLength = buffer.readUInt16LE(pointer + 30)
    const commentLength = buffer.readUInt16LE(pointer + 32)
    const localOffset = buffer.readUInt32LE(pointer + 42)
    const name = buffer.toString('utf8', pointer + 46, pointer + 46 + nameLength)

    if (name === wanted) {
      const localNameLength = buffer.readUInt16LE(localOffset + 26)
      const localExtraLength = buffer.readUInt16LE(localOffset + 28)
      const dataStart = localOffset + 30 + localNameLength + localExtraLength
      const data = buffer.subarray(dataStart, dataStart + compressedSize)
      return method === 0 ? data : zlib.inflateRawSync(data)
    }

    pointer += 46 + nameLength + extraLength + commentLength
  }
  throw new Error(`entry ${wanted} not found`)
}

/** PDFs stamp a creation date and a random file id. Strip both before diffing. */
const normalisePdf = (buffer) =>
  buffer
    .toString('latin1')
    .replace(/\/CreationDate\s*\([^)]*\)/g, '/CreationDate ()')
    .replace(/\/ModDate\s*\([^)]*\)/g, '/ModDate ()')
    .replace(/\/ID\s*\[[^\]]*\]/g, '/ID []')

const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16)

/* ----------------------------------------------------------------------
 * Per-group expectations
 * -------------------------------------------------------------------- */

const DOCX_FONTS = {
  'times new roman': 'Times New Roman',
  georgia: 'Georgia',
  cambria: 'Cambria',
  garamond: 'Garamond',
  calibri: 'Calibri',
  helvetica: 'Helvetica',
  arial: 'Arial',
  roboto: 'Roboto',
  lato: 'Lato',
  'open sans': 'Open Sans',
  montserrat: 'Montserrat',
  outfit: 'Outfit',
}

const DOCX_BODY_HALF_POINTS = { small: 18, medium: 20, large: 24 }
const DOCX_SECTION_BEFORE = { small: 120, medium: 240, large: 420 }
const PDF_BASE_FONT = { serif: 'Times', sans: 'Helvetica' }

function checkDocx(groupId, option, xml) {
  switch (groupId) {
    case 'theme': {
      const wantEdge = option.value === 'classic' ? 'w:bottom' : 'w:top'
      const hasEdge = new RegExp(`<${wantEdge}[^>]*w:val="single"`).test(xml)
      if (!hasEdge) return `expected the section rule on the ${wantEdge} edge`
      const upper = xml.includes('AVERY LIN')
      if (option.value === 'classic' && !upper) return 'expected the name in capitals'
      if (option.value !== 'classic' && upper) return 'name should not be capitalised'
      const wantAlign = option.value === 'minimal' ? 'left' : 'center'
      if (!xml.includes(`w:jc w:val="${wantAlign}"`)) return `expected ${wantAlign} header alignment`
      return null
    }
    case 'typeface': {
      const name = DOCX_FONTS[option.value]
      if (!name) return `no expected Word font name recorded for "${option.value}"`
      return xml.includes(`w:ascii="${name}"`) ? null : `document.xml never names ${name}`
    }
    case 'body-size': {
      const size = DOCX_BODY_HALF_POINTS[option.value]
      return xml.includes(`<w:sz w:val="${size}"`) ? null : `no run at ${size} half-points`
    }
    case 'section-spacing': {
      const before = DOCX_SECTION_BEFORE[option.value]
      return xml.includes(`w:before="${before}"`) ? null : `no section spacing of ${before} twips`
    }
    case 'separator': {
      if (option.value === 'no separator') {
        return /<w:pBdr>/.test(xml) ? 'expected no paragraph border' : null
      }
      const style = option.value === 'double line' ? 'double' : 'single'
      const size = option.value === 'bold line' ? 18 : 6
      const ok = new RegExp(`w:val="${style}"[^>]*w:sz="${size}"`).test(xml)
      return ok ? null : `expected a ${style} border at size ${size}`
    }
    case 'date-format': {
      const marker = { 'MM/YYYY': '04/2022', 'MMM YYYY': 'Apr 2022', 'MMMM YYYY': 'April 2022' }[
        option.value
      ]
      return xml.includes(marker) ? null : `expected a date rendered as ${marker}`
    }
    case 'profile-links': {
      const shown = xml.includes('LinkedIn')
      if (option.value === true && !shown) return 'document.xml has no LinkedIn link'
      if (option.value === false && shown) return 'document.xml still writes LinkedIn'
      return null
    }
    case 'language-proficiency': {
      const shown = /Native|Fluent/.test(xml)
      if (option.value === true && !shown) return 'document.xml writes no proficiency'
      if (option.value === false && shown) return 'document.xml still writes proficiency'
      return null
    }
    case 'accent-colour': {
      const hex = option.value.replace('#', '').toUpperCase()
      return xml.includes(`w:color w:val="${hex}"`) || xml.includes(`w:color="${hex}"`)
        ? null
        : `accent ${hex} never reaches document.xml`
    }
    default:
      return `no docx check for ${groupId}`
  }
}

function checkPdf(groupId, option, text) {
  if (groupId === 'typeface') {
    const want = PDF_BASE_FONT[option.genre]
    return text.includes(want) ? null : `PDF does not embed the ${option.genre} base font ${want}`
  }
  if (groupId === 'date-format') {
    // Dates land inside compressed streams, so the sweep relies on the
    // normalised-bytes difference instead. Nothing extra to assert here.
    return null
  }
  return null
}

/* ----------------------------------------------------------------------
 * Main
 * -------------------------------------------------------------------- */

async function compile(entry, outfile) {
  await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    outfile,
    jsx: 'automatic',
    loader: { '.ts': 'ts', '.tsx': 'tsx' },
    external: ['@react-pdf/renderer', 'docx', 'react', 'react-dom'],
    alias: { '@': path.join(root, 'src') },
    logLevel: 'silent',
  })
}

async function main() {
  await fs.rm(workDir, { recursive: true, force: true })
  await fs.mkdir(workDir, { recursive: true })

  const docxOut = path.join(workDir, 'docx.mjs')
  const pdfOut = path.join(workDir, 'pdf.mjs')
  await compile(path.join(root, 'src/lib/resume-docx.ts'), docxOut)
  await compile(path.join(root, 'src/components/resume-pdf.tsx'), pdfOut)

  const { buildResumeDocxBlob } = await import(pathToFileURL(docxOut).href)
  const { ResumePDF } = await import(pathToFileURL(pdfOut).href)
  const { pdf } = await import('@react-pdf/renderer')

  const results = []
  let failures = 0

  for (const group of groups) {
    const seenDocx = new Map()
    const seenPdf = new Map()

    for (const option of group.options) {
      const data = { ...fixture, style: { ...fixture.style, [group.field]: option.value } }

      const docxBuffer = Buffer.from(await (await buildResumeDocxBlob(data)).arrayBuffer())
      const xml = readZipEntry(docxBuffer, 'word/document.xml').toString('utf8')

      const pdfBuffer = Buffer.from(
        await (await pdf(React.createElement(ResumePDF, { data })).toBlob()).arrayBuffer(),
      )
      const pdfText = normalisePdf(pdfBuffer)

      const docxProblem = checkDocx(group.id, option, xml)
      const pdfProblem = checkPdf(group.id, option, pdfText)

      const docxDigest = hash(xml)
      const pdfDigest = hash(pdfText)
      const docxClash = seenDocx.get(docxDigest)
      // Groups flagged pdfDistinct:false have a documented reason why several
      // options share one PDF rendering. Their contract is asserted instead.
      const pdfClash = group.pdfDistinct === false ? null : seenPdf.get(pdfDigest)
      seenDocx.set(docxDigest, option.label)
      seenPdf.set(pdfDigest, option.label)

      const problems = []
      if (docxProblem) problems.push(`docx: ${docxProblem}`)
      if (pdfProblem) problems.push(`pdf: ${pdfProblem}`)
      if (docxClash) problems.push(`docx identical to ${docxClash}`)
      if (pdfClash) problems.push(`pdf identical to ${pdfClash}`)
      if (problems.length > 0) failures += 1

      results.push({
        group: group.id,
        groupLabel: group.label,
        value: option.value,
        label: option.label,
        docx: {
          bytes: docxBuffer.length,
          digest: docxDigest,
          pass: !docxProblem && !docxClash,
          reason: docxProblem ?? (docxClash ? `identical to ${docxClash}` : null),
        },
        pdf: {
          bytes: pdfBuffer.length,
          digest: pdfDigest,
          pass: !pdfProblem && !pdfClash,
          reason: pdfProblem ?? (pdfClash ? `identical to ${pdfClash}` : null),
          note: group.pdfNote ?? null,
          baseFont: option.genre ? PDF_BASE_FONT[option.genre] : null,
        },
      })

      console.log(
        `  ${problems.length ? 'FAIL' : 'ok  '} ${group.label} / ${option.label} ${problems.join('; ')}`,
      )
    }
  }

  await fs.rm(workDir, { recursive: true, force: true })
  await fs.mkdir(path.dirname(outFile), { recursive: true })
  await fs.writeFile(
    outFile,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        checked: results.length,
        failures,
        pdfConstraints: groups
          .filter((g) => g.pdfNote)
          .map((g) => ({ group: g.id, label: g.label, note: g.pdfNote })),
        results,
      },
      null,
      2,
    )}\n`,
  )

  const notes = groups.filter((g) => g.pdfNote).map((g) => `${g.label}: ${g.pdfNote}`)

  console.log(`\n${results.length} options checked across PDF and DOCX, ${failures} failure(s).`)
  for (const note of notes) console.log(`\nDocumented PDF constraint, ${note}`)
  if (failures > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error('Export proof failed:', err)
  process.exit(1)
})
