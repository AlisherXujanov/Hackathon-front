'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Select from '../../../components/Select'
import Textarea from '../../../components/Textarea'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { reportTemplates } from '../../../store/demo/cybersecurityData'
import { HiClipboardCopy, HiDocumentReport, HiDownload, HiTrash, HiCheckCircle, HiArrowRight } from 'react-icons/hi'

const STORAGE_KEY = 'demo_cyber_reports'

function readDrafts() {
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

function writeDrafts(next) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export default function CyberReportsPage() {
  const [templateId, setTemplateId] = useState(reportTemplates[0]?.id || '')
  const [title, setTitle] = useState('Security Report')
  const [summary, setSummary] = useState('Краткая сводка для презентации: что проверили, что нашли, что рекомендуем.')
  const [sections, setSections] = useState({})
  const [drafts, setDrafts] = useState([])
  const [toast, setToast] = useState('')

  const template = useMemo(
    () => reportTemplates.find((t) => t.id === templateId) || reportTemplates[0],
    [templateId]
  )

  useEffect(() => {
    setDrafts(readDrafts())
  }, [])

  useEffect(() => {
    if (!template) return
    setSections((prev) => {
      const next = { ...prev }
      template.sections.forEach((name) => {
        if (typeof next[name] !== 'string') next[name] = ''
      })
      return next
    })
  }, [templateId, template])

  const showToast = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2000)
  }

  const exportJson = () => {
    const payload = {
      type: 'cyber_report',
      templateId,
      templateName: template?.name,
      title,
      summary,
      sections,
      createdAt: new Date().toISOString(),
    }
    return JSON.stringify(payload, null, 2)
  }

  const saveDraft = () => {
    const payload = {
      id: `draft_${Date.now()}`,
      templateId,
      templateName: template?.name,
      title,
      summary,
      sections,
      updatedAt: new Date().toISOString(),
    }
    const next = [payload, ...drafts].slice(0, 20)
    setDrafts(next)
    writeDrafts(next)
    showToast('Черновик сохранён')
  }

  const loadDraft = (d) => {
    setTemplateId(d.templateId)
    setTitle(d.title || '')
    setSummary(d.summary || '')
    setSections(d.sections || {})
    showToast('Черновик загружен')
  }

  const deleteDraft = (id) => {
    const next = drafts.filter((d) => d.id !== id)
    setDrafts(next)
    writeDrafts(next)
    showToast('Удалено')
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('Скопировано в буфер')
    } catch {
      showToast('Не удалось скопировать')
    }
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <section className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-app-border px-4 py-2 shadow-card">
              <HiDocumentReport className="w-5 h-5 text-amber-700" />
              <span className="text-sm font-semibold text-slate-800">Reports</span>
            </div>
            <h1 className="mt-5 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
              Конструктор отчётов
            </h1>
            <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600">
              Выберите шаблон, заполните секции и экспортируйте отчёт в JSON (для демо/презентации).
            </p>
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

        <div className="mt-10 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScrollAnimation>
              <Card variant="glass" className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Шаблон"
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    options={reportTemplates.map((t) => ({ value: t.id, label: t.name }))}
                  />
                  <Input
                    label="Название"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Web Application Security Audit"
                  />
                </div>

                <div className="mt-4">
                  <Textarea
                    label="Сводка"
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Коротко: что проверили и какой итог."
                  />
                </div>

                <div className="mt-6 space-y-4">
                  {template?.sections?.map((name) => (
                    <Textarea
                      key={name}
                      label={name}
                      rows={4}
                      value={sections[name] || ''}
                      onChange={(e) => setSections((prev) => ({ ...prev, [name]: e.target.value }))}
                      placeholder={`Заполните секцию: ${name}`}
                    />
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" onClick={saveDraft}>
                    Сохранить черновик
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(exportJson())}
                  >
                    <HiClipboardCopy className="w-5 h-5 mr-2" />
                    Copy JSON
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([exportJson()], { type: 'application/json;charset=utf-8' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'security-report.json'
                      a.click()
                      URL.revokeObjectURL(url)
                      showToast('Файл сохранён')
                    }}
                  >
                    <HiDownload className="w-5 h-5 mr-2" />
                    Скачать JSON
                  </Button>
                </div>

                <div className="mt-6 pt-5 border-t border-app-border text-sm text-slate-600">
                  Совет для демо: решите одну CTF-задачу и вставьте вывод в секцию “Эксплуатация/Фикс”.
                  <span className="ml-2 inline-flex items-center">
                    <Link className="font-semibold text-amber-700 underline underline-offset-4" href="/cybersecurity/ctf">
                      Перейти в CTF
                    </Link>
                    <HiArrowRight className="w-4 h-4 ml-1 text-amber-700" />
                  </span>
                </div>
              </Card>
            </ScrollAnimation>
          </div>

          <div className="lg:col-span-1">
            <ScrollAnimation delay={120}>
              <Card variant="glass" className="p-6 sticky top-24">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-extrabold text-slate-900">Черновики</div>
                  <Badge variant="outline" size="sm">{drafts.length}</Badge>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Автоматическое сохранение черновиков.
                </div>

                <div className="mt-4 space-y-3">
                  {drafts.length === 0 ? (
                    <div className="text-sm text-slate-600">
                      Пока пусто. Нажмите «Сохранить черновик».
                    </div>
                  ) : (
                    drafts.map((d) => (
                      <div key={d.id} className="rounded-2xl border border-app-border bg-white/70 p-4">
                        <div className="text-sm font-semibold text-slate-900 break-words">{d.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{d.templateName}</div>
                        <div className="mt-3 flex items-center gap-2">
                          <Button variant="primary" size="sm" onClick={() => loadDraft(d)}>
                            Открыть
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteDraft(d.id)}>
                            <HiTrash className="w-4 h-4 mr-1" />
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-app-border">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/cybersecurity">Назад в раздел</Link>
                  </Button>
                </div>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </main>
  )
}

