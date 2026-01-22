'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Select from '../../../components/Select'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { lessons, programmingCategories, programmingLevels, getLessonsByCategory, getLessonsByLanguage, getLessonsByLevel } from '../../../store/programming/lessonsData'
import { HiSearch, HiCode, HiArrowRight, HiFilter, HiClock, HiBookOpen } from 'react-icons/hi'

function levelLabel(value) {
  if (value === programmingLevels.BEGINNER) return 'Начальный'
  if (value === programmingLevels.INTERMEDIATE) return 'Средний'
  if (value === programmingLevels.ADVANCED) return 'Продвинутый'
  return value
}

function levelBadgeVariant(value) {
  if (value === programmingLevels.BEGINNER) return 'success'
  if (value === programmingLevels.INTERMEDIATE) return 'primary'
  if (value === programmingLevels.ADVANCED) return 'accent'
  return 'outline'
}

function categoryLabel(value) {
  if (value === programmingCategories.LANGUAGES) return 'Языки'
  if (value === programmingCategories.FRAMEWORKS) return 'Фреймворки'
  if (value === programmingCategories.LIBRARIES) return 'Библиотеки'
  return value
}

export default function ProgrammingLessonsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [language, setLanguage] = useState('all')
  const [level, setLevel] = useState('all')

  const categories = useMemo(() => {
    const set = new Set(lessons.map((l) => l.category))
    return Array.from(set).sort()
  }, [])

  const languages = useMemo(() => {
    const set = new Set(lessons.map((l) => l.language))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return lessons.filter((l) => {
      const matchesQuery = !q
        || l.title.toLowerCase().includes(q)
        || l.description.toLowerCase().includes(q)
        || l.language.toLowerCase().includes(q)

      const matchesCategory = category === 'all' || l.category === category
      const matchesLanguage = language === 'all' || l.language === language
      const matchesLevel = level === 'all' || l.level === level
      return matchesQuery && matchesCategory && matchesLanguage && matchesLevel
    })
  }, [query, category, language, level])

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_60%)]" />
      </div>

      <section className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-app-border px-4 py-2 shadow-card">
              <HiBookOpen className="w-5 h-5 text-blue-700" />
              <span className="text-sm font-semibold text-slate-800">Уроки</span>
            </div>
            <h1 className="mt-5 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
              Уроки программирования
            </h1>
            <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600">
              Изучайте языки программирования, фреймворки и библиотеки. Теория, практика и тесты для закрепления знаний.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={120}>
          <div className="mt-8 max-w-[1100px] mx-auto">
            <Card variant="glass" className="p-5 md:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                  <HiFilter className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-extrabold text-slate-900">Фильтры</div>
                  <div className="text-sm text-slate-600">Поиск, категория, язык, уровень.</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Поиск по названию/описанию"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  leftIcon={<HiSearch className="w-5 h-5" />}
                />
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={[
                    { value: 'all', label: 'Все категории' },
                    ...categories.map((c) => ({ value: c, label: categoryLabel(c) })),
                  ]}
                />
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  options={[
                    { value: 'all', label: 'Все языки/технологии' },
                    ...languages.map((l) => ({ value: l, label: l })),
                  ]}
                />
                <Select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  options={[
                    { value: 'all', label: 'Любой уровень' },
                    { value: programmingLevels.BEGINNER, label: 'Начальный' },
                    { value: programmingLevels.INTERMEDIATE, label: 'Средний' },
                    { value: programmingLevels.ADVANCED, label: 'Продвинутый' },
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((lesson, idx) => (
                <ScrollAnimation key={lesson.id} delay={220 + idx * 60}>
                  <Card variant="glass" className="p-6 h-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" size="sm">{categoryLabel(lesson.category)}</Badge>
                          <Badge variant={levelBadgeVariant(lesson.level)} size="sm">
                            {levelLabel(lesson.level)}
                          </Badge>
                          <span className="text-xs font-semibold text-slate-700 bg-white/70 border border-app-border rounded-full px-3 py-1 inline-flex items-center gap-1">
                            <HiClock className="w-4 h-4 text-slate-400" />
                            {lesson.duration} мин
                          </span>
                        </div>
                        <h2 className="mt-3 text-xl font-extrabold text-slate-900 truncate">{lesson.title}</h2>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                          {lesson.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <HiCode className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">{lesson.language}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button asChild variant="primary" size="sm" className="w-full">
                        <Link href={`/programming/lessons/${lesson.id}`} className="inline-flex items-center justify-center w-full">
                          Начать урок
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
              <Link href="/programming">Назад в раздел</Link>
            </Button>
          </div>
        </ScrollAnimation>
      </section>
    </main>
  )
}
