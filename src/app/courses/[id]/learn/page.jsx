'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Card from '../../../../components/Card'
import Button from '../../../../components/Button'
import Badge from '../../../../components/Badge'
import ScrollAnimation from '../../../../components/ScrollAnimation'
import { 
  HiCheckCircle,
  HiLockClosed,
  HiPlay,
  HiBookOpen,
  HiArrowLeft,
  HiArrowRight,
  HiClock
} from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'
import { courseService } from '../../../../services/courseService'
import { getCourseById } from '../../../../store/courses/courseData'
import { authService } from '../../../../services/api'
import { awardPoints, incrementUserStat } from '../../../../store/gamification/gamificationData'

export default function CourseLearnPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
    loadCourse()
  }, [courseId, router])

  const loadCourse = async () => {
    setIsLoading(true)
    try {
      const data = await courseService.getCourse(courseId)
      const courseData = data?.data || data || getCourseById(courseId)
      setCourse(courseData)

      // Load enrollment/progress
      try {
        const progressData = await courseService.getCourseProgress(courseId)
        const enrollmentData = progressData?.data || progressData
        setEnrollment(enrollmentData)
        setProgress(enrollmentData?.progress || 0)
        
        // Set first incomplete lesson as selected
        if (courseData.modules && courseData.modules.length > 0) {
          const firstModule = courseData.modules[0]
          setSelectedModule(firstModule)
          if (firstModule.lessons && firstModule.lessons.length > 0) {
            const firstIncomplete = firstModule.lessons.find(
              lesson => !enrollmentData?.completedLessons?.includes(lesson.id)
            ) || firstModule.lessons[0]
            setSelectedLesson(firstIncomplete)
          }
        }
      } catch (e) {
        // No enrollment yet
        if (courseData.modules && courseData.modules.length > 0) {
          setSelectedModule(courseData.modules[0])
          if (courseData.modules[0].lessons && courseData.modules[0].lessons.length > 0) {
            setSelectedLesson(courseData.modules[0].lessons[0])
          }
        }
      }
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLessonComplete = async (lessonId) => {
    try {
      await courseService.completeLesson(courseId, lessonId)
      // Reload progress
      const progressData = await courseService.getCourseProgress(courseId)
      const enrollmentData = progressData?.data || progressData
      setEnrollment(enrollmentData)
      const newProgress = enrollmentData?.progress || 0
      setProgress(newProgress)
      
      // Начисляем очки за завершение урока
      const user = authService.getCurrentUser()
      const userData = user?.data || user
      const userId = userData?.id
      
      if (userId && course) {
        awardPoints(userId, 10, `Завершен урок "${selectedLesson?.title || 'урок'}" в курсе "${course.title}"`, 'lesson')
        incrementUserStat(userId, 'lessons_completed', 1)
        
        // Проверяем завершение курса
        if (newProgress >= 100) {
          awardPoints(userId, 50, `Завершен курс "${course.title}"`, 'course')
          incrementUserStat(userId, 'courses_completed', 1)
        }
      }
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  const getNextLesson = () => {
    if (!course?.modules) return null
    
    let foundCurrent = false
    for (const module of course.modules) {
      if (!module.lessons) continue
      for (const lesson of module.lessons) {
        if (foundCurrent) return { module, lesson }
        if (lesson.id === selectedLesson?.id) foundCurrent = true
      }
    }
    return null
  }

  const getPrevLesson = () => {
    if (!course?.modules) return null
    
    let prevLesson = null
    for (const module of course.modules) {
      if (!module.lessons) continue
      for (const lesson of module.lessons) {
        if (lesson.id === selectedLesson?.id) return prevLesson
        prevLesson = { module, lesson }
      }
    }
    return null
  }

  const handleNext = () => {
    const next = getNextLesson()
    if (next) {
      setSelectedModule(next.module)
      setSelectedLesson(next.lesson)
    }
  }

  const handlePrev = () => {
    const prev = getPrevLesson()
    if (prev) {
      setSelectedModule(prev.module)
      setSelectedLesson(prev.lesson)
    }
  }

  const isLessonCompleted = (lessonId) => {
    return enrollment?.completedLessons?.includes(lessonId) || false
  }

  if (isLoading || !course) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0
  const completedLessons = enrollment?.completedLessons?.length || 0

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-wrapper py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/courses/${courseId}`)}
              >
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-8">
        {!isAuthenticated && (
          <div className="mb-6">
            <Card variant="glass" className="p-4 border border-primary-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-sm text-slate-700">
                  Вы можете проходить уроки без входа. Для сохранения прогресса и сертификатов войдите в аккаунт.
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await authService.login({ email: 'demo@student.local', password: 'demo', role: 'student' })
                      setIsAuthenticated(true)
                      await courseService.enrollCourse(courseId)
                      await loadCourse()
                    }}
                  >
                    Войти и сохранить прогресс
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      await courseService.enrollCourse(courseId)
                      await loadCourse()
                    }}
                  >
                    Продолжить без входа
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <Card variant="glass" className="p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Course Content</h2>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {course.modules?.map((module, moduleIndex) => (
                  <div key={module.id || moduleIndex} className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Module {module.order || moduleIndex + 1}: {module.title}
                    </h3>
                    <div className="space-y-1">
                      {module.lessons?.map((lesson, lessonIndex) => {
                        const isCompleted = isLessonCompleted(lesson.id)
                        const isSelected = lesson.id === selectedLesson?.id
                        return (
                          <button
                            key={lesson.id || lessonIndex}
                            onClick={() => {
                              setSelectedModule(module)
                              setSelectedLesson(lesson)
                            }}
                            className={`
                              w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                              ${isSelected 
                                ? 'bg-primary-100 text-primary-900 font-semibold' 
                                : 'text-gray-700 hover:bg-gray-100'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <HiCheckCircle className="w-4 h-4 text-success-600 flex-shrink-0" />
                              ) : (
                                <HiPlay className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                              <span className="flex-1 truncate">
                                {lesson.order || lessonIndex + 1}. {lesson.title}
                              </span>
                              {lesson.duration && (
                                <span className="text-xs text-gray-500">{lesson.duration}m</span>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedLesson ? (
              <Card variant="glass" className="p-8">
                <div className="mb-6">
                  <Badge variant="outline" className="mb-4">
                    {selectedModule?.title}
                  </Badge>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedLesson.title}
                  </h2>
                  {selectedLesson.duration && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <HiClock className="w-4 h-4" />
                      <span>{selectedLesson.duration} minutes</span>
                    </div>
                  )}
                </div>

                {/* Lesson Content */}
                <div className="prose max-w-none mb-8">
                  {selectedLesson.type === 'video' ? (
                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-6">
                      <HiPlay className="w-16 h-16 text-white" />
                      <p className="text-white ml-4">Video content will be displayed here</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <p className="text-gray-700">
                        Lesson content will be displayed here. This could include text, images, interactive exercises, or embedded content.
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={!getPrevLesson()}
                  >
                    <HiArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {!isLessonCompleted(selectedLesson.id) ? (
                    <Button
                      variant="primary"
                      onClick={() => handleLessonComplete(selectedLesson.id)}
                    >
                      Mark as Complete
                      <HiCheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Badge variant="success" className="px-4 py-2">
                      <HiCheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </Badge>
                  )}

                  <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={!getNextLesson()}
                  >
                    Next
                    <HiArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Course Completion */}
                {progress >= 100 && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-success-50 to-primary-50 rounded-lg border border-success-200">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center">
                        <FaTrophy className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          Congratulations! 🎉
                        </h3>
                        <p className="text-gray-700 mb-4">
                          You've completed the course! Your certificate is ready.
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => router.push('/certificates')}
                        >
                          View Certificate
                          <HiArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card variant="glass" className="p-12 text-center">
                <HiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a lesson to begin</h3>
                <p className="text-gray-600">Choose a lesson from the sidebar to start learning</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
