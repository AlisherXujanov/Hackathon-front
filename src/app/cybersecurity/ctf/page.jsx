'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Select from '../../../components/Select'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { ctfChallenges, CYBER_DIFFICULTY } from '../../../store/demo/cybersecurityData'
import { HiSearch, HiTerminal, HiArrowRight, HiFilter } from 'react-icons/hi'

function difficultyLabel(value) {
  if (value === CYBER_DIFFICULTY.EASY) return 'Лёгкая'
  if (value === CYBER_DIFFICULTY.MEDIUM) return 'Средняя'
  if (value === CYBER_DIFFICULTY.HARD) return 'Сложная'
  return value
}

function difficultyBadgeVariant(value) {
  if (value === CYBER_DIFFICULTY.EASY) return 'success'
  if (value === CYBER_DIFFICULTY.MEDIUM) return 'primary'
  if (value === CYBER_DIFFICULTY.HARD) return 'accent'
  return 'outline'
}

export default function CyberCTFPage() {
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [category, setCategory] = useState('all')

  const categories = useMemo(() => {
    const set = new Set(ctfChallenges.map((c) => c.category))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ctfChallenges.filter((c) => {
      const matchesQuery = !q
        || c.title.toLowerCase().includes(q)
        || c.shortDescription.toLowerCase().includes(q)
        || c.tags.some((t) => t.toLowerCase().includes(q))

      const matchesDifficulty = difficulty === 'all' || c.difficulty === difficulty
      const matchesCategory = category === 'all' || c.category === category
      return matchesQuery && matchesDifficulty && matchesCategory
    })
  }, [query, difficulty, category])

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-cyan-200/22 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_60%)]" />
      </div>

      <section className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-app-border px-4 py-2 shadow-card">
              <HiTerminal className="w-5 h-5 text-emerald-700" />
              <span className="text-sm font-semibold text-slate-800">CTF</span>
            </div>
            <h1 className="mt-5 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
              CTF задачи
            </h1>
            <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600">
              Выберите задачу по категории и сложности. Практикуйте навыки в различных областях кибербезопасности.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={120}>
          <div className="mt-8 max-w-[1100px] mx-auto">
            <Card variant="glass" className="p-5 md:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 text-white flex items-center justify-center shadow-lg">
                  <HiFilter className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-extrabold text-slate-900">Фильтры</div>
                  <div className="text-sm text-slate-600">Поиск, категория, сложность.</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Поиск по названию/тегам"
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
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  options={[
                    { value: 'all', label: 'Любая сложность' },
                    { value: CYBER_DIFFICULTY.EASY, label: 'Лёгкая' },
                    { value: CYBER_DIFFICULTY.MEDIUM, label: 'Средняя' },
                    { value: CYBER_DIFFICULTY.HARD, label: 'Сложная' },
                  ]}
                />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                Найдено: <span className="font-semibold text-slate-900">{filtered.length}</span>
              </div>
            </Card>
          </div>
        </ScrollAnimation>

        <div className="mt-8 max-w-[1100px] mx-auto">
          {filtered.length === 0 ? (
            <ScrollAnimation delay={200}>
              <Card variant="glass" className="p-12 text-center">
                <HiSearch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Ничего не найдено</h3>
                <p className="text-slate-600">Попробуйте изменить запрос или фильтры.</p>
              </Card>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((c, idx) => (
                <ScrollAnimation key={c.id} delay={220 + idx * 60}>
                  <Card variant="glass" className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" size="sm">{c.category}</Badge>
                          <Badge variant={difficultyBadgeVariant(c.difficulty)} size="sm">
                            {difficultyLabel(c.difficulty)}
                          </Badge>
                          <span className="text-xs font-semibold text-slate-700 bg-white/70 border border-app-border rounded-full px-3 py-1">
                            {c.points} pts
                          </span>
                          <span className="text-xs font-semibold text-slate-700 bg-white/70 border border-app-border rounded-full px-3 py-1">
                            ~{c.estimatedMinutes} мин
                          </span>
                        </div>
                        <h2 className="mt-3 text-xl font-extrabold text-slate-900 truncate">{c.title}</h2>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {c.shortDescription}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {c.tags.slice(0, 4).map((t) => (
                            <span key={t} className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button asChild variant="primary" size="sm" className="w-full">
                        <Link href={`/cybersecurity/ctf/${c.id}`} className="inline-flex items-center justify-center w-full">
                          Открыть задачу
                          <HiArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>

        <ScrollAnimation delay={700}>
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

