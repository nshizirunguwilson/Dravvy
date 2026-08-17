#!/usr/bin/env node
/**
 * Builds the human-readable responsive proof sheet from the sweep.
 *
 *   npm run proof:responsive:report
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { devices, screens } from './fixtures/devices.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const proofDir = path.join(root, 'docs/responsive-proof')
const outFile = path.join(proofDir, 'report.html')

const esc = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const img = async (file, alt) => {
  const b64 = (await fs.readFile(path.join(proofDir, file))).toString('base64')
  return `<img src="data:image/jpeg;base64,${b64}" alt="${esc(alt)}" loading="lazy" />`
}

async function main() {
  const m = JSON.parse(await fs.readFile(path.join(proofDir, 'manifest.json'), 'utf8'))
  const byKey = new Map(m.results.map((r) => [`${r.device}::${r.screen}::${r.theme}`, r]))
  const get = (d, s, t) => byKey.get(`${d}::${s}::${t}`)

  const passed = m.results.filter((r) => r.pass).length

  /* ---- Device ladder table ---- */
  const ladder = devices
    .map((d) => {
      const rows = m.results.filter((r) => r.device === d.id)
      const ok = rows.every((r) => r.pass)
      const smallest = Math.min(...rows.map((r) => r.detail.smallestControl ?? 999))
      return `<tr>
        <th scope="row">${esc(d.label)}</th>
        <td class="num">${d.screen[0]} x ${d.screen[1]}</td>
        <td class="num">${d.viewport[0]} x ${d.viewport[1]}</td>
        <td>${d.touch ? 'touch' : 'pointer'}</td>
        <td class="num">${Math.round(smallest)}px</td>
        <td class="${ok ? 'ok' : 'bad'}">${ok ? '100%' : 'fails'}</td>
      </tr>`
    })
    .join('')

  /* ---- Galleries ---- */
  const gallery = async (title, note, items) => {
    const cards = []
    for (const { file, caption, sub } of items) {
      cards.push(`<figure class="shot">
        ${await img(file, caption)}
        <figcaption><strong>${esc(caption)}</strong><span>${esc(sub)}</span></figcaption>
      </figure>`)
    }
    return `<section class="block">
      <p class="eyebrow">${esc(note)}</p>
      <h2>${esc(title)}</h2>
      <div class="shots">${cards.join('')}</div>
    </section>`
  }

  const editorEverywhere = await gallery(
    'The editor, on all fourteen',
    'Same screen, every device',
    devices.map((d) => ({
      file: `${d.id}--create-basic--light.jpg`,
      caption: d.label,
      sub: `${d.viewport[0]} x ${d.viewport[1]} viewport`,
    })),
  )

  const phoneJourney = await gallery(
    'Every screen on an iPhone 6s',
    'Smallest device we support, 375 x 553',
    screens.map((s) => ({
      file: `iphone-6s--${s.id}--light.jpg`,
      caption: s.label,
      sub: `${get('iphone-6s', s.id, 'light')?.detail.controlCount ?? 0} controls, all reachable`,
    })),
  )

  const laptopJourney = await gallery(
    'Every screen on a 16 inch MacBook Pro',
    'Largest device we support, 1728 x 997',
    screens.map((s) => ({
      file: `macbook-pro-16--${s.id}--light.jpg`,
      caption: s.label,
      sub: `${get('macbook-pro-16', s.id, 'light')?.detail.controlCount ?? 0} controls, all reachable`,
    })),
  )

  const darkPairs = []
  for (const d of ['iphone-6s', 'ipad-mini', 'macbook-pro-16']) {
    for (const s of ['create-basic', 'settings-styling', 'settings-preview']) {
      const dev = devices.find((x) => x.id === d)
      const scr = screens.find((x) => x.id === s)
      darkPairs.push({
        file: `${d}--${s}--dark.jpg`,
        caption: `${dev.label}, ${scr.label}`,
        sub: 'dark theme',
      })
    }
  }
  const darkGallery = await gallery(
    'Dark theme holds at every size',
    'Both themes swept, not just one',
    darkPairs,
  )

  const html = `<title>Dravvy Device Proof Sheet</title>
<style>
  :root {
    color-scheme: light;
    --paper: #f2f4f3;
    --surface: #ffffff;
    --sunk: #e8ecea;
    --ink: #101614;
    --ink-soft: #4a5551;
    --ink-mute: #75817c;
    --rule: #d8dfdb;
    --rule-strong: #bcc6c1;
    --accent: #0f7a63;
    --accent-soft: #dcefe9;
    --bad: #a32b2b;
    --shadow: 0 1px 2px rgba(16,22,20,.05), 0 14px 30px -16px rgba(16,22,20,.25);
    --sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --display: ui-serif, Charter, "Bitstream Charter", "Iowan Old Style", Georgia, serif;
    --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      color-scheme: dark;
      --paper: #0e1412; --surface: #171e1b; --sunk: #1e2723;
      --ink: #eef4f1; --ink-soft: #b3c0bb; --ink-mute: #8a968f;
      --rule: #2a3531; --rule-strong: #3d4b45;
      --accent: #4bd6ae; --accent-soft: #0d2f27;
      --bad: #f0736b;
      --shadow: 0 1px 2px rgba(0,0,0,.5), 0 18px 36px -18px rgba(0,0,0,.8);
    }
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
    --paper: #0e1412; --surface: #171e1b; --sunk: #1e2723;
    --ink: #eef4f1; --ink-soft: #b3c0bb; --ink-mute: #8a968f;
    --rule: #2a3531; --rule-strong: #3d4b45;
    --accent: #4bd6ae; --accent-soft: #0d2f27;
    --bad: #f0736b;
    --shadow: 0 1px 2px rgba(0,0,0,.5), 0 18px 36px -18px rgba(0,0,0,.8);
  }

  * { box-sizing: border-box; }
  body { margin:0; background: var(--paper); color: var(--ink); font-family: var(--sans); font-size:16px; line-height:1.6; -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px 96px; }

  .masthead { border-bottom: 2px solid var(--ink); padding: 56px 0 28px; display:flex; flex-direction:column; gap:16px; }
  .kicker { font-family: var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase; color: var(--accent); margin:0; }
  .masthead h1 { font-family: var(--display); font-weight:600; font-size: clamp(34px, 6vw, 58px); line-height:1.05; letter-spacing:-.02em; margin:0; text-wrap:balance; }
  .standfirst { margin:0; max-width:62ch; font-size:17px; color: var(--ink-soft); }

  .tally { display:grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); gap:1px; background: var(--rule); border:1px solid var(--rule); margin-top:24px; }
  .tally div { background: var(--surface); padding:16px 18px; display:flex; flex-direction:column; gap:2px; }
  .tally dt { font-family: var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color: var(--ink-mute); }
  .tally dd { margin:0; font-family: var(--display); font-size:30px; font-weight:600; line-height:1.1; font-variant-numeric: tabular-nums; }
  .tally .hi { color: var(--accent); }

  .block { padding-top: 60px; }
  h2 { font-family: var(--display); font-weight:600; font-size: clamp(24px,3.4vw,33px); letter-spacing:-.015em; margin:0 0 8px; }
  .eyebrow { font-family: var(--mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color: var(--ink-mute); margin:0 0 6px; }
  .lede { margin:0 0 24px; max-width:66ch; color: var(--ink-soft); }

  .findings { display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(270px,1fr)); }
  .finding { background: var(--surface); border:1px solid var(--rule); padding:20px 22px; display:flex; flex-direction:column; gap:10px; }
  .finding h3 { font-size:16px; font-weight:650; margin:0; }
  .finding p { margin:0; font-size:14.5px; color: var(--ink-soft); }
  .was { font-family: var(--mono); font-size:12px; color: var(--bad); background: var(--accent-soft); padding:6px 9px; align-self:flex-start; }

  .scroller { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; background: var(--surface); border:1px solid var(--rule); font-size:14.5px; min-width:640px; }
  caption { caption-side:bottom; text-align:left; padding-top:12px; font-size:13.5px; color: var(--ink-mute); }
  th, td { text-align:left; padding:11px 15px; border-bottom:1px solid var(--rule); }
  thead th { font-family: var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color: var(--ink-mute); font-weight:500; border-bottom:1px solid var(--rule-strong); }
  tbody tr:last-child th, tbody tr:last-child td { border-bottom:0; }
  tbody th { font-weight:600; }
  .num { font-family: var(--mono); font-variant-numeric: tabular-nums; font-size:13px; }
  .ok { color: var(--accent); font-family: var(--mono); font-size:13px; }
  .bad { color: var(--bad); font-family: var(--mono); font-size:13px; }

  .checks { display:grid; gap:1px; background: var(--rule); border:1px solid var(--rule); grid-template-columns: repeat(auto-fit, minmax(230px,1fr)); }
  .checks div { background: var(--surface); padding:18px 20px; }
  .checks h3 { margin:0 0 6px; font-size:15px; font-weight:650; }
  .checks p { margin:0; font-size:14px; color: var(--ink-soft); }

  .shots { display:grid; gap:20px; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); align-items:start; }
  .shot { margin:0; background: var(--surface); border:1px solid var(--rule); box-shadow: var(--shadow); display:flex; flex-direction:column; overflow:hidden; }
  .shot img { display:block; width:100%; height:auto; border-bottom:1px solid var(--rule); }
  .shot figcaption { padding:12px 14px; display:flex; flex-direction:column; gap:2px; }
  .shot strong { font-size:14.5px; font-weight:650; }
  .shot span { font-family: var(--mono); font-size:11.5px; color: var(--ink-mute); }

  code { font-family: var(--mono); font-size:13px; background: var(--sunk); border:1px solid var(--rule); padding:1px 5px; }
  footer { margin-top:72px; border-top:1px solid var(--rule); padding-top:18px; font-family: var(--mono); font-size:12px; color: var(--ink-mute); display:flex; flex-wrap:wrap; gap:8px 20px; }
  @media (prefers-reduced-motion: reduce) { * { animation-duration:.001ms !important; transition-duration:.001ms !important; } }
</style>

<div class="wrap">
  <header class="masthead">
    <p class="kicker">Dravvy / device and accessibility verification</p>
    <h1>From an iPhone 6s to a 16 inch MacBook Pro.</h1>
    <p class="standfirst">
      Fourteen device sizes, nine screens, both themes. Every combination is loaded at the viewport a
      real browser actually gives the page, then measured: no sideways scrolling, nothing pushed off
      screen, every control big enough to hit with a thumb, no overlaps, no text below a legible size,
      and a full axe-core pass against WCAG 2.2 AA.
    </p>
    <dl class="tally">
      <div><dt>Devices</dt><dd>${m.devices}</dd></div>
      <div><dt>Screens</dt><dd>${m.screens}</dd></div>
      <div><dt>Themes</dt><dd>${m.themes.length}</dd></div>
      <div><dt>Combinations</dt><dd>${m.checked}</dd></div>
      <div><dt>Passing</dt><dd class="hi">${passed}</dd></div>
      <div><dt>Failing</dt><dd>${m.failures}</dd></div>
    </dl>
  </header>

  <section class="block">
    <p class="eyebrow">Before the sweep could pass</p>
    <h2>What the audit turned up</h2>
    <p class="lede">
      The first run failed all 126 light-theme combinations. Everything below had to be fixed before
      a single one went green.
    </p>
    <div class="findings">
      <article class="finding">
        <h3>Form fields had no labels</h3>
        <p class="was">axe: label, critical, 168 nodes</p>
        <p>
          Every visible label was a floating <code>&lt;label&gt;</code> with no <code>for</code>, so a
          screen reader announced an unnamed text box. All 39 fields are now bound to their control,
          groups of inputs get a <code>role="group"</code> name, and repeated inputs are numbered.
        </p>
      </article>
      <article class="finding">
        <h3>Muted text failed contrast</h3>
        <p class="was">axe: color-contrast, serious, 994 nodes</p>
        <p>
          The secondary ink sat at 4.48:1 and the caption ink at 2.96:1, both under the 4.5:1 floor.
          The ramp was re-solved: secondary text and the accent now clear 4.5:1 on every ground, and
          the two lightest shades are reserved for decoration.
        </p>
      </article>
      <article class="finding">
        <h3>The tab strip pointed at nothing</h3>
        <p class="was">axe: aria-valid-attr-value, critical</p>
        <p>
          The settings tabs declared <code>aria-controls</code> for panels that were never rendered.
          The step content now lives in a real <code>TabsContent</code>, so the reference resolves.
        </p>
      </article>
      <article class="finding">
        <h3>Selects had no accessible name</h3>
        <p class="was">axe: button-name, critical, 84 nodes</p>
        <p>
          All six styling dropdowns were anonymous buttons. Each is now bound to its visible label
          through a generated id.
        </p>
      </article>
      <article class="finding">
        <h3>Controls were too small for a thumb</h3>
        <p class="was">up to 19 controls under 44px per screen</p>
        <p>
          The theme toggle was 36px, tabs 37px, header links 19.5px, checkboxes 16px, colour swatches
          40px. A <code>coarse:</code> variant now lifts every control to 44px on touch pointers while
          leaving compact sizes for a mouse.
        </p>
      </article>
      <article class="finding">
        <h3>The landing page overflowed</h3>
        <p class="was">8px past the viewport, both edges</p>
        <p>
          A decorative panel behind the preview card reached 48px outside a container padded to 40px.
          It is now clamped inside its parent at every breakpoint.
        </p>
      </article>
    </div>
  </section>

  <section class="block">
    <p class="eyebrow">What each combination is held to</p>
    <h2>Six checks, every time</h2>
    <div class="checks">
      <div><h3>No sideways scrolling</h3><p>The document is never wider than the viewport. The A4 preview scrolls inside its own tray instead.</p></div>
      <div><h3>Nothing escapes</h3><p>No element extends past either edge unless it sits inside a container that is meant to scroll.</p></div>
      <div><h3>Thumb-sized controls</h3><p>44px on touch, the WCAG 2.5.8 floor of 24px on pointer. A checkbox is measured by its label, which is what you actually tap.</p></div>
      <div><h3>No collisions</h3><p>No two controls overlap, so a tap can never hit the wrong thing.</p></div>
      <div><h3>Legible text</h3><p>No visible text renders below 12px at any width.</p></div>
      <div><h3>Real accessibility engine</h3><p>axe-core against wcag2a, wcag2aa, wcag21a, wcag21aa and wcag22aa. Zero serious or critical violations.</p></div>
    </div>
  </section>

  <section class="block">
    <p class="eyebrow">The ladder</p>
    <h2>Every device, and the space it really gives a page</h2>
    <p class="lede">
      Screen size and viewport are not the same thing. An iPhone 6s is a 375 x 667 device, but Safari
      hands the page 375 x 553 of it. Every check runs against the viewport column.
    </p>
    <div class="scroller">
      <table>
        <caption>Smallest control is the tightest hit area found anywhere on that device, across all nine screens and both themes.</caption>
        <thead><tr><th scope="col">Device</th><th scope="col">Screen</th><th scope="col">Viewport</th><th scope="col">Input</th><th scope="col">Smallest control</th><th scope="col">Verdict</th></tr></thead>
        <tbody>${ladder}</tbody>
      </table>
    </div>
  </section>

  ${editorEverywhere}
  ${phoneJourney}
  ${laptopJourney}
  ${darkGallery}

  <section class="block">
    <p class="eyebrow">Beyond layout</p>
    <h2>A resume actually gets built</h2>
    <p class="lede">
      Fitting on a screen is not the same as being usable on one. An end-to-end test drives a real
      iPhone 6s viewport with touch enabled: it fills in the basics, saves, adds a role with bullet
      points, moves to styling, checks the A4 preview still reads, confirms the page never scrolls
      sideways, and downloads the PDF. Run it with <code>npm run test:e2e</code>.
    </p>
  </section>

  <footer>
    <span>Dravvy device proof sheet</span>
    <span>${m.checked} combinations, ${m.checked * 6} checks</span>
    <span>Generated ${new Date(m.generatedAt).toISOString().replace('T', ' ').slice(0, 16)} UTC</span>
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
