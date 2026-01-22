'use client'

import Link from 'next/link'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import ScrollAnimation from '../../components/ScrollAnimation'
import { HiAdjustments, HiArrowRight, HiClipboardList, HiTemplate, HiUsers, HiChartBar, HiShieldCheck } from 'react-icons/hi'

export default function AdminPage() {
  const tiles = [
    {
      title: 'Course Builder',
      description: 'Мастер создания курса: метаданные → модули → публикация (UI-демо).',
      href: '/admin/course-builder',
      icon: HiClipboardList,
      gradient: 'from-primary-600 to-accent-600',
      chips: ['wizard', 'modules', 'export JSON'],
    },
    {
      title: 'Landing Builder',
      description: 'Конструктор промо-лендинга из блоков (Hero/Benefits/Pricing/FAQ).',
      href: '/admin/landing-builder',
      icon: HiTemplate,
      gradient: 'from-indigo-600 to-violet-600',
      chips: ['sections', 'preview', 'save draft'],
    },
    {
      title: 'Users & Roles',
      description: 'Витрина управления пользователями: роли, статусы, доступы.',
      href: '/profile',
      icon: HiUsers,
      gradient: 'from-slate-700 to-slate-900',
      chips: ['roles', 'status', 'audit'],
    },
    {
      title: 'Analytics',
      description: 'Панель метрик для продукта.',
      href: '/analytics',
      icon: HiChartBar,
      gradient: 'from-emerald-600 to-cyan-600',
      chips: ['KPIs', 'charts', 'export'],
    },
    {
      title: 'Security',
      description: 'Политики безопасности и отчёты (демо-сценарии).',
      href: '/cybersecurity/reports',
      icon: HiShieldCheck,
      gradient: 'from-amber-600 to-orange-600',
      chips: ['policies', 'reports', 'compliance'],
    },
  ]

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-slate-300/18 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-primary-200/18 blur-3xl" />
      </div>

      <section className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-app-border px-4 py-2 shadow-card">
              <HiAdjustments className="w-5 h-5 text-slate-800" />
              <span className="text-sm font-semibold text-slate-800">Admin</span>
              <Badge variant="outline" size="sm">Demo</Badge>
            </div>
            <h1 className="mt-5 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
              Админ-панель
            </h1>
            <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600">
              Инструменты управления продуктом: конструкторы, модерация, роли и метрики.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={140}>
          <div className="mt-10 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tiles.map((t, idx) => {
              const Icon = t.icon
              return (
                <ScrollAnimation key={t.href} delay={160 + idx * 60}>
                  <Card variant="glass" className="p-6 h-full">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${t.gradient} text-white flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="mt-4 text-xl font-extrabold text-slate-900">{t.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {t.chips.map((c) => (
                        <span key={c} className="text-xs text-slate-800 bg-white/70 border border-app-border rounded-full px-3 py-1">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button asChild variant="primary" size="sm" className="w-full">
                        <Link href={t.href} className="inline-flex items-center justify-center w-full">
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
      </section>
    </main>
  )
}

