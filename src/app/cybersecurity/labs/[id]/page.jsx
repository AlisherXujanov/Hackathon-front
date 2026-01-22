'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Card from '../../../../components/Card'
import Badge from '../../../../components/Badge'
import Button from '../../../../components/Button'
import ScrollAnimation from '../../../../components/ScrollAnimation'
import { labs } from '../../../../store/demo/cybersecurityData'
import { HiArrowLeft, HiCheckCircle, HiClipboardList, HiClock } from 'react-icons/hi'

function getStorageKey(labId) {
  return `demo_cyber_lab_${labId}_state`
}

export default function CyberLabDetailPage() {
  const params = useParams()
  const id = params.id

  const lab = useMemo(() => labs.find((l) => l.id === id), [id])
  const [checked, setChecked] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(getStorageKey(id))
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setChecked(parsed)
    } catch {
      // ignore
    }
  }, [id])

  const toggle = (idx) => {
    const next = checked.includes(idx) ? checked.filter((x) => x !== idx) : [...checked, idx]
    setChecked(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(id), JSON.stringify(next))
    }
  }

  if (!lab) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 pb-10 sm:pt-28">
          <Card variant="glass" className="p-10 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">Лаборатория не найдена</h1>
            <p className="mt-2 text-slate-600">Проверьте ссылку или вернитесь в список.</p>
            <div className="mt-6">
              <Button asChild variant="primary">
                <Link href="/cybersecurity/labs">К лабораториям</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  const progress = lab.checklist.length ? Math.round((checked.length / lab.checklist.length) * 100) : 0

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/cybersecurity/labs">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Назад к лабораториям
              </Link>
            </Button>
          </div>
        </ScrollAnimation>

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScrollAnimation>
              <Card variant="glass" className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" size="sm">{lab.level}</Badge>
                      <span className="text-xs font-semibold text-slate-700 bg-white/70 border border-app-border rounded-full px-3 py-1 inline-flex items-center gap-1">
                        <HiClock className="w-4 h-4 text-slate-400" />
                        {lab.durationMinutes} мин
                      </span>
                      <Badge variant={progress >= 100 ? 'success' : 'outline'} size="sm">
                        {progress}% готово
                      </Badge>
                    </div>
                    <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 break-words">
                      {lab.title}
                    </h1>
                    <p className="mt-3 text-slate-600 leading-relaxed">{lab.description}</p>
                  </div>
                  <div className="hidden md:flex h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white items-center justify-center shadow-lg">
                    <HiClipboardList className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-semibold text-slate-900">Навыки</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {lab.skills.map((s) => (
                      <span key={s} className="text-xs text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </ScrollAnimation>
          </div>

          <div className="lg:col-span-1">
            <ScrollAnimation delay={120}>
              <Card variant="glass" className="p-6 sticky top-24">
                <div className="text-lg font-extrabold text-slate-900">Чек-лист</div>
                <div className="mt-2 text-sm text-slate-600">
                  Отмечайте пункты — состояние сохраняется локально.
                </div>

                <div className="mt-4 space-y-2">
                  {lab.checklist.map((item, idx) => {
                    const isDone = checked.includes(idx)
                    return (
                      <button
                        key={idx}
                        onClick={() => toggle(idx)}
                        className={`
                          w-full text-left rounded-xl border px-4 py-3 transition-all
                          ${isDone ? 'border-success-200 bg-success-50' : 'border-app-border bg-white/70 hover:bg-white'}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center ${isDone ? 'border-success-400 bg-success-100' : 'border-slate-300 bg-white'}`}>
                            {isDone && <HiCheckCircle className="w-5 h-5 text-success-700" />}
                          </div>
                          <div className="text-sm text-slate-800">{item}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-5 pt-5 border-t border-app-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setChecked([])
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem(getStorageKey(id))
                      }
                    }}
                  >
                    Сбросить прогресс
                  </Button>
                </div>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </main>
  )
}

