'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Card from '../../../../components/Card'
import Badge from '../../../../components/Badge'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import ScrollAnimation from '../../../../components/ScrollAnimation'
import { ctfChallenges, CYBER_DIFFICULTY } from '../../../../store/demo/cybersecurityData'
import { HiArrowLeft, HiCheckCircle, HiInformationCircle, HiLightBulb, HiShieldCheck, HiXCircle } from 'react-icons/hi'

function difficultyLabel(value) {
  if (value === CYBER_DIFFICULTY.EASY) return 'Лёгкая'
  if (value === CYBER_DIFFICULTY.MEDIUM) return 'Средняя'
  if (value === CYBER_DIFFICULTY.HARD) return 'Сложная'
  return value
}

export default function CyberCTFChallengePage() {
  const params = useParams()
  const id = params.id

  const challenge = useMemo(() => ctfChallenges.find((c) => c.id === id), [id])
  const [flag, setFlag] = useState('')
  const [status, setStatus] = useState(null) // null | 'ok' | 'fail'
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('demo_ctf_solved')
    const list = raw ? JSON.parse(raw) : []
    setSolved(Array.isArray(list) && list.includes(id))
  }, [id])

  const markSolved = () => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('demo_ctf_solved')
    const list = raw ? JSON.parse(raw) : []
    const next = Array.isArray(list) ? list : []
    if (!next.includes(id)) next.push(id)
    localStorage.setItem('demo_ctf_solved', JSON.stringify(next))
    setSolved(true)
  }

  if (!challenge) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 pb-10 sm:pt-28">
          <Card variant="glass" className="p-10 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">Задача не найдена</h1>
            <p className="mt-2 text-slate-600">Проверьте ссылку или вернитесь в список.</p>
            <div className="mt-6">
              <Button asChild variant="primary">
                <Link href="/cybersecurity/ctf">К списку задач</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  const handleSubmit = () => {
    const input = flag.trim()
    if (!input) return
    if (input === challenge.demoFlag) {
      setStatus('ok')
      markSolved()
      return
    }
    setStatus('fail')
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-cyan-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ScrollAnimation>
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/cybersecurity/ctf">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Назад к задачам
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
                      <Badge variant="outline" size="sm">{challenge.category}</Badge>
                      <Badge variant="outline" size="sm">{difficultyLabel(challenge.difficulty)}</Badge>
                      <span className="text-xs font-semibold text-slate-700 bg-white/70 border border-app-border rounded-full px-3 py-1">
                        {challenge.points} pts
                      </span>
                      {solved && (
                        <Badge variant="success" size="sm">
                          <HiCheckCircle className="w-4 h-4 mr-1" />
                          Solved
                        </Badge>
                      )}
                    </div>
                    <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 break-words">
                      {challenge.title}
                    </h1>
                    <p className="mt-3 text-slate-600 leading-relaxed">{challenge.story}</p>
                  </div>
                  <div className="hidden md:flex h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 text-white items-center justify-center shadow-lg">
                    <HiShieldCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-app-border bg-white/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <HiInformationCircle className="w-5 h-5 text-emerald-700" />
                      Цель
                    </div>
                    <div className="mt-2 text-sm text-slate-700">{challenge.objective}</div>
                  </div>
                  <div className="rounded-2xl border border-app-border bg-white/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <HiLightBulb className="w-5 h-5 text-amber-600" />
                      Подсказка
                    </div>
                    <div className="mt-2 text-sm text-slate-700">{challenge.hint}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-semibold text-slate-900">Теги</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {challenge.tags.map((t) => (
                      <span key={t} className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                        {t}
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
                <div className="text-lg font-extrabold text-slate-900">Отправить флаг</div>
                <div className="mt-2 text-sm text-slate-600">
                  Формат: <span className="font-semibold text-slate-900">{challenge.flagFormat}</span>
                </div>

                <div className="mt-4">
                  <Input
                    placeholder="Введите флаг…"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                  />
                </div>

                {status === 'ok' && (
                  <div className="mt-4 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800">
                    <div className="flex items-center gap-2 font-semibold">
                      <HiCheckCircle className="w-5 h-5" />
                      Флаг принят
                    </div>
                    <div className="mt-1">Задача отмечена как решённая.</div>
                  </div>
                )}
                {status === 'fail' && (
                  <div className="mt-4 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-800">
                    <div className="flex items-center gap-2 font-semibold">
                      <HiXCircle className="w-5 h-5" />
                      Неверный флаг
                    </div>
                    <div className="mt-1">Проверьте формат флага и попробуйте снова.</div>
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="primary" onClick={handleSubmit}>
                    Проверить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFlag(challenge.demoFlag)
                      setStatus(null)
                    }}
                  >
                    Показать пример флага
                  </Button>
                </div>

                <div className="mt-6 pt-5 border-t border-app-border text-sm text-slate-600">
                  После решения можно перейти в <Link className="font-semibold text-emerald-700 underline underline-offset-4" href="/cybersecurity/reports">отчёты</Link> и сформировать writeup.
                </div>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </main>
  )
}

