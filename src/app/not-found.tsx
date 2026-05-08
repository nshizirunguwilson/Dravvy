import Link from 'next/link'

import { Wordmark } from '@/components/brand'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 md:px-10">
        <Link href="/">
          <Wordmark size="md" />
        </Link>
        <span className="font-mono text-spec uppercase text-ink-6">404 · Not found</span>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 py-24 md:px-10 md:py-40">
        <div className="col-span-12 md:col-span-3">
          <span
            aria-hidden
            className="block font-display text-[180px] leading-[0.9] tracking-[-0.04em] text-ink-12 md:text-[260px]"
          >
            404
          </span>
        </div>

        <div className="col-span-12 mt-6 md:col-span-7 md:col-start-5 md:mt-3">
          <p className="font-mono text-spec uppercase tracking-[0.16em] text-ink-6">
            Folio · missing page
          </p>
          <h1 className="mt-4 font-display text-h2 leading-[1.04] tracking-[-0.022em] text-ink-12">
            This page <span className="font-display-italic">isn’t in the folio.</span>
          </h1>
          <p className="mt-5 max-w-md text-body text-ink-7">
            The link is broken or the page was retired. Your draft, if you have one, is still
            on this device — head back to the editor.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/">
              <Button variant="default" size="lg">
                Back to start
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="link">Open the editor →</Button>
            </Link>
          </div>
        </div>
      </main>

      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="hairline" />
        <p className="py-8 font-mono text-spec uppercase text-ink-6">
          Dravvy · drafted in your browser, never on a server.
        </p>
      </div>
    </div>
  )
}
