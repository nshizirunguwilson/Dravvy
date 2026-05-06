import Link from 'next/link'
import { ArrowUpRight, FileDown, LayoutGrid, ListChecks, Palette, ShieldCheck, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <SiteHeader />
      <Hero />
      <FeatureGrid />
      <ProcessStrip />
      <FaqStrip />
      <SiteFooter />
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gray-900 text-sm font-semibold text-white">
            D
          </span>
          <span className="text-base font-semibold tracking-tight">Dravvy</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
          <a href="#features" className="hover:text-gray-900">Features</a>
          <a href="#process" className="hover:text-gray-900">How it works</a>
          <a href="#faq" className="hover:text-gray-900">FAQ</a>
        </nav>
        <Link href="/create">
          <Button className="bg-gray-900 text-white hover:bg-gray-800">Start building</Button>
        </Link>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:gap-14 md:px-8 md:py-28">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Built for the 2026 hiring market
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            A resume that opens doors, finished in one sitting.
          </h1>
          <p className="mt-5 max-w-xl text-base text-gray-600 md:text-lg">
            Dravvy walks you through every section, keeps your formatting consistent, and exports a
            print-ready document the moment you are done. No templates from a stock pack, no fiddling
            with margins.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/create">
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
                Build your resume
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                See what is included
              </Button>
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 text-sm">
            <Stat number="9" label="Guided sections" />
            <Stat number="A4" label="Print-ready export" />
            <Stat number="2" label="File formats" />
          </dl>
        </div>

        <PreviewMock />
      </div>
    </section>
  )
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <dt className="text-2xl font-semibold tracking-tight">{number}</dt>
      <dd className="text-gray-500">{label}</dd>
    </div>
  )
}

function PreviewMock() {
  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-3xl border border-gray-200" aria-hidden />
      <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Live Preview</p>
          <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
            A4
          </span>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-lg font-semibold">Avery Lin</p>
            <p className="text-xs text-gray-500">Senior Product Designer · Remote · avery@example.com</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-700">Experience</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p className="font-medium text-gray-900">Lead Designer · Holloway</p>
              <p>Shipped a redesign that lifted activation by 38% in two quarters.</p>
            </div>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-700">Skills</p>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-700">
              {['Design Systems', 'User Research', 'Prototyping', 'Figma', 'Workshops'].map((tag) => (
                <span key={tag} className="rounded-full border border-gray-200 px-2 py-0.5">{tag}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-700">Education</p>
              <p className="font-medium text-gray-900">B.A. Design, RISD</p>
              <p>2017 - 2021</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-700">Languages</p>
              <p>English · Native</p>
              <p>Mandarin · Fluent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: ListChecks,
    title: 'Nine guided sections',
    body: 'Basics, experience, education, skills, certifications, awards, projects, languages and references — each with built-in validation.',
  },
  {
    icon: Palette,
    title: 'Style without code',
    body: 'Pick a font, accent color, separator, spacing and date format. Every choice flows into the preview and the export.',
  },
  {
    icon: FileDown,
    title: 'PDF or DOCX',
    body: 'Export an A4 PDF, or a Word document you can edit downstream. The filename is preset to your name.',
  },
  {
    icon: LayoutGrid,
    title: 'Live A4 preview',
    body: 'See exactly what recruiters see. The preview is dimensioned like the final page so nothing reflows on export.',
  },
  {
    icon: ShieldCheck,
    title: 'Stays on your device',
    body: 'Drafts persist locally in your browser. No accounts, no servers, no analytics watching you write.',
  },
  {
    icon: Sparkles,
    title: 'Quiet, professional defaults',
    body: 'Safe typography, restrained layout. Your content does the talking, not the decoration.',
  },
] as const

function FeatureGrid() {
  return (
    <section id="features" className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-gray-500">Features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Everything a hiring manager scans for, nothing they will skip past.
          </h2>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = [
  { number: '01', title: 'Fill the sections', body: 'Move through nine guided steps. Required fields are marked with an asterisk.' },
  { number: '02', title: 'Pick a style', body: 'Choose a font, accent color, separator, spacing and date format.' },
  { number: '03', title: 'Preview the layout', body: 'See an A4-sized preview that matches the final document exactly.' },
  { number: '04', title: 'Export', body: 'Download as PDF for printing, or DOCX to edit in Word or Google Docs.' },
]

function ProcessStrip() {
  return (
    <section id="process" className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-gray-500">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Four steps from blank page to a file you can send.
            </h2>
          </div>
          <Link href="/create" className="text-sm font-medium text-gray-900 underline-offset-4 hover:underline">
            Start now →
          </Link>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold tracking-widest text-gray-400">{step.number}</p>
              <p className="mt-2 text-base font-semibold">{step.title}</p>
              <p className="mt-2 text-sm text-gray-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const faqs = [
  {
    q: 'Do I need an account?',
    a: 'No. Your draft is stored in your browser. Clearing site data clears your draft.',
  },
  {
    q: 'Which file formats can I export?',
    a: 'You can export to a print-ready A4 PDF, or to a DOCX that opens cleanly in Microsoft Word and Google Docs.',
  },
  {
    q: 'Can I customize the styling?',
    a: 'Yes. The styling step lets you pick a font, accent color, separator style, font size, spacing, and date format. The preview updates immediately.',
  },
  {
    q: 'Is the layout ATS-friendly?',
    a: 'Yes. The exported document uses single-column body text, standard fonts, and plain section headings, all of which most applicant tracking systems parse reliably.',
  },
] as const

function FaqStrip() {
  return (
    <section id="faq" className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-gray-500">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Quick questions, short answers.</h2>
        </div>
        <dl className="mt-10 grid gap-6 md:grid-cols-2">
          {faqs.map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-gray-200 bg-white p-5">
              <dt className="text-base font-semibold">{q}</dt>
              <dd className="mt-2 text-sm text-gray-600">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-10 md:flex-row md:items-center md:px-8">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} Dravvy. Built with Next.js.</p>
        <Link href="/create" className="text-sm font-medium text-gray-900 underline-offset-4 hover:underline">
          Build your resume →
        </Link>
      </div>
    </footer>
  )
}
