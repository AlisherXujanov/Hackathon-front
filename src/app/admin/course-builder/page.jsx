'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import Input from '../../../components/Input'
import Select from '../../../components/Select'
import Textarea from '../../../components/Textarea'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../../../store/courses/courseData'
import { HiArrowLeft, HiArrowRight, HiCheckCircle, HiClipboardCopy, HiPlus, HiTrash } from 'react-icons/hi'

const STORAGE_KEY = 'demo_admin_course_builder_draft'

function readDraft() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeDraft(draft) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
}

export default function CourseBuilderPage() {
  const [step, setStep] = useState(0)
  const [toast, setToast] = useState('')

  const [draft, setDraft] = useState(() => readDraft() || ({
    title: 'Новый курс (demo)',
    category: COURSE_CATEGORIES.CYBERSECURITY,
    level: COURSE_LEVELS.BEGINNER,
    price: 0,
    shortDescription: 'Короткое описание курса для карточки.',
    description: 'Полное описание курса.',
    modules: [
      {
        id: `m_${Date.now()}`,
        title: 'Модуль 1: Введение',
        lessons: [
          { id: `l_${Date.now()}_1`, title: 'Урок 1', type: 'video', duration: 15 },
          { id: `l_${Date.now()}_2`, title: 'Практика 1', type: 'practice', duration: 20 },
        ],
      },
    ],
    publish: {
      status: 'draft',
      visibility: 'public',
      certificate: 'completion',
    },
  }))

  useEffect(() => {
    writeDraft(draft)
  }, [draft])

  const showToast = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2000)
  }

  const steps = useMemo(() => ([
    { id: 'meta', label: 'Метаданные' },
    { id: 'curriculum', label: 'Программа' },
    { id: 'publish', label: 'Публикация' },
  ]), [])

  const categoryOptions = useMemo(() => ([
    { value: COURSE_CATEGORIES.IELTS, label: 'IELTS' },
    { value: COURSE_CATEGORIES.PROGRAMMING, label: 'Programming' },
    { value: COURSE_CATEGORIES.WEB_DEV, label: 'Web Dev' },
    { value: COURSE_CATEGORIES.DATA_AI, label: 'Data/AI' },
    { value: COURSE_CATEGORIES.DEVOPS, label: 'DevOps' },
    { value: COURSE_CATEGORIES.CYBERSECURITY, label: 'Cybersecurity' },
    { value: COURSE_CATEGORIES.BUSINESS_ENGLISH, label: 'Business English' },
  ]), [])

  const levelOptions = useMemo(() => ([
    { value: COURSE_LEVELS.BEGINNER, label: 'Beginner' },
    { value: COURSE_LEVELS.INTERMEDIATE, label: 'Intermediate' },
    { value: COURSE_LEVELS.ADVANCED, label: 'Advanced' },
  ]), [])

  const buildExport = () => {
    return JSON.stringify(
      {
        type: 'course_builder_export',
        ...draft,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    )
  }

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(buildExport())
      showToast('JSON скопирован')
    } catch {
      showToast('Не удалось скопировать')
    }
  }

  const addModule = () => {
    setDraft((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        { id: `m_${Date.now()}`, title: `Модуль ${prev.modules.length + 1}`, lessons: [] },
      ],
    }))
  }

  const removeModule = (moduleId) => {
    setDraft((prev) => ({ ...prev, modules: prev.modules.filter((m) => m.id !== moduleId) }))
  }

  const updateModuleTitle = (moduleId, title) => {
    setDraft((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === moduleId ? { ...m, title } : m)),
    }))
  }

  const addLesson = (moduleId) => {
    setDraft((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => {
        if (m.id !== moduleId) return m
        const next = {
          id: `l_${Date.now()}`,
          title: `Урок ${m.lessons.length + 1}`,
          type: 'video',
          duration: 15,
        }
        return { ...m, lessons: [...m.lessons, next] }
      }),
    }))
  }

  const removeLesson = (moduleId, lessonId) => {
    setDraft((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => {
        if (m.id !== moduleId) return m
        return { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
      }),
    }))
  }

  const updateLesson = (moduleId, lessonId, patch) => {
    setDraft((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => {
        if (m.id !== moduleId) return m
        return {
          ...m,
          lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)),
        }
      }),
    }))
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-100">
      <div className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin">
                  <HiArrowLeft className="w-4 h-4 mr-2" />
                  Назад в Admin
                </Link>
              </Button>
              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">Course Builder</h1>
              <p className="mt-2 text-slate-600">Мастер-конструктор курса (UI-демо). Черновик сохраняется локально.</p>
            </div>
            <Badge variant="outline" size="sm">Demo</Badge>
          </div>
        </ScrollAnimation>

        {toast && (
          <div className="fixed right-4 top-24 z-50">
            <div className="rounded-full bg-slate-900 text-white text-sm font-semibold px-4 py-2 shadow-lg inline-flex items-center gap-2">
              <HiCheckCircle className="w-5 h-5" />
              {toast}
            </div>
          </div>
        )}

        <ScrollAnimation delay={120}>
          <Card variant="glass" className="p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {steps.map((s, idx) => (
                <div
                  key={s.id}
                  className={`
                    inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border
                    ${idx === step ? 'bg-primary-50 text-primary-800 border-primary-200' : 'bg-white/70 text-slate-700 border-app-border'}
                  `}
                >
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-extrabold ${idx === step ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {idx + 1}
                  </span>
                  {s.label}
                </div>
              ))}
            </div>
          </Card>
        </ScrollAnimation>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScrollAnimation delay={200}>
              <Card variant="glass" className="p-6 md:p-8">
                {step === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Название курса"
                        value={draft.title}
                        onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                      />
                      <Input
                        label="Цена (USD)"
                        type="number"
                        value={draft.price}
                        onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) }))}
                      />
                      <Select
                        label="Категория"
                        value={draft.category}
                        onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
                        options={categoryOptions}
                      />
                      <Select
                        label="Уровень"
                        value={draft.level}
                        onChange={(e) => setDraft((p) => ({ ...p, level: e.target.value }))}
                        options={levelOptions}
                      />
                    </div>
                    <Textarea
                      label="Короткое описание"
                      rows={3}
                      value={draft.shortDescription}
                      onChange={(e) => setDraft((p) => ({ ...p, shortDescription: e.target.value }))}
                    />
                    <Textarea
                      label="Полное описание"
                      rows={5}
                      value={draft.description}
                      onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-extrabold text-slate-900">Модули и уроки</div>
                        <div className="text-sm text-slate-600">Добавляйте модули и уроки — как в настоящем LMS.</div>
                      </div>
                      <Button variant="primary" size="sm" onClick={addModule}>
                        <HiPlus className="w-5 h-5 mr-1" />
                        Добавить модуль
                      </Button>
                    </div>

                    <div className="mt-5 space-y-4">
                      {draft.modules.map((m) => (
                        <div key={m.id} className="rounded-2xl border border-app-border bg-white/70 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <Input
                              label="Название модуля"
                              value={m.title}
                              onChange={(e) => updateModuleTitle(m.id, e.target.value)}
                            />
                            <div className="pt-7 flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => addLesson(m.id)}>
                                <HiPlus className="w-4 h-4 mr-1" />
                                Урок
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => removeModule(m.id)}>
                                <HiTrash className="w-4 h-4 mr-1" />
                                Модуль
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            {m.lessons.length === 0 ? (
                              <div className="text-sm text-slate-600">Уроков нет — добавьте первый.</div>
                            ) : (
                              m.lessons.map((l) => (
                                <div key={l.id} className="rounded-xl border border-app-border bg-white p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                    <Input
                                      label="Название урока"
                                      value={l.title}
                                      onChange={(e) => updateLesson(m.id, l.id, { title: e.target.value })}
                                    />
                                    <Select
                                      label="Тип"
                                      value={l.type}
                                      onChange={(e) => updateLesson(m.id, l.id, { type: e.target.value })}
                                      options={[
                                        { value: 'video', label: 'Video' },
                                        { value: 'practice', label: 'Practice' },
                                        { value: 'project', label: 'Project' },
                                        { value: 'quiz', label: 'Quiz' },
                                      ]}
                                    />
                                    <div className="flex gap-2">
                                      <Input
                                        label="Длительность (мин)"
                                        type="number"
                                        value={l.duration}
                                        onChange={(e) => updateLesson(m.id, l.id, { duration: Number(e.target.value) })}
                                      />
                                      <div className="pt-7">
                                        <Button variant="outline" size="sm" onClick={() => removeLesson(m.id, l.id)}>
                                          <HiTrash className="w-4 h-4 mr-1" />
                                          Удалить
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        label="Статус"
                        value={draft.publish.status}
                        onChange={(e) => setDraft((p) => ({ ...p, publish: { ...p.publish, status: e.target.value } }))}
                        options={[
                          { value: 'draft', label: 'Draft' },
                          { value: 'review', label: 'Review' },
                          { value: 'published', label: 'Published' },
                        ]}
                      />
                      <Select
                        label="Видимость"
                        value={draft.publish.visibility}
                        onChange={(e) => setDraft((p) => ({ ...p, publish: { ...p.publish, visibility: e.target.value } }))}
                        options={[
                          { value: 'public', label: 'Public' },
                          { value: 'unlisted', label: 'Unlisted' },
                          { value: 'private', label: 'Private' },
                        ]}
                      />
                      <Select
                        label="Сертификат"
                        value={draft.publish.certificate}
                        onChange={(e) => setDraft((p) => ({ ...p, publish: { ...p.publish, certificate: e.target.value } }))}
                        options={[
                          { value: 'completion', label: 'Completion' },
                          { value: 'verified', label: 'Verified' },
                          { value: 'professional', label: 'Professional' },
                        ]}
                      />
                    </div>

                    <Card variant="glass" className="p-5">
                      <div className="text-sm font-semibold text-slate-900">Демо-результат</div>
                      <div className="mt-2 text-sm text-slate-600">
                        Это UI: вы можете показать “публикацию” без реального бэка. Экспортируйте JSON и “передайте” команде.
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="primary" onClick={() => showToast('Курс отправлен на публикацию (demo)')}>
                          Опубликовать (demo)
                        </Button>
                        <Button variant="outline" onClick={copyExport}>
                          <HiClipboardCopy className="w-5 h-5 mr-2" />
                          Copy JSON
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-app-border flex items-center justify-between gap-3">
                  <Button variant="outline" onClick={prevStep} disabled={step === 0}>
                    <HiArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </Button>
                  <div className="text-sm text-slate-600">
                    Шаг {step + 1} из {steps.length}
                  </div>
                  <Button variant="primary" onClick={nextStep} disabled={step === steps.length - 1}>
                    Дальше
                    <HiArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </ScrollAnimation>
          </div>

          <div className="lg:col-span-1">
            <ScrollAnimation delay={240}>
              <Card variant="glass" className="p-6 sticky top-24">
                <div className="text-lg font-extrabold text-slate-900">Preview</div>
                <div className="mt-2 text-sm text-slate-600">Короткая сводка, чтобы показать на демо.</div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-app-border bg-white/70 p-4">
                    <div className="text-sm font-semibold text-slate-900 break-words">{draft.title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {draft.category} • {draft.level} • ${draft.price}
                    </div>
                    <div className="mt-3 text-sm text-slate-700 leading-relaxed">
                      {draft.shortDescription}
                    </div>
                  </div>

                  <div className="rounded-xl border border-app-border bg-white/70 p-4">
                    <div className="text-sm font-semibold text-slate-900">Программа</div>
                    <div className="mt-2 text-sm text-slate-700">
                      Модулей: <span className="font-semibold">{draft.modules.length}</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      Уроков: <span className="font-semibold">{draft.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDraft(readDraft() || draft)
                      showToast('Черновик обновлён')
                    }}
                    className="w-full"
                  >
                    Обновить черновик
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

