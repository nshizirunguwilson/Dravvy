# Dravvy

A no-account, browser-only resume builder. Walk through nine guided sections,
pick a styling that matches your taste, see a true A4 preview, and export the
result as a print-ready PDF or an editable DOCX.

> Stack: Next.js 14 App Router · TypeScript · Tailwind CSS · Zustand · Radix UI
> · Sonner · Framer Motion · `@react-pdf/renderer` · `docx`.

---

## Highlights

- **Nine-step builder** with inline validation, free reordering between
  sections, and automatic local persistence (no account, no server).
- **Live A4 preview** dimensioned exactly like the export so what you see is
  what gets printed.
- **Two export targets** with one click: A4 PDF (for printing or upload) and
  DOCX (editable in Word, Google Docs and Pages).
- **Styling controls** for theme, accent color, font family, font size,
  spacing, separator style and date format. The same settings flow into the
  preview, the PDF and the DOCX.
- **Quiet design defaults** — sans-serif body, single-column layout, neutral
  accents — chosen to play well with applicant tracking systems.
- **No emoji, no AI clichés, no hidden upsells.**

---

## Section coverage

| Section            | Required fields                                                            | Multiple entries |
| ------------------ | -------------------------------------------------------------------------- | ---------------- |
| Basic Information  | Full name, email, phone, location, professional summary                    | No               |
| Work Experience    | Job title, company, start date, end date or _current_, 2-4 bullet points   | Yes              |
| Education          | Degree, field, institution, start date, end date / expected                | Yes              |
| Skills             | Category name + at least one skill                                         | Yes              |
| Certifications     | Title, issuer, issue date                                                  | Yes              |
| Awards             | Title, issuer, date                                                        | Yes              |
| Projects           | Name, description (≥1 bullet), tech stack (≥1)                             | Yes              |
| Languages          | Language + proficiency (native / fluent / proficient / intermediate / …)   | Yes              |
| References         | Either _“available upon request”_ **or** named entries with full contacts  | Yes              |

Optional fields throughout (LinkedIn, GitHub, personal site, GPA, certificate
URL, project link) appear in the preview/exports only when filled in.

---

## Getting started

```bash
git clone https://github.com/nshizirunguwilson/dravvy.git
cd dravvy
npm install
npm run dev          # http://localhost:3000
```

### Scripts

| Script                | What it does                                                       |
| --------------------- | ------------------------------------------------------------------ |
| `npm run dev`         | Next.js dev server with hot reload.                                |
| `npm run build`       | Production build (also runs `next lint` and TypeScript checks).    |
| `npm run start`       | Serves the production build.                                       |
| `npm run lint`        | Runs the Next/ESLint ruleset.                                      |
| `npm run typecheck`   | Strict TypeScript pass with no emit.                               |
| `npm run test:export` | Renders the PDF and DOCX from a fixture and verifies file headers. |
| `npm run format`      | Prettier formatting.                                               |

The export smoke test is fully headless — it bundles the export modules with
esbuild, runs them in Node, and asserts that the PDF starts with `%PDF` and the
DOCX is a valid zip. CI can run it without a browser.

---

## How it is wired

```
src/
├── app/
│   ├── layout.tsx           Root layout, fonts, sonner toaster, error boundary
│   ├── page.tsx             Landing page
│   ├── create/page.tsx      Step 1-9 builder (basic → references)
│   └── settings/page.tsx    Styling → Preview → Export tabs
│
├── components/
│   ├── resume-form.tsx      One focused form per section, all client-side
│   ├── progress-tracker.tsx Step indicator with completion state
│   ├── styling-form.tsx     Draft styling that commits on Save Styling
│   ├── resume-preview.tsx   A4-shaped HTML preview
│   ├── resume-pdf.tsx       @react-pdf/renderer Document
│   ├── export-form.tsx      Format toggle + filename + download button
│   └── ui/                  Radix-based primitives (button, input, select, …)
│
├── lib/
│   ├── resume-docx.ts       Builds a docx Blob mirroring the PDF layout
│   ├── utils.ts             cn(), formatDate(), generateId(), …
│   └── validations/resume.ts Zod schemas for every section
│
├── store/
│   ├── useResumeStore.ts    Persisted resume payload (zustand + persist)
│   └── useUIStore.ts        Step indices for the create / settings flows
│
├── hooks/
│   └── useHydration.ts      Waits for the persist middleware to rehydrate
│
└── types/resume.ts          Shared TypeScript types
```

### State persistence

The resume payload (contact, sections, styling, references mode) lives in a
single `useResumeStore` powered by `zustand/middleware/persist`. The drafted
data is keyed under `resume-store` in `localStorage`, which is why drafts
survive page reloads and tabs.

Clearing the storage entry resets the builder to its initial empty state.

### Exports

- **PDF** — `@react-pdf/renderer`. The component takes the full payload as a
  prop and only uses safe built-in fonts (`Helvetica`, `Times-Roman`) so it
  works offline and in any deployment.
- **DOCX** — `docx`. The same content is laid out with paragraphs, tab stops
  for right-aligned dates, and section borders that match the chosen
  separator style. The output opens cleanly in Word, Google Docs and Pages.

The export step is lazy-loaded: `@react-pdf/renderer` and `docx` are only
fetched when the user clicks **Download** so the create flow stays light.

---

## Accessibility & quality bar

- Every required input is marked with a visible asterisk and a real `required`
  attribute.
- The builder is keyboard-navigable and uses Radix primitives that ship with
  proper ARIA semantics.
- The exported documents use single-column body text and standard fonts so
  applicant tracking systems can parse them reliably.
- TypeScript runs in strict mode and the `npm run build` pipeline gates on
  lint + types.

---

## Roadmap (open ideas)

- [ ] Multiple saved drafts.
- [ ] Import from LinkedIn `.json` profile export.
- [ ] Section reordering via drag handles.
- [ ] Dark theme for the editor.

---

## License

MIT.
