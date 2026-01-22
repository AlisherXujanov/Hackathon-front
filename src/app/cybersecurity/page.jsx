'use client'

import Link from 'next/link'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import ScrollAnimation from '../../components/ScrollAnimation'
import {
  HiShieldCheck,
  HiTerminal,
  HiClipboardList,
  HiDocumentReport,
  HiArrowRight,
  HiSparkles,
} from 'react-icons/hi'

export default function CybersecurityLandingPage() {
  const sections = [
    {
      title: 'CTF',
      description: 'Каталог задач (Web/Crypto/OSINT/Forensics/Pwn) + страница задания.',
      href: '/cybersecurity/ctf',
      icon: HiTerminal,
      gradient: 'from-emerald-600 to-cyan-600',
      chips: ['задачи', 'фильтры', 'submit flag'],
    },
    {
      title: 'Лаборатории',
      description: 'Виртуальные практикумы с чек-листами и прогрессом.',
      href: '/cybersecurity/labs',
      icon: HiClipboardList,
      gradient: 'from-indigo-600 to-violet-600',
      chips: ['checklist', 'progress', 'notes'],
    },
    {
      title: 'Инструменты',
      description: 'Каталог инструментов и шпаргалок для практической работы.',
      href: '/cybersecurity/tools',
      icon: HiShieldCheck,
      gradient: 'from-slate-700 to-slate-900',
      chips: ['OWASP', 'SCA', 'Forensics'],
    },
    {
      title: 'Отчёты',
      description: 'Конструктор security-report: шаблоны, секции, экспорт JSON.',
      href: '/cybersecurity/reports',
      icon: HiDocumentReport,
      gradient: 'from-amber-600 to-orange-600',
      chips: ['templates', 'drafts', 'export'],
    },
  ]

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/36 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-cyan-200/28 blur-3xl" />
        <div className="absolute -bottom-32 right-[18%] h-96 w-96 rounded-full bg-blue-200/18 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_60%)]" />
      </div>

      <section className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-app-border px-4 py-2 shadow-card">
              <HiShieldCheck className="w-5 h-5 text-emerald-700" />
              <span className="text-sm font-semibold text-slate-800">Cybersecurity</span>
            </div>
            <h1 className="mt-5 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
              Кибербезопасность
            </h1>
            <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600">
              CTF-задачи, виртуальные лаборатории, каталог инструментов и конструктор отчётов для практического обучения.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={150}>
          <div className="mt-10 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {sections.map((s, idx) => {
              const Icon = s.icon
              return (
                <ScrollAnimation key={s.href} delay={180 + idx * 60}>
                  <Card variant="glass" className="p-6 h-full">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="mt-4 text-xl font-extrabold text-slate-900">{s.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {s.chips.map((chip) => (
                        <span
                          key={chip}
                          className="text-xs font-semibold text-slate-700 bg-white/70 border border-app-border rounded-full px-3 py-1"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button asChild variant="primary" size="sm" className="w-full">
                        <Link href={s.href} className="inline-flex items-center justify-center w-full">
                          Открыть
                          <HiArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </ScrollAnimation>
              )
            })}
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={500}>
          <div className="mt-10 max-w-[1100px] mx-auto">
            <Card variant="glass" className="p-6 md:p-7">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <HiSparkles className="w-5 h-5 text-emerald-700" />
                    <div className="text-lg font-extrabold text-slate-900">Рекомендуемый сценарий</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600 leading-relaxed">
                    1) Открыть CTF → 2) выбрать задачу → 3) “submit flag” → 4) перейти в отчёт и “export JSON”.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="primary" size="sm">
                    <Link href="/cybersecurity/ctf">
                      Начать с CTF
                      <HiArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </ScrollAnimation>
      </section>
    </main>
  )
}

