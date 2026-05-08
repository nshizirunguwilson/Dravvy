import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/brand'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-paper text-ink-12">
      <SiteHeader />
      <Hero />
      <Specifications />
      <ProcessFolio />
      <Reasons />
      <Faq />
      <Colophon />
    </div>
  )
}

/* ----------------------------------------------------------------------
 * Header — small, restrained, one hairline below
 * -------------------------------------------------------------------- */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur-[2px]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <Link href="/" aria-label="Dravvy">
          <Wordmark size="md" />
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          <a href="#specs" className="text-caption text-ink-7 transition-colors hover:text-ink-12">
            Specifications
          </a>
          <a href="#process" className="text-caption text-ink-7 transition-colors hover:text-ink-12">
            Process
          </a>
          <a href="#faq" className="text-caption text-ink-7 transition-colors hover:text-ink-12">
            Notes
          </a>
        </nav>
        <Link href="/create" className="hidden md:block">
          <Button variant="default" size="sm">
            Begin
          </Button>
        </Link>
        <Link href="/create" className="md:hidden">
          <Button variant="default" size="sm">
            Begin
          </Button>
        </Link>
      </div>
      <div className="hairline mx-auto max-w-6xl" />
    </header>
  )
}

/* ----------------------------------------------------------------------
 * Hero — 12-col asymmetric. Left holds the headline; right holds the
 * "plate" (the resume preview floating on a textured pedestal).
 * -------------------------------------------------------------------- */
function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-x-8 gap-y-16 px-6 pb-24 pt-24 md:px-10 md:pb-32 md:pt-36">
        {/* Eyebrow + title */}
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-3 font-mono text-spec uppercase tracking-[0.16em] text-ink-6">
            <span className="num-tabular">Issue 01</span>
            <span aria-hidden className="h-px w-8 bg-ink-3" />
            <span>The resume builder</span>
          </div>

          <h1 className="mt-8 font-display font-medium leading-[0.98] tracking-[-0.03em] text-ink-12 text-[64px] md:text-[88px] lg:text-[104px]">
            A resume,
            <br />
            <span className="font-display-italic">set in print.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lead text-ink-7">
            Nine guided sections. A true A4 preview, dimensioned to the millimetre. Export as a
            print-ready PDF or an editable DOCX. <em className="font-display-italic text-ink-12">No account, no template
            pack, no fuss.</em>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="/create">
              <Button variant="default" size="lg">
                Start the draft
              </Button>
            </Link>
            <Link href="#specs" className="text-caption text-ink-9 underline-offset-[6px] hover:underline">
              Read the specifications →
            </Link>
          </div>
        </div>

        {/* The plate */}
        <Plate />
      </div>

      {/* Hero baseline rule */}
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="hairline" />
      </div>

      {/* Stats — print-spec style with mono tabular numerals */}
      <Stats />
    </section>
  )
}

