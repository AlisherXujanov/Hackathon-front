'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '../../../../../components/Card'
import Badge from '../../../../../components/Badge'
import Button from '../../../../../components/Button'
import ScrollAnimation from '../../../../../components/ScrollAnimation'
import { getLessonById } from '../../../../../store/programming/lessonsData'
import { awardPoints, incrementUserStat } from '../../../../../store/gamification/gamificationData'
import { authService } from '../../../../../services/api'
import { HiArrowLeft, HiCheckCircle, HiXCircle, HiArrowRight, HiClock } from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'

export default function ProgrammingLessonTestPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const lesson = useMemo(() => getLessonById(id), [id])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (!lesson?.test) return
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [lesson, startTime])

  useEffect(() => {
    if (typeof window === 'undefined' || !lesson) return
    const key = `programming_lesson_${id}_test`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.completed) {
          setIsSubmitted(true)
          setScore(data.score)
          setAnswers(data.answers)
        }
      } catch {
        // ignore
      }
    }
  }, [id, lesson])

  if (!lesson || !lesson.test) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <Card variant="glass" className="p-10 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">Тест не найден</h1>
            <p className="mt-2 text-slate-600">Для этого урока тест не доступен.</p>
            <div className="mt-6">
              <Button asChild variant="primary">
                <Link href={`/programming/lessons/${id}`}>Вернуться к уроку</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  const questions = lesson.test.questions || []
  const currentQ = questions[currentQuestion]
  const totalQuestions = questions.length

  const handleAnswer = (questionId, answerIndex) => {
    if (isSubmitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correct++
      }
    })
    const finalScore = Math.round((correct / totalQuestions) * 100)
    setScore(finalScore)
    setIsSubmitted(true)

    if (typeof window !== 'undefined') {
      const key = `programming_lesson_${id}_test`
      localStorage.setItem(key, JSON.stringify({
        completed: true,
        score: finalScore,
        answers,
        timeSpent,
        completedAt: new Date().toISOString(),
      }))
      
      // Начисляем очки за прохождение теста
      const user = authService.getCurrentUser()
      const userData = user?.data || user
      const userId = userData?.id
      
      if (userId && lesson) {
        const points = finalScore >= 70 ? 10 : 5 // Больше очков за хороший результат
        awardPoints(userId, points, `Пройден тест по уроку "${lesson.title}" (${finalScore}%)`, 'lesson')
        incrementUserStat(userId, 'lessons_completed', 1)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isPassed = score >= 70

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
              <Link href={`/programming/lessons/${id}`}>
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Назад к уроку
              </Link>
            </Button>
          </div>
        </ScrollAnimation>

        <div className="max-w-[900px] mx-auto">
          {!isSubmitted ? (
            <>
              <ScrollAnimation>
                <Card variant="glass" className="p-6 md:p-8 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                        Тест: {lesson.title}
                      </h1>
                      <p className="text-slate-600">
                        Вопрос {currentQuestion + 1} из {totalQuestions}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <HiClock className="w-5 h-5" />
                      <span className="font-semibold">{formatTime(timeSpent)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                    />
                  </div>

                  {/* Question */}
                  {currentQ && (
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                        {currentQ.question}
                      </h2>
                      <div className="space-y-3">
                        {currentQ.options.map((option, idx) => {
                          const isSelected = answers[currentQ.id] === idx
                          const isCorrect = idx === currentQ.correct
                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswer(currentQ.id, idx)}
                              disabled={isSubmitted}
                              className={`
                                w-full text-left p-4 rounded-xl border-2 transition-all
                                ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                                    : 'border-app-border bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                }
                                ${isSubmitted && isCorrect ? 'border-green-600 bg-green-50' : ''}
                                ${isSubmitted && isSelected && !isCorrect ? 'border-red-600 bg-red-50' : ''}
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`
                                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                    ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}
                                    ${isSubmitted && isCorrect ? 'border-green-600 bg-green-600' : ''}
                                    ${isSubmitted && isSelected && !isCorrect ? 'border-red-600 bg-red-600' : ''}
                                  `}
                                >
                                  {isSelected && (
                                    <div className="w-3 h-3 rounded-full bg-white" />
                                  )}
                                </div>
                                <span className="flex-1">{option}</span>
                                {isSubmitted && isCorrect && (
                                  <HiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                )}
                                {isSubmitted && isSelected && !isCorrect && (
                                  <HiXCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-app-border">
                    <Button
                      variant="outline"
                      onClick={handlePrev}
                      disabled={currentQuestion === 0}
                    >
                      <HiArrowLeft className="w-4 h-4 mr-2" />
                      Назад
                    </Button>
                    <div className="text-sm text-slate-600">
                      {Object.keys(answers).length} из {totalQuestions} ответов
                    </div>
                    {currentQuestion < totalQuestions - 1 ? (
                      <Button variant="primary" onClick={handleNext}>
                        Вперед
                        <HiArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleSubmit}>
                        Завершить тест
                        <HiCheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </Card>
              </ScrollAnimation>
            </>
          ) : (
            <ScrollAnimation>
              <Card variant="glass" className="p-8 md:p-10 text-center">
                <div className="mb-6">
                  <div
                    className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                      isPassed
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gradient-to-br from-red-500 to-orange-600'
                    }`}
                  >
                    {isPassed ? (
                      <FaTrophy className="w-10 h-10 text-white" />
                    ) : (
                      <HiXCircle className="w-10 h-10 text-white" />
                    )}
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
                  {isPassed ? 'Поздравляем!' : 'Попробуйте еще раз'}
                </h1>
                <p className="text-lg text-slate-600 mb-6">
                  Ваш результат: <span className="font-extrabold text-slate-900">{score}%</span>
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                  <Card variant="glass" className="p-4">
                    <div className="text-sm text-slate-600 mb-1">Правильных</div>
                    <div className="text-2xl font-extrabold text-green-600">
                      {questions.filter((q) => answers[q.id] === q.correct).length}
                    </div>
                  </Card>
                  <Card variant="glass" className="p-4">
                    <div className="text-sm text-slate-600 mb-1">Время</div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {formatTime(timeSpent)}
                    </div>
                  </Card>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="primary">
                    <Link href={`/programming/lessons/${id}`}>
                      Вернуться к уроку
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/programming/lessons">
                      Все уроки
                    </Link>
                  </Button>
                </div>
              </Card>
            </ScrollAnimation>
          )}
        </div>
      </div>
    </main>
  )
}
