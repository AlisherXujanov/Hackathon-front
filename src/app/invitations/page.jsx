'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import { authService, invitationsService } from '../../services/api'
import {
  HiMail,
  HiUser,
  HiCheck,
  HiX,
  HiClock,
  HiRefresh,
} from 'react-icons/hi'


function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Ожидает', className: 'bg-amber-100 text-amber-800' },
    accepted: { label: 'Принято', className: 'bg-emerald-100 text-emerald-800' },
    reject: { label: 'Отклонено', className: 'bg-slate-100 text-slate-600' },
  }
  const config = map[status] || map.pending
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${config.className}`}
    >
      {status === 'pending' && <HiClock className="w-3.5 h-3.5" />}
      {status === 'accepted' && <HiCheck className="w-3.5 h-3.5" />}
      {status === 'reject' && <HiX className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  )
}

function InvitationCard({ inv, onRespond, respondingId }) {
  const isPending = inv.status === 'pending'
  const isResponding = respondingId === inv.id

  return (
    <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white hover:bg-slate-50/80 transition-colors duration-200 rounded-xl border border-slate-100">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-semibold text-slate-900 text-lg font-display">
            {inv.class_name || 'Класс'}
          </span>
          {inv.class_code && (
            <span className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
              {inv.class_code}
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-slate-600">
          {inv.teacher_name && (
            <span className="flex items-center gap-1.5">
              <HiUser className="w-4 h-4 text-slate-400 shrink-0" />
              {inv.teacher_name}
            </span>
          )}
          {inv.teacher_email && (
            <a
              href={`mailto:${inv.teacher_email}`}
              className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <HiMail className="w-4 h-4 shrink-0" />
              {inv.teacher_email}
            </a>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Приглашение: {formatDate(inv.created_at)}
          {inv.responded_at && ` · Ответ: ${formatDate(inv.responded_at)}`}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
        <StatusBadge status={inv.status} />
        {isPending && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRespond(inv.id, 'accept')}
              disabled={isResponding}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isResponding ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  …
                </>
              ) : (
                <>
                  <HiCheck className="w-4 h-4" />
                  Принять
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onRespond(inv.id, 'reject')}
              disabled={isResponding}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <HiX className="w-4 h-4" />
              Отклонить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InvitationsPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [respondingId, setRespondingId] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    count: 0,
    next: null,
    previous: null,
  })

  const checkAccess = useCallback(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return false
    }
    const user = authService.getCurrentUser()
    const userData = user?.data || user
    const role = userData?.role
    if (role !== 'student') {
      router.push('/')
      return false
    }
    return true
  }, [router])

  useEffect(() => {
    if (!checkAccess()) return
    setIsChecking(false)
  }, [checkAccess])

  const loadInvitations = useCallback(async () => {
    if (!checkAccess()) return
    try {
      setLoading(true)
      setError(null)
      const res = await invitationsService.getInvitations({
        page: pagination.page,
      })
      const items = Array.isArray(res.data) ? res.data : (res.results || [])
      setList(items)
      setPagination((prev) => ({
        ...prev,
        count: res.count ?? items.length,
        next: res.next ?? null,
        previous: res.previous ?? null,
      }))
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке приглашений')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, checkAccess])

  useEffect(() => {
    if (isChecking) return
    loadInvitations()
  }, [isChecking, loadInvitations])

  const handleRespond = async (id, action) => {
    try {
      setRespondingId(id)
      await invitationsService.respond(id, action)
      setList((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: action === 'accept' ? 'accepted' : 'declined', responded_at: new Date().toISOString() } : inv
        )
      )
    } catch (err) {
      setError(err.message || 'Ошибка при ответе на приглашение')
    } finally {
      setRespondingId(null)
    }
  }

  const handlePageChange = (page) => {
    if (page < 1) return
    setPagination((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasNext = !!pagination.next
  const hasPrev = !!pagination.previous

  if (isChecking) {
    return (
      <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
        <div className="container-wrapper relative pt-24 pb-10 flex items-center justify-center min-h-[60vh]">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
        </div>
      </main>
    )
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-24 right-12 h-40 w-40 rounded-full bg-primary-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 h-44 w-44 rounded-full bg-accent-200/40 blur-3xl animate-pulse" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(109,40,217,0.12),_transparent_60%)]" />
      </div>

      <div className="container-wrapper relative pt-24 pb-10 sm:pt-28 md:pt-28 md:pb-14">
        <ScrollAnimation>
          <div className="relative mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 mb-4 tracking-wide">
                Для студентов
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-3 text-slate-900 font-display">
                Приглашения в классы
              </h1>
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-accent">
                Просматривайте приглашения от преподавателей и принимайте или отклоняйте их.
              </p>
            </div>
            <button
              type="button"
              onClick={loadInvitations}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Обновить список"
            >
              <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <Card variant="glass" className="overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
                <p className="mt-4 text-slate-600">Загрузка приглашений…</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  type="button"
                  onClick={loadInvitations}
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            ) : list.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <HiMail className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Нет приглашений</h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  Сейчас у вас нет приглашений в классы. Когда преподаватель пришлёт приглашение, оно появится здесь.
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-slate-200/70">
                  {list.map((inv) => (
                    <div key={inv.id} className="px-4 sm:px-6 py-2 first:pt-4 last:pb-4">
                      <InvitationCard
                        inv={inv}
                        onRespond={handleRespond}
                        respondingId={respondingId}
                      />
                    </div>
                  ))}
                </div>

                {(hasPrev || hasNext || pagination.count > 0) && (
                  <div className="p-4 sm:p-6 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                      {pagination.count > 0 && `Всего ${pagination.count} приглашений`}
                      {hasPrev || hasNext ? ` · Страница ${pagination.page}` : ''}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!hasPrev || loading}
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Назад
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!hasNext || loading}
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Вперёд
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </ScrollAnimation>
      </div>
    </main>
  )
}