function Plate() {
  return (
    <div className="col-span-12 lg:col-span-5">
      <div className="relative">
        {/* Pedestal — paper-deep with hairline at top, no shadow on the
         * pedestal itself, just on the page that sits on it. */}
        <div className="relative rounded-lg bg-paper-deep p-5 paper-grain md:p-7">
          <div className="flex items-center justify-between pb-4 font-mono text-spec uppercase tracking-[0.16em] text-ink-6">
            <span>Live · A4</span>
            <span className="num-tabular">210 × 297</span>
          </div>
          <div className="hairline" />

          {/* The page */}
          <article className="mt-5 rounded-sm bg-page p-6 shadow-lift md:p-8">
            <p className="font-display text-[26px] font-medium leading-tight tracking-tight text-ink-12">
              Avery Lin
            </p>
            <p className="mt-1 text-caption text-ink-7">
              Senior Product Designer · Remote · avery@example.com
            </p>

            <div className="hairline mt-5" />

            <p className="mt-4 font-mono text-spec uppercase tracking-[0.16em] text-ink-7">
              Experience
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-caption font-medium text-ink-12">Lead Designer · Holloway</p>
              <p className="text-caption text-ink-7">
                Shipped a redesign that lifted activation 38% in two quarters.
              </p>
            </div>

            <p className="mt-5 font-mono text-spec uppercase tracking-[0.16em] text-ink-7">
              Skills
            </p>
            <p className="mt-2 text-caption text-ink-9">
              Design Systems, User Research, Prototyping, Figma, Workshops
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-spec uppercase tracking-[0.16em] text-ink-7">
                  Education
                </p>
                <p className="mt-2 text-caption text-ink-12">B.A. Design, RISD</p>
                <p className="text-caption text-ink-7">2017 — 2021</p>
              </div>
              <div>
                <p className="font-mono text-spec uppercase tracking-[0.16em] text-ink-7">
                  Languages
                </p>
                <p className="mt-2 text-caption text-ink-12">English · Native</p>
                <p className="text-caption text-ink-7">Mandarin · Fluent</p>
              </div>
            </div>
          </article>
        </div>

        {/* Folio number tucked into the pedestal corner */}
        <span
          aria-hidden
          className="absolute -bottom-3 right-2 bg-paper px-2 font-mono text-spec uppercase tracking-[0.18em] text-ink-6"
        >
          Plate i
        </span>
      </div>
    </div>
  )
}

function Stats() {
  const items = [
    { number: '09', label: 'Sections, guided' },
    { number: 'A4', label: 'Print to the millimetre' },
    { number: '02', label: 'Export formats' },
  ]
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <dl className="grid grid-cols-3 divide-x divide-rule">
        {items.map(({ number, label }, i) => (
          <div
            key={label}
            className={`py-7 ${i === 0 ? 'pr-6' : i === items.length - 1 ? 'pl-6' : 'px-6'}`}
          >
            <dt className="font-display text-[40px] font-medium leading-none tracking-tight text-ink-12 num-tabular md:text-[56px]">
              {number}
            </dt>
            <dd className="mt-3 text-caption text-ink-7">{label}</dd>
          </div>
        ))}
      </dl>
      <div className="hairline" />
    </div>
  )
}

/* ----------------------------------------------------------------------
 * Specifications — features as a printed spec sheet, hairline rules
 * between rows, mono section markers, no card chrome.
 * -------------------------------------------------------------------- */
const specs = [
  {
    n: '§ 01',
    title: 'Nine guided sections',
    body: 'Basics, experience, education, skills, certifications, awards, projects, languages, references. Each with inline validation and free reordering.',
  },
  {
    n: '§ 02',
    title: 'Style without writing CSS',
    body: 'Theme, accent, typeface, size, spacing, separator, date format. Every choice flows into the preview, the PDF, the DOCX.',
  },
  {
    n: '§ 03',
    title: 'A true A4 preview',
    body: 'The preview is dimensioned exactly like the export. Nothing reflows on download.',
  },
  {
    n: '§ 04',
    title: 'PDF or DOCX, one click',
    body: 'Print-ready PDF for upload, or DOCX you can edit downstream in Word, Google Docs, Pages.',
  },
  {
    n: '§ 05',
    title: 'Quiet by default',
    body: 'Sans body, single column, neutral accents — chosen so applicant tracking systems read every line cleanly.',
  },
  {
    n: '§ 06',
    title: 'Stays on your device',
    body: 'Drafts persist in your browser. No accounts. No telemetry. Clear site data and the draft is gone.',
  },
] as const

