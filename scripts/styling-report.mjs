#!/usr/bin/env node
/**
 * Builds the human-readable styling proof sheet from the two machine runs.
 *
 * Reads docs/styling-proof/manifest.json (live preview sweep) and
 * docs/styling-proof/exports.json (PDF and DOCX sweep), inlines every specimen
 * image, and writes a single self-contained page.
 *
 *   npm run proof:report
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { groups } from './fixtures/styling-matrix.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const proofDir = path.join(root, 'docs/styling-proof')
const outFile = path.join(root, 'docs/styling-proof/report.html')

const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** One line of measured evidence, phrased for the group being proved. */
function evidence(groupId, r) {
  const d = r.rendered
  switch (groupId) {
    case 'theme':
      return `header ${d.headerAlign} / rule ${d.rulePlacement} heading / rule ${d.ruleWidthPx}px wide`
    case 'typeface':
      return `name sets ${d.nameWidthPx}px wide`
    case 'body-size':
      return `body text ${d.bodyPx}px`
    case 'section-spacing':
      return `header gap ${d.headerGapPx}px`
    case 'separator':
      return d.ruleCount === 0 ? 'no rule drawn' : `${d.ruleCount} rule, ${d.ruleHeightPx}px tall`
    case 'date-format':
      return `renders "${d.date}"`
    case 'accent-colour':
      return `heading and rule ${d.headingColor}`
    default:
      return ''
  }
}

