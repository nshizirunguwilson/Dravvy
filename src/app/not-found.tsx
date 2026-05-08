import Link from 'next/link'

import { Wordmark } from '@/components/brand'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/">
          <Wordmark size="md" />
        </Link>
        <span className="text-[13px] font-medium text-slate-7">404 · Not found</span>
      </header>

      <main className="mx-auto grid max-w-3xl gap-10 px-6 py-24 text-center md:py-32">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-[28px] font-bold text-brand-ink">
          404
        </div>
        <div className="space-y-4">
          <h1 className="text-[40px] font-bold leading-[1.05] tracking-[-0.025em] text-slate-12 md:text-[52px]">
            We couldn&rsquo;t find that page.
          </h1>
          <p className="mx-auto max-w-md text-[16px] text-slate-7">
            The link is broken or the page was retired. Your draft, if you have one, is still on
            this device — head back to the editor.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button variant="default" size="lg">
              Back to home
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="outline" size="lg">
              Open the editor
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
