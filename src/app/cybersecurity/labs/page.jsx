'use client'

import Link from 'next/link'
import Card from '../../../components/Card'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { labs } from '../../../store/demo/cybersecurityData'
import { HiClipboardList, HiArrowRight, HiClock, HiSparkles } from 'react-icons/hi'

export default function CyberLabsPage() {
  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />
      </div>

      <section className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-app-border px-4 py-2 shadow-card">
              <HiClipboardList className="w-5 h-5 text-indigo-700" />
              <span className="text-sm font-semibold text-slate-800">Labs</span>
            </div>
            <h1 className="mt-5 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
              Лаборатории
            </h1>
            <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600">
              Практикумы с чек-листами. Прогресс сохраняется автоматически.
            </p>
          </div>
        </ScrollAnimation>

        <div className="mt-10 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab, idx) => (
            <ScrollAnimation key={lab.id} delay={160 + idx * 60}>
              <Card variant="glass" className="p-6 h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" size="sm">{lab.level}</Badge>
                      <span className="text-xs font-semibold text-slate-700 bg-white/70 border border-app-border rounded-full px-3 py-1 inline-flex items-center gap-1">
                        <HiClock className="w-4 h-4 text-slate-400" />
                        {lab.durationMinutes} мин
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-extrabold text-slate-900">{lab.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{lab.description}</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg">
                    <HiSparkles className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {lab.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <Button asChild variant="primary" size="sm" className="w-full">
                    <Link href={`/cybersecurity/labs/${lab.id}`} className="inline-flex items-center justify-center w-full">
                      Открыть лабораторию
                      <HiArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation delay={600}>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/cybersecurity">Назад в раздел</Link>
            </Button>
          </div>
        </ScrollAnimation>
      </section>
    </main>
  )
}