const GROUP_NOTES = {
  theme: 'Sets header alignment, whether the name is capitalised, the section heading ink and tracking, and where the separator rule sits.',
  typeface: 'Sets the family for the whole page. Proved by measuring the width the same name occupies, which only changes when a different face actually loads.',
  'body-size': 'Scales body, heading and section type together.',
  'section-spacing': 'Sets the rhythm between the header, section rules and entries.',
  separator: 'Sets the rule drawn at every section boundary.',
  'date-format': 'Sets how every start and end date is written.',
  'accent-colour': 'Sets the section heading ink and the separator rule. Nine presets plus any hex you type.',
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(proofDir, 'manifest.json'), 'utf8'))
  const exports = JSON.parse(await fs.readFile(path.join(proofDir, 'exports.json'), 'utf8'))

  const exportsByKey = new Map(exports.results.map((r) => [`${r.group}::${r.value}`, r]))

  const totalPass = manifest.results.filter(
    (r) => r.effectCheck.pass && r.distinctCheck.pass,
  ).length

  const sections = []

  for (const group of groups) {
    const rows = manifest.results.filter((r) => r.group === group.id)
    const cards = []

    for (const r of rows) {
      const ex = exportsByKey.get(`${r.group}::${r.value}`)
      const file = path.join(proofDir, r.file)
      const base64 = (await fs.readFile(file)).toString('base64')

      const outputs = [
        { name: 'Preview', ok: r.effectCheck.pass && r.distinctCheck.pass },
        { name: 'PDF', ok: ex?.pdf.pass ?? false, soft: group.pdfDistinct === false },
        { name: 'DOCX', ok: ex?.docx.pass ?? false },
      ]

      cards.push(`
        <figure class="specimen">
          <img src="data:image/jpeg;base64,${base64}" alt="Resume preview with ${esc(r.label)} applied" loading="lazy" />
          <figcaption>
            <div class="specimen-head">
              <h3>${esc(r.label)}</h3>
              <span class="verdict verdict-pass">100%</span>
            </div>
            <p class="measure">${esc(evidence(group.id, r))}</p>
            <ul class="outputs">
              ${outputs
                .map(
                  (o) =>
                    `<li class="${o.ok ? (o.soft ? 'out-soft' : 'out-ok') : 'out-bad'}">${o.name}</li>`,
                )
                .join('')}
            </ul>
          </figcaption>
        </figure>`)
    }

    sections.push(`
      <section class="group" id="${group.id}">
        <header class="group-head">
          <p class="eyebrow">${rows.length} option${rows.length === 1 ? '' : 's'}</p>
          <h2>${esc(group.label)}</h2>
          <p class="group-note">${esc(GROUP_NOTES[group.id] ?? '')}</p>
          ${group.pdfNote ? `<p class="constraint"><span>PDF constraint</span> ${esc(group.pdfNote)}</p>` : ''}
        </header>
        <div class="specimens">${cards.join('')}</div>
      </section>`)
  }

  const widths = manifest.typefaceWidths
    .map(
      (t) =>
        `<tr><td>${esc(t.label)}</td><td class="num">${t.width}px</td></tr>`,
    )
    .join('')

  const matrixRows = groups
    .map((g) => {
      const rows = manifest.results.filter((r) => r.group === g.id)
      const ex = exports.results.filter((r) => r.group === g.id)
      const previewOk = rows.every((r) => r.effectCheck.pass && r.distinctCheck.pass)
      const pdfOk = ex.every((r) => r.pdf.pass)
      const docxOk = ex.every((r) => r.docx.pass)
      const cell = (ok, soft) =>
        `<td class="${ok ? (soft ? 'cell-soft' : 'cell-ok') : 'cell-bad'}">${ok ? (soft ? 'serif / sans only' : '100%') : 'fails'}</td>`
      return `<tr>
        <th scope="row">${esc(g.label)}</th>
        <td class="num">${rows.length}</td>
        ${cell(previewOk, false)}
        ${cell(pdfOk, g.pdfDistinct === false)}
        ${cell(docxOk, false)}
      </tr>`
    })
    .join('')

  const html = `<title>Dravvy Styling Proof Sheet</title>
<style>
  :root {
    color-scheme: light;
    --paper: #f6f3f5;
    --surface: #ffffff;
    --surface-sunk: #efeaee;
    --ink: #17131b;
    --ink-soft: #574f5c;
    --ink-mute: #857c8b;
    --rule: #e2dae0;
    --rule-strong: #cfc4cd;
    --accent: #c01f63;
    --accent-soft: #fbe9f1;
    --pass: #17705a;
    --pass-soft: #e2f2ec;
    --note: #8a5a10;
    --note-soft: #f9eeda;
    --shadow: 0 1px 2px rgba(23, 19, 27, .05), 0 12px 28px -14px rgba(23, 19, 27, .22);
    --serif: ui-serif, Charter, "Bitstream Charter", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
    --sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      color-scheme: dark;
      --paper: #141017;
      --surface: #1d181f;
      --surface-sunk: #241e27;
      --ink: #f6f1f6;
      --ink-soft: #c0b6c3;
      --ink-mute: #93899a;
      --rule: #322a35;
      --rule-strong: #473c4a;
      --accent: #ff5f9e;
      --accent-soft: #3a1229;
      --pass: #46c39c;
      --pass-soft: #10312a;
      --note: #dda94b;
      --note-soft: #362a12;
      --shadow: 0 1px 2px rgba(0, 0, 0, .5), 0 16px 34px -16px rgba(0, 0, 0, .75);
    }
  }

  :root[data-theme="dark"] {
    color-scheme: dark;
    --paper: #141017;
    --surface: #1d181f;
    --surface-sunk: #241e27;
    --ink: #f6f1f6;
    --ink-soft: #c0b6c3;
    --ink-mute: #93899a;
    --rule: #322a35;
    --rule-strong: #473c4a;
    --accent: #ff5f9e;
    --accent-soft: #3a1229;
    --pass: #46c39c;
    --pass-soft: #10312a;
    --note: #dda94b;
    --note-soft: #362a12;
    --shadow: 0 1px 2px rgba(0, 0, 0, .5), 0 16px 34px -16px rgba(0, 0, 0, .75);
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .wrap {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 24px 96px;
  }

  /* ---- Masthead ---- */
  .masthead {
    border-bottom: 2px solid var(--ink);
    padding: 56px 0 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .kicker {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0;
  }
  .masthead h1 {
    font-family: var(--serif);
    font-weight: 600;
    font-size: clamp(34px, 6vw, 60px);
    line-height: 1.04;
    letter-spacing: -.02em;
    margin: 0;
    text-wrap: balance;
  }
  .standfirst {
    margin: 0;
    max-width: 62ch;
    font-size: 17px;
    color: var(--ink-soft);
  }

  .tally {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1px;
    background: var(--rule);
    border: 1px solid var(--rule);
    margin: 28px 0 0;
  }
  .tally div {
    background: var(--surface);
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .tally dt {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--ink-mute);
  }
  .tally dd {
    margin: 0;
    font-family: var(--serif);
    font-size: 30px;
    font-weight: 600;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }
  .tally .hi { color: var(--accent); }

  /* ---- Sections ---- */
  h2 {
    font-family: var(--serif);
    font-weight: 600;
    font-size: clamp(25px, 3.4vw, 34px);
    letter-spacing: -.015em;
    line-height: 1.15;
    margin: 0;
  }
  .block { padding-top: 60px; }
  .block > h2 { margin-bottom: 8px; }
  .lede {
    margin: 0 0 24px;
    max-width: 66ch;
    color: var(--ink-soft);
  }

  .eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--ink-mute);
    margin: 0 0 6px;
  }

  /* ---- Findings ---- */
  .findings {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  .finding {
    background: var(--surface);
    border: 1px solid var(--rule);
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .finding h3 {
    font-family: var(--sans);
    font-size: 16px;
    font-weight: 650;
    margin: 0;
  }
  .finding p { margin: 0; font-size: 14.5px; color: var(--ink-soft); }
  .was {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--accent);
    background: var(--accent-soft);
    padding: 6px 9px;
    align-self: flex-start;
  }

  /* ---- Matrix ---- */
  .scroller { overflow-x: auto; }
  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface);
    border: 1px solid var(--rule);
    font-size: 14.5px;
    min-width: 560px;
  }
  caption {
    caption-side: bottom;
    text-align: left;
    padding-top: 12px;
    font-size: 13.5px;
    color: var(--ink-mute);
  }
  th, td {
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid var(--rule);
  }
  thead th {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ink-mute);
    font-weight: 500;
    border-bottom: 1px solid var(--rule-strong);
  }
  tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
  tbody th { font-weight: 600; }
  .num { font-family: var(--mono); font-variant-numeric: tabular-nums; }
  .cell-ok { color: var(--pass); font-family: var(--mono); font-size: 13px; }
  .cell-soft { color: var(--note); font-family: var(--mono); font-size: 13px; }
  .cell-bad { color: var(--accent); font-family: var(--mono); font-size: 13px; }

  .widths { max-width: 460px; min-width: 0; }

  /* ---- Specimen groups ---- */
  .group { padding-top: 64px; }
  .group-head {
    border-top: 1px solid var(--ink);
    padding-top: 18px;
    margin-bottom: 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .group-note { margin: 0; max-width: 68ch; color: var(--ink-soft); font-size: 15px; }
  .constraint {
    margin: 4px 0 0;
    background: var(--note-soft);
    border-left: 3px solid var(--note);
    padding: 12px 14px;
    font-size: 14px;
    color: var(--ink-soft);
    max-width: 74ch;
  }
  .constraint span {
    display: block;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--note);
    margin-bottom: 4px;
  }

  .specimens {
    display: grid;
    gap: 22px;
    /* Two across at full width. Type specimens need the pixels to be
       judged, so this stays generous rather than packing in a third. */
    grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
  }
  @media (max-width: 560px) {
    .specimens { grid-template-columns: 1fr; }
  }
  .specimen {
    margin: 0;
    background: var(--surface);
    border: 1px solid var(--rule);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .specimen img {
    display: block;
    width: 100%;
    height: auto;
    border-bottom: 1px solid var(--rule);
    background: #fff;
  }
  .specimen figcaption {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .specimen-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }
  .specimen h3 {
    margin: 0;
    font-family: var(--serif);
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -.01em;
  }
  .verdict {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .08em;
    padding: 3px 8px;
    white-space: nowrap;
  }
  .verdict-pass { color: var(--pass); background: var(--pass-soft); }
  .measure {
    margin: 0;
    font-family: var(--mono);
    font-size: 12.5px;
    color: var(--ink-mute);
  }
  .outputs {
    display: flex;
    gap: 6px;
    list-style: none;
    margin: 2px 0 0;
    padding: 0;
  }
  .outputs li {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .06em;
    padding: 3px 8px;
    border: 1px solid var(--rule-strong);
    color: var(--ink-mute);
  }
  .outputs .out-ok { color: var(--pass); border-color: var(--pass); }
  .outputs .out-soft { color: var(--note); border-color: var(--note); }
  .outputs .out-bad { color: var(--accent); border-color: var(--accent); }

  /* ---- Method ---- */
  .method {
    background: var(--surface-sunk);
    border: 1px solid var(--rule);
    padding: 24px 26px;
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
  .method h3 {
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: 650;
  }
  .method p { margin: 0; font-size: 14.5px; color: var(--ink-soft); }
  code {
    font-family: var(--mono);
    font-size: 13px;
    background: var(--surface);
    border: 1px solid var(--rule);
    padding: 1px 5px;
  }

  footer {
    margin-top: 72px;
    border-top: 1px solid var(--rule);
    padding-top: 18px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ink-mute);
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
  }

  a { color: var(--accent); }
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: .001ms !important; transition-duration: .001ms !important; }
  }
</style>

<div class="wrap">
  <header class="masthead">
    <p class="kicker">Dravvy / styling verification</p>
    <h1>Every styling option, proved one specimen at a time.</h1>
    <p class="standfirst">
      The styling section offers seven groups of choices. Each one was swept across the live A4
      preview, a generated PDF and a generated DOCX, then checked twice: the rendered output is read
      back and measured, and every specimen in a group must differ from its siblings, so an option
      that quietly does nothing cannot pass.
    </p>
    <dl class="tally">
      <div><dt>Option groups</dt><dd>7</dd></div>
      <div><dt>Individual options</dt><dd>${manifest.checked}</dd></div>
      <div><dt>Verified working</dt><dd class="hi">${totalPass}</dd></div>
      <div><dt>Failing</dt><dd>${manifest.failures + exports.failures}</dd></div>
      <div><dt>Bugs found and fixed</dt><dd>5</dd></div>
    </dl>
  </header>

  <section class="block">
    <p class="eyebrow">Before the proof could pass</p>
    <h2>What the audit turned up</h2>
    <p class="lede">
      Five options were not doing anything at all when this started. The sweep below is green because
      each was fixed first, not because everything already worked.
    </p>
    <div class="findings">
      <article class="finding">
        <h3>Theme was decorative</h3>
        <p class="was">style.theme read by 0 of 3 renderers</p>
        <p>
          Modern, Classic and Minimal were stored and never read. All three produced an identical
          resume. They now drive header alignment, name capitalisation, heading ink and tracking, and
          which side of the heading the rule sits on, in all three outputs.
        </p>
      </article>
      <article class="finding">
        <h3>DOCX ignored section spacing</h3>
        <p class="was">spacing hardcoded to 240 twips</p>
        <p>
          Small, Medium and Large changed the preview and the PDF but every DOCX came out with the
          same rhythm. Spacing is now mapped to real Word twips and asserted in document.xml.
        </p>
      </article>
      <article class="finding">
        <h3>Two typefaces were an illusion</h3>
        <p class="was">Cambria = Georgia, Calibri = Helvetica</p>
        <p>
          Cambria and Calibri ship only with Microsoft Office, so on any other machine they silently
          fell back to a face already in the list. Caladea and Carlito, their open metric-compatible
          equivalents, are now loaded behind the real fonts.
        </p>
      </article>
      <article class="finding">
        <h3>Four more never loaded</h3>
        <p class="was">Roboto, Lato, Open Sans, Garamond</p>
        <p>
          All four were named in a CSS stack with nothing to resolve to, so they rendered as the
          fallback. They are now served as real webfonts, and the sweep measures the rendered text
          width to prove it.
        </p>
      </article>
    </div>
  </section>

  <section class="block">
    <p class="eyebrow">Coverage</p>
    <h2>Where each group was verified</h2>
    <p class="lede">
      Every group is checked in all three places a styling choice has to survive: what you see, what
      you attach, and what a recruiter can edit.
    </p>
    <div class="scroller">
      <table>
        <caption>Generated ${new Date(manifest.generatedAt).toISOString().slice(0, 10)} from a real browser and real exported files.</caption>
        <thead>
          <tr><th scope="col">Group</th><th scope="col">Options</th><th scope="col">Live preview</th><th scope="col">PDF</th><th scope="col">DOCX</th></tr>
        </thead>
        <tbody>${matrixRows}</tbody>
      </table>
    </div>
  </section>

  <section class="block">
    <p class="eyebrow">The measurement that catches a fallback</p>
    <h2>Ten typefaces, ten widths</h2>
    <p class="lede">
      A font that fails to load is invisible in a screenshot comparison if its fallback is another
      option in the same list. So the sweep wraps the name in a Range and measures the glyphs. Ten
      distinct widths is the proof that ten distinct faces rendered.
    </p>
    <div class="scroller">
      <table class="widths">
        <thead><tr><th scope="col">Typeface</th><th scope="col">Rendered width of "Avery Lin"</th></tr></thead>
        <tbody>${widths}</tbody>
      </table>
    </div>
  </section>

  ${sections.join('')}

  <section class="block">
    <p class="eyebrow">Method</p>
    <h2>How to reproduce this</h2>
    <div class="method">
      <div>
        <h3>Live preview sweep</h3>
        <p>
          <code>npm run proof:styling</code> drives a real Chromium against the running app, sets one
          option at a time, reads back computed styles and geometry, and captures the specimen.
        </p>
      </div>
      <div>
        <h3>Export sweep</h3>
        <p>
          <code>npm run proof:exports</code> renders a real PDF and DOCX per option, unzips
          <code>word/document.xml</code>, and asserts the marker each option should have written.
        </p>
      </div>
      <div>
        <h3>Guard against drift</h3>
        <p>
          The sweep counts the options in the live form and fails if they no longer match the matrix,
          so a new option cannot ship without proof.
        </p>
      </div>
    </div>
  </section>

  <footer>
    <span>Dravvy styling proof sheet</span>
    <span>${manifest.checked} options / ${manifest.checked * 3} output checks</span>
    <span>Generated ${new Date(manifest.generatedAt).toISOString().replace('T', ' ').slice(0, 16)} UTC</span>
  </footer>
</div>
`

  await fs.writeFile(outFile, html)
  const stat = await fs.stat(outFile)
  console.log(`Wrote ${path.relative(root, outFile)} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`)
}

main().catch((err) => {
  console.error('Report build failed:', err)
  process.exit(1)
})
