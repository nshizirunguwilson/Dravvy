// Drives the DOCX and PDF export pipelines outside the browser to verify they
// produce valid files end-to-end. Run with `node scripts/export-smoke.mjs`.
//
// We compile the relevant TS modules with esbuild on the fly so this stays
// dependency-free of test runners.

import { build } from 'esbuild'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import React from 'react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const fixture = {
  contact: {
    fullName: 'Avery Lin',
    email: 'avery@example.com',
    phone: '+1 555 010 1010',
    location: 'Brooklyn, NY',
    website: 'https://avery.dev',
    linkedin: 'https://linkedin.com/in/averylin',
    github: 'https://github.com/averylin',
  },
  summary:
    'Senior product designer with eight years building consumer fintech products. Comfortable owning research, design and delivery across cross-functional teams.',
  experience: [
    {
      id: 'e1',
      company: 'Holloway Financial',
      position: 'Lead Product Designer',
      startDate: '2022-04-01',
      endDate: '',
      current: true,
      description: [
        'Owned end-to-end design for the merchant dashboard, raising activation 38%.',
        'Coached three designers and ran a quarterly research cadence.',
      ],
    },
    {
      id: 'e2',
      company: 'Northwind',
      position: 'Senior Product Designer',
      startDate: '2019-08-01',
      endDate: '2022-03-15',
      current: false,
      description: [
        'Led the design system migration to Figma libraries.',
        'Shipped a payments redesign that reduced support tickets 22%.',
      ],
    },
  ],
  education: [
    {
      id: 'd1',
      school: 'Rhode Island School of Design',
      degree: 'B.A.',
      field: 'Graphic Design',
      startDate: '2014-09-01',
      endDate: '2018-05-30',
      gpa: '3.8',
    },
  ],
  skills: [
    { id: 's1', category: 'Design', skills: ['Figma', 'Prototyping', 'Design Systems'] },
    { id: 's2', category: 'Research', skills: ['Interviews', 'Usability Testing'] },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Open Pay',
      description: ['Open-source toolkit for embedding pay-by-link flows.', 'Cited by 4 fintech publications.'],
      technologies: ['React', 'Stripe', 'Tailwind CSS'],
      link: 'https://openpay.example',
    },
  ],
  certifications: [
    { id: 'c1', name: 'Google UX Design Certificate', issuer: 'Coursera', date: '2021-08-01', link: '' },
  ],
  awards: [
    {
      id: 'a1',
      title: 'IxDA Awards Finalist',
      issuer: 'Interaction Design Association',
      date: '2023-02-04',
      description: 'Recognized for the Holloway merchant onboarding flow.',
    },
  ],
  languages: [
    { id: 'l1', language: 'English', proficiency: 'native' },
    { id: 'l2', language: 'Mandarin', proficiency: 'fluent' },
  ],
  references: [
    { id: 'r1', name: 'Priya Nair', relationship: 'Former Manager', email: 'priya@example.com', phone: '+1 555 222 3333' },
  ],
  referencesMode: 'include',
  style: {
    theme: 'modern',
    fontSize: 'medium',
    spacing: 'medium',
    color: '#1e3a8a',
    font: 'helvetica',
    separator: 'line',
    dateFormat: 'MMM YYYY',
    showLinks: true,
    showSkillProficiency: true,
  },
}

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
    alias: {
      '@': path.join(root, 'src'),
    },
    logLevel: 'silent',
  })
}

async function main() {
  const tmp = path.join(root, '.export-smoke')
  await fs.rm(tmp, { recursive: true, force: true })
  await fs.mkdir(tmp, { recursive: true })

  // DOCX
  const docxOut = path.join(tmp, 'docx.mjs')
  await compile(path.join(root, 'src/lib/resume-docx.ts'), docxOut)
  const docxModule = await import(pathToFileURL(docxOut).href)
  const docxBlob = await docxModule.buildResumeDocxBlob(fixture)
  const docxBuffer = Buffer.from(await docxBlob.arrayBuffer())
  const docxPath = path.join(tmp, 'avery-lin-resume.docx')
  await fs.writeFile(docxPath, docxBuffer)

  // PDF
  const pdfOut = path.join(tmp, 'pdf.mjs')
  await compile(path.join(root, 'src/components/resume-pdf.tsx'), pdfOut)
  const pdfModule = await import(pathToFileURL(pdfOut).href)
  const { pdf } = await import('@react-pdf/renderer')
  const blob = await pdf(React.createElement(pdfModule.ResumePDF, { data: fixture })).toBlob()
  const pdfBuffer = Buffer.from(await blob.arrayBuffer())
  const pdfPath = path.join(tmp, 'avery-lin-resume.pdf')
  await fs.writeFile(pdfPath, pdfBuffer)

  // Sanity assertions
  const docxStat = await fs.stat(docxPath)
  const pdfStat = await fs.stat(pdfPath)

  const docxHeader = docxBuffer.slice(0, 2).toString('utf8')
  const pdfHeader = pdfBuffer.slice(0, 4).toString('utf8')

  const ok = []
  if (docxHeader === 'PK') ok.push(`docx OK (${docxStat.size} bytes)`)
  else ok.push(`docx FAIL header=${docxHeader}`)
  if (pdfHeader === '%PDF') ok.push(`pdf OK (${pdfStat.size} bytes)`)
  else ok.push(`pdf FAIL header=${pdfHeader}`)

  console.log(ok.join('\n'))
  if (docxHeader !== 'PK' || pdfHeader !== '%PDF') {
    process.exitCode = 1
  } else {
    console.log(`Outputs in ${path.relative(root, tmp)}/`)
  }
}

main().catch((err) => {
  console.error('Smoke test failed:', err)
  process.exit(1)
})
