import { Suspense } from 'react'
import SandboxContent from './SandboxContent'

function SandboxFallback() {
  return (
    <main className="w-full overflow-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper pt-24 sm:pt-28 pb-4">
        <div className="mb-6">
          <div className="h-10 w-64 rounded-lg bg-gray-200/60 animate-pulse mb-2" />
          <div className="h-5 w-96 max-w-full rounded bg-gray-200/60 animate-pulse" />
        </div>
        <div className="rounded-2xl border border-app-border bg-white/60 backdrop-blur p-4 mb-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-3 space-y-2">
              <div className="h-4 w-16 rounded bg-gray-200/60 animate-pulse" />
              <div className="h-11 rounded-xl bg-gray-200/60 animate-pulse" />
            </div>
            <div className="lg:col-span-3 space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200/60 animate-pulse" />
              <div className="h-11 rounded-xl bg-gray-200/60 animate-pulse" />
            </div>
            <div className="lg:col-span-6 flex gap-2 justify-end">
              <div className="h-11 w-20 rounded-xl bg-gray-200/60 animate-pulse" />
              <div className="h-11 w-16 rounded-xl bg-gray-200/60 animate-pulse" />
              <div className="h-11 w-20 rounded-xl bg-gray-200/60 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="container-wrapper grid grid-cols-1 lg:grid-cols-2 gap-0 pb-8">
        <div className="rounded-t-2xl lg:rounded-l-2xl lg:rounded-r-none border border-app-border bg-white/60 overflow-hidden flex flex-col" style={{ minHeight: 400 }}>
          <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="h-5 w-28 rounded bg-gray-200/60 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 w-12 rounded-lg bg-gray-200/60 animate-pulse" />
              <div className="h-8 w-12 rounded-lg bg-gray-200/60 animate-pulse" />
              <div className="h-8 w-12 rounded-lg bg-gray-200/60 animate-pulse" />
            </div>
          </div>
          <div className="flex-1 bg-gray-900 flex items-center justify-center" style={{ minHeight: 360 }}>
            <span className="text-green-400 font-mono text-sm">Загрузка редактора…</span>
          </div>
        </div>
        <div className="rounded-b-2xl lg:rounded-r-2xl lg:rounded-l-none border border-app-border border-t-0 lg:border-t lg:border-l-0 bg-white/60 overflow-hidden flex flex-col" style={{ minHeight: 400 }}>
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="h-5 w-20 rounded bg-gray-200/60 animate-pulse" />
          </div>
          <div className="flex-1 bg-white flex items-center justify-center" style={{ minHeight: 360 }}>
            <span className="text-gray-500 text-sm">Preview</span>
          </div>
          <div className="h-12 border-t border-gray-200 bg-gray-800 flex items-center px-4">
            <span className="text-gray-500 text-xs font-mono">Console</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function SandboxPage() {
  return (
    <Suspense fallback={<SandboxFallback />}>
      <SandboxContent />
    </Suspense>
  )
}
