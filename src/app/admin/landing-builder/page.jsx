'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import Input from '../../../components/Input'
import Textarea from '../../../components/Textarea'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiArrowLeft, HiCheckCircle, HiClipboardCopy, HiSparkles } from 'react-icons/hi'

const STORAGE_KEY = 'demo_admin_landing_builder'

function readConfig() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeConfig(cfg) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
}

export default function LandingBuilderPage() {
  const [toast, setToast] = useState('')
  const [cfg, setCfg] = useState(() => readConfig() || ({
    enabled: {
      hero: true,
      benefits: true,
      pricing: true,
      faq: true,
    },
    hero: {
      title: 'FrameSchool — учись быстрее',
      subtitle: 'Конструктор промо-лендинга: блоки, CTA, pricing, FAQ.',
      ctaText: 'Start demo',
    },
    benefits: [
      { title: 'Интерактивность', text: 'Песочница, сниппеты, CTF и лаборатории.' },
      { title: 'Трекинг', text: 'Прогресс, аналитика, сертификаты.' },
      { title: 'Готово к использованию', text: 'Всё открывается и выглядит как продукт.' },
    ],
    pricing: [
      { name: 'Free', price: '$0', items: ['Базовый доступ', 'Ограниченные курсы', 'Community'] },
      { name: 'Plus', price: '$9', items: ['Все курсы', 'Сертификаты', 'CTF и Labs'] },
      { name: 'Pro', price: '$19', items: ['Проф. треки', 'Проверка работ', 'Team features'] },
    ],
    faq: [
      { q: 'Как сохраняются данные?', a: 'Конфигурация сохраняется автоматически.' },
      { q: 'Можно ли добавить новые разделы?', a: 'Да, это конструктор: блоки можно расширять.' },
      { q: 'Это production-ready?', a: 'Для хакатона важнее UX и сценарий презентации.' },
    ],
  }))

  useEffect(() => {
    writeConfig(cfg)
  }, [cfg])

  const showToast = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2000)
  }

  const exportJson = useMemo(() => {
    return JSON.stringify({ type: 'landing_builder_export', ...cfg, exportedAt: new Date().toISOString() }, null, 2)
  }, [cfg])

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportJson)
      showToast('JSON скопирован')
    } catch {
      showToast('Не удалось скопировать')
    }
  }

  const toggle = (key) => {
    setCfg((p) => ({ ...p, enabled: { ...p.enabled, [key]: !p.enabled[key] } }))
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
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
              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">Landing Builder</h1>
              <p className="mt-2 text-slate-600">Конструктор промо-лендинга из блоков.</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollAnimation delay={120}>
            <Card variant="glass" className="p-6 md:p-8">
              <div className="text-lg font-extrabold text-slate-900">Блоки</div>
              <div className="mt-2 text-sm text-slate-600">Включайте/выключайте секции — как в реальном builder.</div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { key: 'hero', label: 'Hero' },
                  { key: 'benefits', label: 'Benefits' },
                  { key: 'pricing', label: 'Pricing' },
                  { key: 'faq', label: 'FAQ' },
                ].map((b) => (
                  <button
                    key={b.key}
                    onClick={() => toggle(b.key)}
                    className={`
                      rounded-full px-4 py-2 text-sm font-semibold border transition-all
                      ${cfg.enabled[b.key] ? 'bg-violet-50 text-violet-800 border-violet-200' : 'bg-white/70 text-slate-700 border-app-border'}
                    `}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <Input
                  label="Hero title"
                  value={cfg.hero.title}
                  onChange={(e) => setCfg((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                />
                <Textarea
                  label="Hero subtitle"
                  rows={3}
                  value={cfg.hero.subtitle}
                  onChange={(e) => setCfg((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
                />
                <Input
                  label="CTA text"
                  value={cfg.hero.ctaText}
                  onChange={(e) => setCfg((p) => ({ ...p, hero: { ...p.hero, ctaText: e.target.value } }))}
                />
              </div>

              <div className="mt-6 pt-5 border-t border-app-border flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => showToast('Сохранено')}>
                  Сохранить
                </Button>
                <Button variant="outline" onClick={copyExport}>
                  <HiClipboardCopy className="w-5 h-5 mr-2" />
                  Copy JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCfg(readConfig() || cfg)
                    showToast('Загружено')
                  }}
                >
                  Reload
                </Button>
              </div>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={180}>
            <Card variant="glass" className="p-6 md:p-8">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-5 h-5 text-violet-700" />
                <div className="text-lg font-extrabold text-slate-900">Live preview</div>
              </div>
              <div className="mt-2 text-sm text-slate-600">Предпросмотр лендинга по конфигу.</div>

              <div className="mt-5 rounded-2xl border border-app-border bg-white p-5">
                {cfg.enabled.hero && (
                  <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
                    <div className="text-3xl font-extrabold text-slate-900">{cfg.hero.title}</div>
                    <div className="mt-2 text-slate-600">{cfg.hero.subtitle}</div>
                    <div className="mt-4">
                      <button className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-extrabold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600">
                        {cfg.hero.ctaText}
                      </button>
                    </div>
                  </div>
                )}

                {cfg.enabled.benefits && (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-700 mb-3">Benefits</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {cfg.benefits.map((b, idx) => (
                        <div key={idx} className="rounded-2xl border border-app-border bg-white/70 p-4">
                          <div className="font-extrabold text-slate-900">{b.title}</div>
                          <div className="mt-2 text-sm text-slate-600">{b.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cfg.enabled.pricing && (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-700 mb-3">Pricing</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {cfg.pricing.map((p, idx) => (
                        <div key={idx} className="rounded-2xl border border-app-border bg-white/70 p-4">
                          <div className="flex items-baseline justify-between">
                            <div className="font-extrabold text-slate-900">{p.name}</div>
                            <div className="font-extrabold text-slate-900">{p.price}</div>
                          </div>
                          <ul className="mt-3 space-y-1 text-sm text-slate-600">
                            {p.items.map((it) => (
                              <li key={it}>• {it}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cfg.enabled.faq && (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-700 mb-3">FAQ</div>
                    <div className="space-y-2">
                      {cfg.faq.map((f, idx) => (
                        <div key={idx} className="rounded-2xl border border-app-border bg-white/70 p-4">
                          <div className="font-extrabold text-slate-900">{f.q}</div>
                          <div className="mt-2 text-sm text-slate-600">{f.a}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}

