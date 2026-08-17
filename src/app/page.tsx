import Link from 'next/link'
import { ArrowRight, Check, FileDown, Layers, MonitorPlay, Palette, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/brand'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-canvas text-slate-12">
      <SiteHeader />
      <Hero />
      <FeaturesGrid />
      <ProcessStrip />
      <Faq />
      <Footer />
    </div>
  )
}

/* ----------------------------------------------------------------------
 * Header
 * -------------------------------------------------------------------- */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 md:px-10">
        <Link href="/" aria-label="Dravvy" className="shrink-0">
          <Wordmark size="sm" className="md:hidden" />
          <Wordmark size="md" className="hidden md:inline-flex" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-[14px] font-medium text-slate-7 transition-colors hover:text-slate-12">
            Features
          </a>
          <a href="#how" className="text-[14px] font-medium text-slate-7 transition-colors hover:text-slate-12">
            How it works
          </a>
          <a href="#faq" className="text-[14px] font-medium text-slate-7 transition-colors hover:text-slate-12">
            FAQ
          </a>
        </nav>
        <Link href="/create" className="shrink-0">
          <Button variant="default" size="sm" className="px-3 sm:px-4">
            <span className="hidden sm:inline">Start building</span>
            <span className="sm:hidden">Start</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </header>
  )
}

/* ----------------------------------------------------------------------
 * Hero: centred headline, soft trust badge, two CTAs, preview card
 * -------------------------------------------------------------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-14 text-center sm:px-6 sm:pt-20 md:pb-16 md:pt-28">
        <div className="mx-auto mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12px] font-medium text-slate-9 shadow-xs sm:text-[13px]">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-positive" aria-hidden />
          <span className="truncate sm:whitespace-normal">
            No account, no upload. Your draft stays in your browser
          </span>
        </div>

        <h1 className="text-balance text-[34px] font-bold leading-[1.06] tracking-[-0.028em] text-slate-12 sm:text-[44px] md:text-[60px] lg:text-[78px]">
          Build a resume you&rsquo;ll
          <br className="hidden md:block" />{' '}
          actually want to send.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-[1.55] text-slate-7 sm:text-[17px] md:mt-7 md:text-[19px]">
          Walk through nine guided sections. Pick a styling. See a true A4 preview as you go.
          Export as a print-ready PDF or an editable DOCX in one click.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center md:mt-10">
          <Link href="/create" className="sm:w-auto">
            <Button variant="default" size="lg" className="w-full sm:w-auto sm:px-7">
              Build your resume
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features" className="sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              See what&rsquo;s included
            </Button>
          </Link>
        </div>

        <ul className="mx-auto mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-slate-7 sm:text-[13px] md:mt-8 md:gap-x-6">
          {['ATS-friendly defaults', 'Free, forever', 'Works offline after load'].map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-positive" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <PreviewMock />
    </section>
  )
}

function PreviewMock() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-24 md:px-10 md:pb-32">
      <div className="relative">
        {/* Soft pedestal behind the card */}
        <div
          aria-hidden
          className="absolute -inset-x-6 -inset-y-3 rounded-[28px] bg-surface-2 md:-inset-x-12 md:-inset-y-6"
        />
        <div className="relative rounded-2xl border border-line bg-surface shadow-pop">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-line" />
              <span className="h-3 w-3 rounded-full bg-line" />
              <span className="h-3 w-3 rounded-full bg-line" />
            </div>
            <span className="text-[12px] font-medium text-slate-6">app.dravvy.com / A4 preview</span>
            <span className="w-12" />
          </div>

          {/* Two-pane mock: rail + page */}
          <div className="grid grid-cols-12 gap-0">
            {/* Rail */}
            <div className="col-span-4 hidden border-r border-line bg-surface-2/60 p-5 md:block">
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-slate-6">
                Sections
              </p>
              <ol className="space-y-2">
                {[
                  ['1', 'Basic information', true],
                  ['2', 'Work experience', true],
                  ['3', 'Education', true],
                  ['4', 'Skills', false],
                  ['5', 'Projects', false],
                ].map(([n, label, done]) => (
                  <li
                    key={String(n)}
                    className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] ${done ? 'text-slate-12' : 'text-slate-7'}`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                        done ? 'bg-brand text-white' : 'border border-line bg-surface text-slate-7'
                      }`}
                    >
                      {done ? <Check className="h-3 w-3" strokeWidth={3} /> : n}
                    </span>
                    {label}
                  </li>
                ))}
              </ol>
            </div>

            {/* Page */}
            <div className="col-span-12 p-6 md:col-span-8 md:p-8">
              <p className="text-[18px] font-semibold text-slate-12">Avery Lin</p>
              <p className="mt-1 text-[13px] text-slate-7">
                Senior Product Designer · Remote · avery@example.com
              </p>
              <hr className="my-4 border-line" />
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-9">
                Experience
              </p>
              <p className="text-[14px] font-medium text-slate-12">Lead Designer · Holloway</p>
              <p className="text-[13px] text-slate-7">
                Shipped a redesign that lifted activation 38% in two quarters.
              </p>
              <p className="mb-1 mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-9">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Design Systems', 'User Research', 'Prototyping', 'Figma', 'Workshops'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[12px] text-slate-9"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------
 * Features grid: bordered cards, soft shadow, lucide icons in tinted
 * tile, real spacing.
 * -------------------------------------------------------------------- */
