import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/brand'

export const metadata = { title: 'Offline' }

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Wordmark size="lg" />
      <h1 className="text-[28px] font-bold tracking-[-0.02em] text-slate-12">
        You are offline, and that is fine.
      </h1>
      <p className="max-w-md text-[15px] text-slate-7">
        Your draft is stored on this device, so you can keep writing and exporting without a
        connection. If this page looks empty, open the editor again once you have been online at
        least once.
      </p>
      <Link href="/create">
        <Button size="lg">Back to the editor</Button>
      </Link>
    </main>
  )
}
