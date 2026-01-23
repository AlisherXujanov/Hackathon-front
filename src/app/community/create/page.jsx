import { Suspense } from 'react'
import CreateTopicContent from './CreateTopicContent'

function CreateTopicFallback() {
  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>
      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="h-10 w-24 rounded-lg bg-slate-200/60 animate-pulse mb-6" />
          <div className="rounded-2xl border border-app-border bg-white/60 backdrop-blur p-6 md:p-8 space-y-6">
            <div className="h-10 w-48 rounded-lg bg-slate-200/60 animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-16 rounded bg-slate-200/60 animate-pulse" />
              <div className="h-12 rounded-xl bg-slate-200/60 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-slate-200/60 animate-pulse" />
              <div className="h-12 rounded-xl bg-slate-200/60 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-20 rounded bg-slate-200/60 animate-pulse" />
              <div className="h-40 rounded-xl bg-slate-200/60 animate-pulse" />
            </div>
            <div className="flex gap-3 pt-4 border-t border-app-border">
              <div className="h-11 w-32 rounded-xl bg-slate-200/60 animate-pulse" />
              <div className="h-11 w-24 rounded-xl bg-slate-200/60 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CreateTopicPage() {
  return (
    <Suspense fallback={<CreateTopicFallback />}>
      <CreateTopicContent />
    </Suspense>
  )
}