const features = [
  {
    icon: Layers,
    title: 'Nine guided sections',
    body: 'Basics, experience, education, skills, certifications, awards, projects, languages, references, each with inline validation.',
  },
  {
    icon: Palette,
    title: 'Style without code',
    body: 'Pick a font, accent, separator and rhythm. Every choice flows into the preview, the PDF, the DOCX.',
  },
  {
    icon: MonitorPlay,
    title: 'Live A4 preview',
    body: 'See exactly what recruiters see. The preview is dimensioned like the export, so nothing reflows on download.',
  },
  {
    icon: FileDown,
    title: 'PDF or DOCX',
    body: 'A print-ready PDF you can attach, or a DOCX you can edit downstream in Word, Pages or Google Docs.',
  },
  {
    icon: ShieldCheck,
    title: 'Stays on your device',
    body: 'Drafts persist locally in your browser. No account, no server, no analytics watching you write.',
  },
  {
    icon: Check,
    title: 'ATS-friendly by default',
    body: 'Single-column body, standard fonts, plain section headings, chosen so applicant tracking systems read every line cleanly.',
  },
] as const

function FeaturesGrid() {
  return (
    <section id="features" className="border-y border-line bg-surface-2/40">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-brand">
            Features
          </p>
          <h2 className="text-[26px] font-bold leading-[1.1] tracking-[-0.018em] text-slate-12 sm:text-[32px] md:text-[40px] lg:text-[44px]">
            Everything a hiring manager scans for.
          </h2>
          <p className="mt-4 text-[16px] text-slate-7">
            Just the parts that matter, none of the busywork.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-line bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-[17px] font-semibold text-slate-12">{title}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-slate-7">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------
 * Process: clear numbered steps, tile cards
 * -------------------------------------------------------------------- */
const steps = [
  {
    n: 1,
    title: 'Fill the sections',
    body: 'Move through nine guided steps. Required fields are marked, the rest is yours to skip.',
  },
  {
    n: 2,
    title: 'Pick a styling',
    body: 'Theme, accent, font, separator, spacing, date format. The preview updates as you choose.',
  },
  {
    n: 3,
    title: 'Preview at A4',
    body: 'See exactly what recruiters see. Dimensioned to the page, so nothing reflows on export.',
  },
  {
    n: 4,
    title: 'Export and send',
    body: 'A print-ready PDF or a DOCX a colleague can edit. Filename is preset to your name.',
  },
]

function ProcessStrip() {
  return (
    <section id="how" className="bg-canvas">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-brand">
            How it works
          </p>
          <h2 className="text-[26px] font-bold leading-[1.1] tracking-[-0.018em] text-slate-12 sm:text-[32px] md:text-[40px] lg:text-[44px]">
            Four steps from blank page to a file you can send.
          </h2>
        </div>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, title, body }) => (
            <li
              key={n}
              className="rounded-2xl border border-line bg-surface p-6 shadow-sm"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-12 text-[14px] font-bold text-white num-tabular">
                {String(n).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-[17px] font-semibold text-slate-12">{title}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-slate-7">{body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <Link href="/create">
            <Button variant="default" size="lg" className="px-7">
              Start now, it&rsquo;s free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------
 * FAQ: bordered card list, plain English
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
    a: 'Yes. The export uses single-column body text, standard fonts, and plain section headings, all of which most applicant tracking systems read reliably.',
  },
] as const

function Faq() {
  return (
    <section id="faq" className="border-t border-line bg-surface-2/40">
      <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-brand">
            Questions
          </p>
          <h2 className="text-[26px] font-bold leading-[1.1] tracking-[-0.018em] text-slate-12 sm:text-[32px] md:text-[40px]">
            Quick answers, no fine print.
          </h2>
        </div>

        <dl className="space-y-3">
          {faqs.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-2xl border border-line bg-surface p-6 shadow-sm"
            >
              <dt className="text-[16px] font-semibold text-slate-12">{q}</dt>
              <dd className="mt-2 text-[15px] leading-[1.55] text-slate-7">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------
 * Footer
 * -------------------------------------------------------------------- */
function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3 md:px-10">
        <div>
          <Wordmark size="md" />
          <p className="mt-4 max-w-xs text-[14px] text-slate-7">
            A browser-only resume builder. Drafts stay on your device.
          </p>
        </div>
        <FooterCol
          label="Product"
          items={[
            ['Build your resume', '/create'],
            ['Features', '#features'],
            ['How it works', '#how'],
            ['FAQ', '#faq'],
          ]}
        />
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wider text-slate-7">About</p>
          <p className="mt-4 text-[14px] text-slate-9">
            Free, no account, no upload, no analytics.
          </p>
          <p className="mt-3 text-[13px] text-slate-6">© {year} Dravvy</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ label, items }: { label: string; items: [string, string][] }) {
  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-wider text-slate-7">{label}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map(([text, href]) => (
          <li key={text}>
            <a
              href={href}
              className="text-[14px] text-slate-9 transition-colors hover:text-brand"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
