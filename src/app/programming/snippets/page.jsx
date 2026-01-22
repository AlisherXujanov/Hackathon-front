'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiCode, HiSearch, HiArrowRight, HiTrash, HiTerminal } from 'react-icons/hi'

const STORAGE_KEY = 'demo_snippets'

function readSnippets() {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeSnippets(next) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

function buildSrcDoc(snippet) {
  const safe = (v) => (typeof v === 'string' ? v : '')
  const html = safe(snippet?.html)
  const css = safe(snippet?.css)
  const js = safe(snippet?.js)
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>${js}<\/script>
  </body>
</html>`
}

export default function SnippetsGalleryPage() {
  const [snippets, setSnippets] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    setSnippets(readSnippets())
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return snippets
    return snippets.filter((s) => {
      const title = (s.title || '').toLowerCase()
      return title.includes(q) || (s.html || '').toLowerCase().includes(q)
    })
  }, [snippets, query])

  const remove = (id) => {
    const next = snippets.filter((s) => s.id !== id)
    setSnippets(next)
    writeSnippets(next)
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-indigo-200/22 blur-3xl" />
      </div>

      <section className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-app-border px-4 py-2 shadow-card">
              <HiCode className="w-5 h-5 text-blue-700" />
              <span className="text-sm font-semibold text-slate-800">Snippets</span>
              <Badge variant="outline" size="sm">Demo</Badge>
            </div>
            <h1 className="mt-5 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
              Галерея сниппетов
            </h1>
            <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600">
              Сниппеты сохраняются из песочницы для быстрого доступа.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={120}>
          <div className="mt-8 max-w-[1100px] mx-auto">
            <Card variant="glass" className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <Input
                  placeholder="Поиск по названию"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  leftIcon={<HiSearch className="w-5 h-5" />}
                />
                <div className="text-sm text-slate-600">
                  Всего: <span className="font-semibold text-slate-900">{snippets.length}</span>
                  {query ? (
                    <>
                      {' '}• Найдено: <span className="font-semibold text-slate-900">{filtered.length}</span>
                    </>
                  ) : null}
                </div>
                <div className="flex justify-end">
                  <Button asChild variant="primary" size="sm">
                    <Link href="/programming/sandbox" className="inline-flex items-center">
                      Открыть Sandbox
                      <HiArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </ScrollAnimation>

        <div className="mt-8 max-w-[1100px] mx-auto">
          {filtered.length === 0 ? (
            <ScrollAnimation delay={200}>
              <Card variant="glass" className="p-12 text-center">
                <HiTerminal className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Пока нет сниппетов</h3>
                <p className="text-slate-600">
                  Откройте песочницу, нажмите <span className="font-semibold">Save</span> и вернитесь сюда.
                </p>
                <div className="mt-6">
                  <Button asChild variant="primary">
                    <Link href="/programming/sandbox">Перейти в песочницу</Link>
                  </Button>
                </div>
              </Card>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((s, idx) => (
                <ScrollAnimation key={s.id} delay={220 + idx * 60}>
                  <Card variant="glass" className="overflow-hidden">
                    <div className="h-44 bg-white border-b border-app-border">
                      <iframe
                        title={`preview-${s.id}`}
                        className="w-full h-full"
                        sandbox="allow-scripts"
                        srcDoc={buildSrcDoc(s)}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-lg font-extrabold text-slate-900 truncate">{s.title || 'Untitled'}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {s.updatedAt ? `Updated: ${new Date(s.updatedAt).toLocaleString()}` : 'Local snippet'}
                          </div>
                        </div>
                        <Badge variant="outline" size="sm">Local</Badge>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild variant="primary" size="sm">
                          <Link href={`/programming/sandbox?snippet=${s.id}`}>Открыть в Sandbox</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => remove(s.id)}
                        >
                          <HiTrash className="w-4 h-4 mr-1" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