function Specifications() {
  return (
    <section id="specs" className="relative">
      <div className="mx-auto max-w-6xl grid-cols-12 gap-x-8 px-6 pt-28 md:grid md:px-10">
        <div className="col-span-3">
          <p className="font-mono text-spec uppercase tracking-[0.18em] text-ink-6">
            Specifications
          </p>
          <h2 className="mt-4 font-display text-h2 leading-[1.05] tracking-tight text-ink-12">
            Everything a hiring manager <span className="font-display-italic">scans for</span>.
          </h2>
        </div>
        <div className="col-span-8 col-start-5 mt-12 md:mt-0">
          <ul>
            {specs.map(({ n, title, body }, i) => (
              <li
                key={title}
                className={`grid grid-cols-12 gap-6 py-8 ${i === 0 ? 'border-t border-rule' : ''} border-b border-rule`}
              >
                <span className="col-span-3 font-mono text-spec uppercase tracking-[0.16em] text-ink-6 num-tabular">
                  {n}
                </span>
                <div className="col-span-9">
                  <h3 className="font-display text-h4 font-medium leading-tight tracking-tight text-ink-12">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-md text-body text-ink-7">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------
 * Process — oversized display numerals bleeding off the column, body
 * to the right. The signature move on this page.
 * -------------------------------------------------------------------- */
const steps = [
  {
    n: '01',
    title: 'Fill the sections',
    body: 'Move through nine guided steps. Required fields are marked with an asterisk; the rest is yours to skip.',
  },
  {
    n: '02',
    title: 'Choose the styling',
    body: 'A typeface, an accent, a separator, a spacing rhythm. Tuned to read serious without reading dull.',
  },
  {
    n: '03',
    title: 'Preview at A4',
    body: 'See exactly what the recruiter sees, dimensioned to the page. No surprises on export.',
  },
  {
    n: '04',
    title: 'Export and send',
    body: 'A print-ready PDF, or a DOCX a colleague can edit. The filename is preset to your name.',
  },
] as const

function ProcessFolio() {
  return (
    <section id="process" className="relative pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl grid-cols-12 gap-x-8 px-6 md:grid md:px-10">
        <div className="col-span-12 mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-spec uppercase tracking-[0.18em] text-ink-6">
              Process
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-h2 leading-[1.05] tracking-tight text-ink-12">
              Four passes from blank page to a file you can send.
            </h2>
          </div>
          <Link
            href="/create"
            className="hidden text-caption text-ink-9 underline-offset-[6px] hover:underline md:block"
          >
            Begin →
          </Link>
        </div>

        <ol className="col-span-12 divide-y divide-rule border-y border-rule">
          {steps.map(({ n, title, body }) => (
            <li key={n} className="grid grid-cols-12 gap-6 py-12 md:py-16">
              <div className="col-span-12 md:col-span-4">
                <span
                  aria-hidden
                  className="block font-display font-medium leading-[0.85] tracking-[-0.04em] text-ink-12 text-[120px] md:text-[180px]"
                >
                  {n}
                </span>
              </div>
              <div className="col-span-12 md:col-span-7 md:col-start-6">
                <h3 className="font-display text-h3 font-medium leading-tight tracking-tight text-ink-12">
                  {title}
                </h3>
                <p className="mt-4 max-w-md text-body text-ink-7">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------
 * Reasons — a compact two-column "colophon" of why the defaults are
 * what they are. Editorial detail. No icons.
 * -------------------------------------------------------------------- */
function Reasons() {
  const lines: [string, string][] = [
    ['Single column', 'Parses cleanly through every applicant tracking system.'],
    ['Neutral accent', 'Lets your content do the talking. The colour is a guest, not the host.'],
    ['No emoji', 'Recruiters read fast. Decoration slows them down.'],
    ['No telemetry', 'Drafts stay on your device. We do not watch you write.'],
  ]
  return (
    <section className="pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl grid-cols-12 gap-x-8 px-6 md:grid md:px-10">
        <div className="col-span-3">
          <p className="font-mono text-spec uppercase tracking-[0.18em] text-ink-6">
            Editorial choices
          </p>
        </div>
        <dl className="col-span-9 grid gap-6 md:grid-cols-2">
          {lines.map(([term, def]) => (
            <div key={term} className="grid grid-cols-12 gap-3 border-t border-rule pt-5">
              <dt className="col-span-4 font-display text-[18px] font-medium leading-tight text-ink-12">
                {term}
              </dt>
              <dd className="col-span-8 text-caption text-ink-7">{def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------
 * FAQ — disclosure rows. Plus glyph rotates to ×. No card chrome.
 * -------------------------------------------------------------------- */
const faqs = [
  {
    q: 'Do I need an account?',
    a: 'No. Your draft is stored in your browser. Clear site data and the draft is gone with it.',
  },
  {
    q: 'Which file formats can I export?',
    a: 'A print-ready A4 PDF, or a DOCX that opens cleanly in Microsoft Word and Google Docs.',
  },
  {
    q: 'Can I customise the styling?',
    a: 'Yes. Pick a typeface, accent, separator, font size, spacing and date format. The preview updates as you go.',
  },
  {
    q: 'Is the layout ATS-friendly?',
    a: 'Yes. The export uses single-column body text, standard fonts, and plain section headings — all of which most applicant tracking systems read reliably.',
  },
] as const

function Faq() {
  return (
    <section id="faq" className="pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl grid-cols-12 gap-x-8 px-6 md:grid md:px-10">
        <div className="col-span-3">
          <p className="font-mono text-spec uppercase tracking-[0.18em] text-ink-6">Notes</p>
          <h2 className="mt-4 font-display text-h2 leading-[1.05] tracking-tight text-ink-12">
            Short questions, <span className="font-display-italic">short answers.</span>
          </h2>
        </div>
        <div className="col-span-9 mt-10 md:mt-0">
          <ul className="border-t border-rule">
            {faqs.map(({ q, a }, i) => (
              <li key={q} className="border-b border-rule py-7 md:grid md:grid-cols-12 md:gap-8">
                <span className="font-mono text-spec uppercase tracking-[0.16em] text-ink-6 md:col-span-2 num-tabular">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <dl className="md:col-span-10">
                  <dt className="font-display text-[22px] font-medium leading-tight text-ink-12">
                    {q}
                  </dt>
                  <dd className="mt-3 max-w-2xl text-body text-ink-7">{a}</dd>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------
 * Colophon — the closing rule. Mono only.
 * -------------------------------------------------------------------- */
function Colophon() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-32 border-t border-rule">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-x-8 px-6 py-14 md:px-10">
        <div className="col-span-12 md:col-span-6">
          <Wordmark size="md" />
          <p className="mt-5 max-w-sm text-caption text-ink-7">
            Drafted in your browser, set in print. A resume tool that reads like a magazine and
            exports like a document.
          </p>
        </div>
        <div className="col-span-12 mt-10 grid grid-cols-2 gap-x-6 md:col-span-6 md:mt-0 md:grid-cols-3">
          <FooterCol
            label="Build"
            items={[
              ['Begin', '/create'],
              ['Specifications', '#specs'],
              ['Process', '#process'],
            ]}
          />
          <FooterCol
            label="Notes"
            items={[
              ['Questions', '#faq'],
              ['Editorial choices', '#'],
            ]}
          />
          <FooterCol
            label="Folio"
            items={[
              [`© ${year}`, '#'],
              ['Set in Fraunces', '#'],
            ]}
          />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="hairline" />
        <p className="py-6 font-mono text-spec uppercase tracking-[0.16em] text-ink-6">
          Vol. 01 · A resume tool, set in print.
        </p>
      </div>
    </footer>
  )
}

function FooterCol({ label, items }: { label: string; items: [string, string][] }) {
  return (
    <div>
      <p className="font-mono text-spec uppercase tracking-[0.16em] text-ink-6">{label}</p>
      <ul className="mt-4 space-y-3">
        {items.map(([text, href]) => (
          <li key={text}>
            <a
              href={href}
              className="text-caption text-ink-9 underline-offset-[6px] transition-colors hover:text-ink-12 hover:underline"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
