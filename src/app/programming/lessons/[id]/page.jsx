'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '../../../../components/Card'
import Badge from '../../../../components/Badge'
import Button from '../../../../components/Button'
import Textarea from '../../../../components/Textarea'
import ScrollAnimation from '../../../../components/ScrollAnimation'
import { getLessonById, programmingLevels } from '../../../../store/programming/lessonsData'
import { awardPoints, incrementUserStat } from '../../../../store/gamification/gamificationData'
import { authService } from '../../../../services/api'
import { HiArrowLeft, HiCheckCircle, HiCode, HiLightBulb, HiClock, HiArrowRight, HiBookOpen } from 'react-icons/hi'

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

export default function ProgrammingLessonPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const lesson = useMemo(() => getLessonById(id), [id])
  const [activeTab, setActiveTab] = useState('theory') // theory | exercises
  const [exerciseAnswers, setExerciseAnswers] = useState({})
  const [completedExercises, setCompletedExercises] = useState([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !lesson) return
    const key = `programming_lesson_${id}_progress`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCompletedExercises(data.completedExercises || [])
        setExerciseAnswers(data.answers || {})
        setProgress(data.progress || 0)
      } catch {
        // ignore
      }
    }
  }, [id, lesson])

  const saveProgress = () => {
    if (typeof window === 'undefined' || !lesson) return
    const key = `programming_lesson_${id}_progress`
    const totalExercises = lesson.exercises?.length || 0
    const completed = completedExercises.length
    const newProgress = totalExercises > 0 ? Math.round((completed / totalExercises) * 100) : 0
    setProgress(newProgress)
    localStorage.setItem(key, JSON.stringify({
      completedExercises,
      answers: exerciseAnswers,
      progress: newProgress,
    }))
  }

  const handleExerciseAnswer = (exerciseId, answer) => {
    setExerciseAnswers((prev) => ({ ...prev, [exerciseId]: answer }))
  }

  const handleExerciseComplete = (exerciseId) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises((prev) => [...prev, exerciseId])
      saveProgress()
      
      // Начисляем очки за выполнение упражнения
      const user = authService.getCurrentUser()
      const userData = user?.data || user
      const userId = userData?.id
      
      if (userId) {
        awardPoints(userId, 5, `Выполнено упражнение в уроке "${lesson.title}"`, 'lesson')
        incrementUserStat(userId, 'lessons_completed', 1)
        
        // Обновляем статистику по языку
        if (lesson.language) {
          const langKey = `user_${userId}_lessons_by_language`
          const langData = JSON.parse(localStorage.getItem(langKey) || '{}')
          langData[lesson.language] = (langData[lesson.language] || 0) + 1
          localStorage.setItem(langKey, JSON.stringify(langData))
        }
      }
    }
  }

  if (!lesson) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <Card variant="glass" className="p-10 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">Урок не найден</h1>
            <p className="mt-2 text-slate-600">Проверьте ссылку или вернитесь в список.</p>
            <div className="mt-6">
              <Button asChild variant="primary">
                <Link href="/programming/lessons">К списку уроков</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  const totalExercises = lesson.exercises?.length || 0
  const completedCount = completedExercises.length

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <ScrollAnimation>
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/programming/lessons">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Назад к урокам
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
                      <Badge variant="outline" size="sm">{lesson.language}</Badge>
                      <Badge variant={levelBadgeVariant(lesson.level)} size="sm">
                        {levelLabel(lesson.level)}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-700 bg-white/70 border border-app-border rounded-full px-3 py-1 inline-flex items-center gap-1">
                        <HiClock className="w-4 h-4 text-slate-400" />
                        {lesson.duration} мин
                      </span>
                    </div>
                    <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 break-words">
                      {lesson.title}
                    </h1>
                    <p className="mt-3 text-slate-600 leading-relaxed">{lesson.description}</p>
                  </div>
                  <div className="hidden md:flex h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white items-center justify-center shadow-lg">
                    <HiCode className="w-6 h-6" />
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 flex gap-2 border-b border-app-border">
                  <button
                    onClick={() => setActiveTab('theory')}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === 'theory'
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <HiBookOpen className="w-4 h-4 inline mr-2" />
                    Теория
                  </button>
                  <button
                    onClick={() => setActiveTab('exercises')}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === 'exercises'
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <HiCode className="w-4 h-4 inline mr-2" />
                    Упражнения ({completedCount}/{totalExercises})
                  </button>
                </div>

                {/* Theory Tab */}
                {activeTab === 'theory' && (
                  <div className="mt-6">
                    <div className="prose max-w-none">
                      <div className="bg-slate-50 rounded-xl p-6 border border-app-border">
                        <pre className="whitespace-pre-wrap text-sm text-slate-800 font-mono leading-relaxed">
                          {lesson.theory}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Exercises Tab */}
                {activeTab === 'exercises' && (
                  <div className="mt-6 space-y-6">
                    {lesson.exercises && lesson.exercises.length > 0 ? (
                      lesson.exercises.map((exercise, idx) => {
                        const isCompleted = completedExercises.includes(exercise.id)
                        return (
                          <Card key={exercise.id} variant="glass" className="p-6">
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                  {idx + 1}
                                </div>
                                <h3 className="text-lg font-extrabold text-slate-900">Упражнение {idx + 1}</h3>
                              </div>
                              {isCompleted && (
                                <Badge variant="success" size="sm">
                                  <HiCheckCircle className="w-4 h-4 mr-1" />
                                  Выполнено
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-700 mb-4 leading-relaxed">{exercise.question}</p>
                            {exercise.hint && (
                              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                                <div className="flex items-start gap-2">
                                  <HiLightBulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-sm text-amber-800">{exercise.hint}</p>
                                </div>
                              </div>
                            )}
                            <Textarea
                              placeholder="Введите ваш код здесь..."
                              rows={8}
                              value={exerciseAnswers[exercise.id] || ''}
                              onChange={(e) => handleExerciseAnswer(exercise.id, e.target.value)}
                              className="font-mono text-sm"
                            />
                            <div className="mt-4 flex items-center gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleExerciseComplete(exercise.id)}
                                disabled={isCompleted}
                              >
                                {isCompleted ? (
                                  <>
                                    <HiCheckCircle className="w-4 h-4 mr-2" />
                                    Выполнено
                                  </>
                                ) : (
                                  'Отметить как выполненное'
                                )}
                              </Button>
                              {exercise.solution && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleExerciseAnswer(exercise.id, exercise.solution)}
                                >
                                  Показать решение
                                </Button>
                              )}
                            </div>
                          </Card>
                        )
                      })
                    ) : (
                      <Card variant="glass" className="p-8 text-center">
                        <HiCode className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">Упражнения для этого урока пока не добавлены.</p>
                      </Card>
                    )}
                  </div>
                )}
              </Card>
            </ScrollAnimation>
          </div>

          <div className="lg:col-span-1">
            <ScrollAnimation delay={120}>
              <Card variant="glass" className="p-6 sticky top-24">
                <div className="text-lg font-extrabold text-slate-900 mb-4">Прогресс</div>
                <div className="mb-4">
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-slate-600 text-center">
                    {progress}% завершено
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-app-border">
                  <div className="text-sm font-semibold text-slate-900 mb-3">Информация</div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Упражнений:</span>
                      <span className="font-semibold text-slate-900">{totalExercises}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Выполнено:</span>
                      <span className="font-semibold text-slate-900">{completedCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Длительность:</span>
                      <span className="font-semibold text-slate-900">{lesson.duration} мин</span>
                    </div>
                  </div>
                </div>

                {lesson.test && (
                  <div className="mt-6 pt-5 border-t border-app-border">
                    <Button asChild variant="primary" size="sm" className="w-full">
                      <Link href={`/programming/lessons/${id}/test`} className="inline-flex items-center justify-center w-full">
                        Пройти тест
                        <HiArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <p className="mt-2 text-xs text-slate-600 text-center">
                      {lesson.test.questions?.length || 0} вопросов
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-app-border">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/programming/lessons">Все уроки</Link>
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
