<div align="center">

<img src="public/icon.svg" width="64" height="64" alt="Dravvy logo" />

# Dravvy

**Build a resume you'll actually want to send.**

A no-account, browser-only resume builder. Nine guided sections, a true A4
preview, and one-click export as a print-ready PDF or an editable DOCX.

[Features](#highlights) · [Screenshots](#screenshots) · [Getting started](#getting-started) · [Stack](#stack)

</div>

---

## Highlights

<img src="docs/screenshots/home-desktop.png" alt="Dravvy landing page" width="100%" />

- **No account, no upload.** Your draft lives in your browser. Clear site
  data and it's gone — nothing to sign up for, nothing on a server.
- **Nine guided sections** with inline validation: Basics, Work, Education,
  Skills, Certifications, Awards, Projects, Languages, References.
- **True A4 live preview** dimensioned to the millimetre, so what you see in
  the editor is what gets exported.
- **One-click export** as a print-ready A4 PDF *or* an editable DOCX that
  opens cleanly in Microsoft Word, Pages and Google Docs.
- **ATS-friendly defaults** — single-column body, standard fonts, plain
  section headings — chosen so applicant tracking systems read every line.
- **Stylable without code** — pick a typeface, accent, separator, body size,
  spacing rhythm and date format; the choice flows into the preview, the
  PDF and the DOCX.
- **Responsive down to 320px** (iPhone 5/SE).

---

## Screenshots

### Editor — pick a section, fill the form, see your progress

<img src="docs/screenshots/create-desktop.png" alt="Dravvy editor with sections rail and form" width="100%" />

A vertical sections rail on the left tracks completion in real time. Each
field has a visible boundary, a label above the input, and a clear required
marker. The footer always shows what comes next.

### Style & export — final touches before download

<img src="docs/screenshots/settings-desktop.png" alt="Dravvy styling page with theme, typeface, accent picker" width="100%" />

A pill-style segmented tab nav switches between **Styling**, **Preview** and
**Export**. The accent picker offers nine presets and a custom hex; the
selection is reflected in the preview, the PDF and the DOCX.

### Mobile — built down to iPhone 5

<table>
  <tr>
    <td align="center" width="50%">
      <img src="docs/screenshots/home-mobile.png" alt="Landing on a 390px viewport" />
      <br /><sub><b>Landing</b> · 390px</sub>
    </td>
    <td align="center" width="50%">
      <img src="docs/screenshots/create-mobile.png" alt="Editor on a 390px viewport" />
      <br /><sub><b>Editor</b> · 390px</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="docs/screenshots/settings-mobile.png" alt="Settings on a 390px viewport" />
      <br /><sub><b>Settings</b> · 390px</sub>
    </td>
    <td align="center" width="50%">
      <img src="docs/screenshots/create-iphone5.png" alt="Editor on a 320px viewport" />
      <br /><sub><b>Editor</b> · 320px (iPhone 5)</sub>
    </td>
  </tr>
</table>

The sections rail collapses to a horizontally-scrollable pill nav at < `lg`
(1024px) so the form gets the screen on small devices. CTAs stack
vertically and labels switch to compact variants on the smallest widths.

---

## Section coverage

| Section            | Required fields                                                          | Multiple entries |
| ------------------ | ------------------------------------------------------------------------ | ---------------- |
| Basic information  | Full name, email, phone, location, professional summary                  | No               |
| Work experience    | Job title, company, start date, end date or *current*, 2–4 bullet points | Yes              |
| Education          | Degree, field, institution, start date, end date / expected              | Yes              |
| Skills             | Category name + at least one skill                                       | Yes              |
| Certifications     | Title, issuer, issue date                                                | Yes              |
| Awards             | Title, issuer, date                                                      | Yes              |
| Projects           | Name, description (≥1 bullet), tech stack (≥1)                           | Yes              |
| Languages          | Language + proficiency (native / fluent / proficient / intermediate / …) | Yes              |
| References         | Either *available upon request* **or** named entries with full contacts  | Yes              |

Optional fields (LinkedIn, GitHub, personal site, GPA, certificate URL,
project link) appear in the preview/exports only when filled in.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript** in strict mode
- **Tailwind CSS** with a hand-tuned token system in [`globals.css`](src/app/globals.css)
- **Plus Jakarta Sans** as the single typeface (loaded via `next/font`)
- **Radix UI** primitives (Select, Tabs, Switch, Progress, Radio, Dialog)
- **Zustand** for the in-browser draft store
- **React Hook Form** + **Zod** for form state and validation
- **Framer Motion** for section transitions and micro-interactions
- **Sonner** for toasts
- **`@react-pdf/renderer`** for PDF export, **`docx`** for DOCX export

---

## Getting started

```bash
git clone https://github.com/nshizirunguwilson/dravvy.git
cd dravvy
npm install
npm run dev          # http://localhost:3000
```

### Scripts

| Script                | What it does                                                                  |
| --------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`         | Next.js dev server with hot reload.                                           |
| `npm run build`       | Production build (also runs `next lint` and TypeScript checks).               |
| `npm run start`       | Serves the production build.                                                  |
| `npm run lint`        | Runs the Next/ESLint ruleset.                                                 |
| `npm run typecheck`   | Strict TypeScript pass with no emit.                                          |
| `npm run test:export` | Headless smoke test: renders the PDF and DOCX from a fixture and asserts the file headers. |
| `npm run format`      | Prettier formatting.                                                          |

The export smoke test is fully headless — it bundles the export modules
with esbuild, runs them in Node, and asserts that the PDF starts with
`%PDF` and the DOCX is a valid zip. CI can run it without a browser.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx            Root layout, fonts, sonner toaster, error boundary
│   ├── page.tsx              Landing page
│   ├── create/page.tsx       Multi-step builder
│   ├── settings/page.tsx     Style + preview + export
│   ├── icon.tsx              Generated 64px favicon
│   ├── opengraph-image.tsx   Generated 1200×630 OG image
│   ├── not-found.tsx         404 page
│   └── globals.css           Design tokens + base styles
│
├── components/
│   ├── brand.tsx             Mark + Wordmark
│   ├── error-boundary.tsx
│   ├── export-form.tsx       PDF/DOCX export controls
│   ├── progress-tracker.tsx  Sections rail (vertical on lg+, pill scroll on <lg)
│   ├── resume-form.tsx       The nine guided sections
│   ├── resume-pdf.tsx        @react-pdf/renderer document
│   ├── resume-preview.tsx    Live A4 preview
│   ├── styling-form.tsx      Theme, typeface, accent, etc.
│   └── ui/                   Branded primitives (button, input, select, …)
│
├── hooks/                    Small client hooks (useHydration, …)
├── lib/                      Utilities (cn, resume-docx builder, …)
├── store/                    Zustand stores (resume + UI state)
└── types/                    Shared types (ResumeStyle, Experience, …)
```

---

## Design notes

- **One sans family** — Plus Jakarta Sans, no serif, no mono spec labels.
  Typography hierarchy is carried by weight (400 / 500 / 600 / 700) and
  scale, not by mixing families.
- **Cool slate canvas + white surfaces.** A single restrained blue accent
  (`hsl(220 88% 56%)`) on the primary CTA, focus rings and links — never
  on every interactive element.
- **Bordered fields with labels above.** Inputs are 44px tall, white, with
  a 1px slate border at rest and a brand-coloured focus ring. Labels sit
  above the field at 14px / weight 500, in normal sentence case.
- **Three radii** — `8px` (sm), `12px` (default), `18px` (lg) — used for
  different surface roles, not the same radius for everything.
- **Layered shadows** — five shadows from `xs` to `pop`, each composed of
  a tight ambient shadow plus a soft cast, so cards lift without halos.
- **Reduced motion respected** throughout (transitions and animations
  collapse to ≈0ms when the user prefers reduced motion).
- **Dark-mode tokens defined** in `globals.css` for a future toggle.

---

## Privacy

- No accounts.
- No upload.
- No analytics, no telemetry, no third-party trackers.
- The draft is persisted in your browser via `localStorage` (Zustand
  `persist` middleware). Clear site data and the draft is gone with it.

---

## License

This project is open source. See the repository for license details.
