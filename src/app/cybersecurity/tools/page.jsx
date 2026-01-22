'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Select from '../../../components/Select'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { cyberTools } from '../../../store/demo/cybersecurityData'
import { HiBookOpen, HiSearch, HiShieldCheck } from 'react-icons/hi'

export default function CyberToolsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const categories = useMemo(() => {
    const set = new Set(cyberTools.map((t) => t.category))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return cyberTools.filter((t) => {
      const matchesQuery = !q
        || t.name.toLowerCase().includes(q)
        || t.description.toLowerCase().includes(q)
        || t.tags.some((x) => x.toLowerCase().includes(q))
      const matchesCategory = category === 'all' || t.category === category
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-slate-300/20 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-emerald-200/18 blur-3xl" />
      </div>

      <section className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-app-border px-4 py-2 shadow-card">
              <HiBookOpen className="w-5 h-5 text-slate-800" />
              <span className="text-sm font-semibold text-slate-800">Tools</span>
            </div>
            <h1 className="mt-5 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
              Инструменты
            </h1>
            <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600">
              Каталог профессиональных инструментов для тестирования безопасности, анализа и защиты.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={120}>
          <div className="mt-8 max-w-[1100px] mx-auto">
            <Card variant="glass" className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Поиск по инструментам"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  leftIcon={<HiSearch className="w-5 h-5" />}
                />
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={[
                    { value: 'all', label: 'Все категории' },
                    ...categories.map((c) => ({ value: c, label: c })),
                  ]}
                />
                <div className="flex items-end">
                  <div className="text-sm text-slate-600">
                    Найдено: <span className="font-semibold text-slate-900">{filtered.length}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </ScrollAnimation>

        <div className="mt-8 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, idx) => (
            <ScrollAnimation key={t.id} delay={180 + idx * 40}>
              <Card variant="glass" className="p-6 h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Badge variant="outline" size="sm">{t.category}</Badge>
                    <h2 className="mt-3 text-xl font-extrabold text-slate-900">{t.name}</h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.description}</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-lg">
                    <HiShieldCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {t.tags.map((x) => (
                    <span key={x} className="text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                      {x}
                    </span>
                  ))}
                </div>
              </Card>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation delay={650}>
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

