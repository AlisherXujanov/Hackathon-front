'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { 
  HiStar, 
  HiClock, 
  HiUserGroup,
  HiCheckCircle,
  HiBookOpen,
  HiShieldCheck,
  HiArrowRight,
  HiPlay,
  HiLockClosed,
  HiAcademicCap,
  HiChevronDown,
  HiHeart
} from 'react-icons/hi'
import { courseService } from '../../../services/courseService'
import { getCourseById, COURSE_LEVELS, CERTIFICATE_TYPES } from '../../../store/courses/courseData'
import { authService } from '../../../services/api'

export default function CourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrollment, setEnrollment] = useState(null)
  const [error, setError] = useState(null)
  const [openModule, setOpenModule] = useState(0)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login?redirect=/courses/' + courseId)
      return
    }
    loadCourse()
  }, [courseId, router])

  const loadCourse = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Try API first
      const data = await courseService.getCourse(courseId)
      const courseData = data?.data || data
      setCourse(courseData)

      // Check enrollment
      try {
        const progress = await courseService.getCourseProgress(courseId)
        setIsEnrolled(true)
        setEnrollment(progress?.data || progress)
      } catch (e) {
        setIsEnrolled(false)
      }
    } catch (err) {
      // Fallback to sample data
      const sampleCourse = getCourseById(courseId)
      if (sampleCourse) {
        setCourse(sampleCourse)
      } else {
        setError('Course not found')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      await courseService.enrollCourse(courseId)
      router.push(`/courses/${courseId}/learn`)
    } catch (error) {
      console.error('Error enrolling:', error)
      // If enrollment fails, try purchase
      router.push(`/checkout/course?course=${courseId}`)
    }
  }

  const handlePurchase = () => {
    router.push(`/checkout/course?course=${courseId}`)
  }

  const fallbackContent = useMemo(() => {
    const isProgramming = course?.category === 'programming'
    if (!isProgramming) {
      return {
        overview: course?.description || course?.shortDescription || '',
        learningOutcomes: [],
        requirements: [],
        modules: course?.modules || [],
        instructor: course?.instructor || null,
        reviews: [],
      }
    }

    return {
      overview: course?.description || course?.shortDescription || 'Освойте основы Python — от синтаксиса до практических задач, которые встречаются в реальной работе.',
      learningOutcomes: (course?.learningOutcomes && course.learningOutcomes.length > 0)
        ? course.learningOutcomes
        : [
          'Писать чистый Python-код: переменные, условия, циклы, функции',
          'Работать со списками, словарями, строками и файлами',
          'Понимать основы ООП и применять их на практике',
          'Решать типовые задачи и собирать небольшие проекты',
          'Отлаживать код и читать сообщения об ошибках',
        ],
      requirements: (course?.requirements && course.requirements.length > 0)
        ? course.requirements
        : [
          'Базовая компьютерная грамотность',
          'Желание практиковаться (10–20 минут в день достаточно для старта)',
        ],
      modules: (course?.modules && course.modules.length > 0)
        ? course.modules
        : [
          {
            id: 'm1',
            order: 1,
            title: 'Старт и основы синтаксиса',
            description: 'Переменные, типы данных, ввод/вывод.',
            lessons: [
              { id: 'l1', order: 1, title: 'Установка и запуск Python', duration: 8 },
              { id: 'l2', order: 2, title: 'Переменные и типы данных', duration: 12 },
              { id: 'l3', order: 3, title: 'Строки и форматирование', duration: 10 },
            ],
          },
          {
            id: 'm2',
            order: 2,
            title: 'Условия, циклы и функции',
            description: 'Контроль потока и переиспользуемый код.',
            lessons: [
              { id: 'l4', order: 1, title: 'Условия и логика', duration: 12 },
              { id: 'l5', order: 2, title: 'Циклы и практические задачи', duration: 14 },
              { id: 'l6', order: 3, title: 'Функции и параметры', duration: 14 },
            ],
          },
          {
            id: 'm3',
            order: 3,
            title: 'Структуры данных и работа с файлами',
            description: 'Списки, словари, чтение/запись.',
            lessons: [
              { id: 'l7', order: 1, title: 'Списки и множества', duration: 12 },
              { id: 'l8', order: 2, title: 'Словари и паттерны', duration: 12 },
              { id: 'l9', order: 3, title: 'Файлы и исключения', duration: 14 },
            ],
          },
          {
            id: 'm4',
            order: 4,
            title: 'ООП и мини‑проект',
            description: 'Классы, объекты, практика.',
            lessons: [
              { id: 'l10', order: 1, title: 'Классы и методы', duration: 14 },
              { id: 'l11', order: 2, title: 'Практика ООП', duration: 16 },
              { id: 'l12', order: 3, title: 'Мини‑проект: консольный трекер', duration: 18 },
            ],
          },
        ],
      instructor: course?.instructor || { name: 'FrameSchool Team', avatar: null },
      reviews: [],
    }
  }, [course])

  if (isLoading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-[#F7F8FA] pt-20">
        <section className="relative h-[260px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/18 via-accent-600/12 to-secondary-600/14" />
          <div className="absolute inset-0 bg-white/75" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#F7F8FA]" />
          <div className="container-wrapper relative h-full">
            <div className="max-w-[1200px] mx-auto px-6 h-full flex items-end pb-6 md:pb-8">
              <div className="w-full">
                <div className="flex gap-2">
                  <div className="h-8 w-28 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-8 w-24 rounded-full bg-slate-200 animate-pulse" />
                </div>
                <div className="mt-4 h-12 w-[min(720px,100%)] rounded-xl bg-slate-200 animate-pulse" />
                <div className="mt-3 h-6 w-[min(760px,95%)] rounded-lg bg-slate-200 animate-pulse" />
                <div className="mt-6 flex gap-3">
                  <div className="h-11 w-44 rounded-xl bg-slate-200 animate-pulse" />
                  <div className="h-11 w-36 rounded-xl bg-slate-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-wrapper py-10">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[0, 1, 2].map((i) => (
                <Card key={i} variant="glass" hover={false} className="rounded-2xl p-6 md:p-7">
                  <div className="h-6 w-44 rounded-lg bg-slate-200 animate-pulse" />
                  <div className="mt-4 h-4 w-[92%] rounded bg-slate-200 animate-pulse" />
                  <div className="mt-2 h-4 w-[86%] rounded bg-slate-200 animate-pulse" />
                  <div className="mt-2 h-4 w-[76%] rounded bg-slate-200 animate-pulse" />
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card variant="glass" hover={false} className="rounded-2xl p-6 md:p-7">
                <div className="h-44 rounded-xl bg-slate-200 animate-pulse" />
                <div className="mt-6 h-10 w-32 rounded-lg bg-slate-200 animate-pulse" />
                <div className="mt-4 h-11 rounded-xl bg-slate-200 animate-pulse" />
                <div className="mt-3 h-11 rounded-xl bg-slate-200 animate-pulse" />
              </Card>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50 pt-20">
        <div className="container-wrapper py-12">
          <Card variant="glass" className="p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
            <Button variant="primary" onClick={() => router.push('/courses')}>
              Browse All Courses
            </Button>
          </Card>
        </div>
      </main>
    )
  }

  const progress = enrollment?.progress || 0
  const completedLessons = enrollment?.completedLessons || 0
  const totalLessons = (fallbackContent.modules || []).reduce((sum, module) => sum + (module.lessons?.length || 0), 0) || course.lessonsCount || 0
  const totalModules = (fallbackContent.modules || []).length || course.modules?.length || 0
  const discount = course.originalPrice && course.originalPrice > course.price ? (course.originalPrice - course.price) : 0

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-[#F7F8FA] pt-20">
      {/* Hero Section */}
      <section className="relative h-[260px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/18 via-accent-600/12 to-secondary-600/14" />
        <div className="absolute inset-0 bg-white/75" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#F7F8FA]" />

        <div className="container-wrapper relative h-full">
          <div className="max-w-[1200px] mx-auto px-6 h-full flex items-end pb-6 md:pb-8">
            <ScrollAnimation>
              <div className="w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="h-8 px-3 rounded-full bg-white/70 text-slate-700 border-app-border"
                  >
                    {course.category === 'ielts' ? 'IELTS' : course.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="h-8 px-3 rounded-full bg-white/70 text-slate-700 border-app-border"
                  >
                    Level: {course.level === COURSE_LEVELS.BEGINNER ? 'Beginner' :
                      course.level === COURSE_LEVELS.INTERMEDIATE ? 'Intermediate' : 'Advanced'}
                  </Badge>
                </div>

                <h1 className="mt-4 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
                  {course.title}
                </h1>
                <p className="mt-3 text-[18px] leading-[1.6] md:text-[20px] text-slate-600 max-w-[70ch]">
                  {course.shortDescription || course.description}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button
                    variant="primary"
                    className="h-11 rounded-xl sm:w-auto"
                    onClick={isEnrolled ? () => router.push(`/courses/${courseId}/learn`) : (course.price === 0 ? handleEnroll : handlePurchase)}
                  >
                    {isEnrolled ? (progress > 0 ? 'Continue course' : 'Start course') : (course.price === 0 ? 'Enroll / Start course' : 'Enroll now')}
                    <HiArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl sm:w-auto"
                    onClick={() => {
                      const el = document.getElementById('course-content')
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    Preview / Syllabus
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <div className="container-wrapper py-10 md:py-12">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Course Info */}
            <ScrollAnimation>
              <Card variant="glass" className="rounded-2xl p-6 md:p-7 bg-white">
                <h2 className="text-[18px] md:text-[20px] font-extrabold text-slate-900">Overview</h2>
                <div className="mt-4 space-y-3 text-[15px] leading-[1.7] text-slate-600">
                  <p>{fallbackContent.overview}</p>
                  <p>
                    Формат: ~{course.duration || 'self-paced'} • {totalLessons} lessons • {totalModules || 0} modules.
                  </p>
                </div>
              </Card>
            </ScrollAnimation>

            {/* What You'll Learn */}
            <ScrollAnimation delay={100}>
              <Card variant="glass" className="rounded-2xl p-6 md:p-7 bg-white">
                <h2 className="text-[18px] md:text-[20px] font-extrabold text-slate-900">What you’ll learn</h2>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(fallbackContent.learningOutcomes || []).slice(0, 6).map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3 text-[14px] leading-[1.6] text-slate-600">
                      <HiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </ScrollAnimation>

            {/* Course Content */}
            <ScrollAnimation delay={200}>
              <Card id="course-content" variant="glass" className="rounded-2xl p-6 md:p-7 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[18px] md:text-[20px] font-extrabold text-slate-900">Course content</h2>
                    <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">
                      {totalModules || 0} modules • {totalLessons} lessons • ~{course.duration || 'self-paced'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {(fallbackContent.modules || []).map((module, moduleIndex) => {
                    const isOpen = openModule === moduleIndex
                    const lessonsCount = module.lessons?.length || 0
                    return (
                      <div key={module.id || moduleIndex} className="rounded-xl border border-app-border bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenModule(isOpen ? -1 : moduleIndex)}
                          className="w-full text-left px-4 py-4 md:px-5 md:py-4 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="text-[14px] font-semibold text-slate-900 break-words">
                                Module {module.order || moduleIndex + 1}: {module.title}
                              </div>
                              {module.description && (
                                <div className="mt-1 text-[13px] leading-[1.5] text-slate-500 break-words">{module.description}</div>
                              )}
                              <div className="mt-2 text-[12px] text-slate-500">
                                {lessonsCount} lessons
                              </div>
                            </div>
                            <HiChevronDown className={`w-5 h-5 text-slate-400 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-app-border">
                            {(module.lessons || []).map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id || lessonIndex}
                                className="px-4 py-3 md:px-5 flex items-center justify-between gap-4 border-b border-app-border last:border-b-0"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {isEnrolled ? (
                                    <HiPlay className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                  ) : (
                                    <HiLockClosed className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                  )}
                                  <span className="text-[14px] text-slate-700 break-words">
                                    {lesson.order || lessonIndex + 1}. {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[12px] text-slate-500 flex-shrink-0">
                                  {lesson.duration && (
                                    <span className="flex items-center gap-1">
                                      <HiClock className="w-4 h-4" />
                                      {lesson.duration} min
                                    </span>
                                  )}
                                  {lesson.isCompleted && (
                                    <HiCheckCircle className="w-5 h-5 text-success-600" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            </ScrollAnimation>

            {/* Requirements */}
            <ScrollAnimation delay={300}>
              <Card variant="glass" className="rounded-2xl p-6 md:p-7 bg-white">
                <h2 className="text-[18px] md:text-[20px] font-extrabold text-slate-900">Requirements</h2>
                <ul className="mt-4 space-y-2">
                  {(fallbackContent.requirements || []).map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-[14px] leading-[1.6] text-slate-600">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </ScrollAnimation>

            {/* Instructor */}
            <ScrollAnimation delay={400}>
              <Card variant="glass" className="rounded-2xl p-6 md:p-7 bg-white">
                <h2 className="text-[18px] md:text-[20px] font-extrabold text-slate-900">Instructor</h2>
                <div className="mt-4 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 border border-app-border shadow-card flex items-center justify-center overflow-hidden">
                    {fallbackContent.instructor?.avatar ? (
                      <img src={fallbackContent.instructor.avatar} alt={fallbackContent.instructor?.name || 'Instructor'} className="w-full h-full object-cover" />
                    ) : (
                      <HiUserGroup className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-slate-900 break-words">
                      {fallbackContent.instructor?.name || 'Instructor'}
                    </div>
                    <div className="mt-1 text-[13px] leading-[1.6] text-slate-600">
                      Практики, которые собирают курсы так, чтобы вы проходили путь от основы до уверенного применения.
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollAnimation>

            {/* Reviews */}
            <ScrollAnimation delay={500}>
              <Card id="reviews" variant="glass" className="rounded-2xl p-6 md:p-7 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[18px] md:text-[20px] font-extrabold text-slate-900">Reviews</h2>
                    <div className="mt-2 flex items-center gap-2 text-[14px] text-slate-600">
                      <HiStar className="w-4 h-4 text-primary-600" />
                      <span className="font-semibold text-slate-900">{course.rating?.toFixed(1) || '4.5'}</span>
                      <span className="text-slate-500">({course.reviewsCount || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-app-border bg-slate-50 px-4 py-4 text-[14px] leading-[1.6] text-slate-600">
                  Отзывы появятся здесь, когда студенты начнут проходить курс и оценивать уроки.
                </div>
              </Card>
            </ScrollAnimation>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <ScrollAnimation delay={100}>
              <Card variant="glass" className="rounded-2xl p-6 md:p-7 bg-white sticky top-6">
                {/* Course Thumbnail */}
                <div className="relative h-44 rounded-xl mb-6 overflow-hidden border border-app-border bg-slate-100">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiAcademicCap className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/20" />
                </div>

                {/* Price */}
                <div className="mb-6">
                  {course.price === 0 ? (
                    <div className="text-center">
                      <span className="text-[36px] leading-[40px] font-extrabold text-success-700">Free</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-3">
                        <span className="text-[40px] leading-[44px] font-extrabold text-slate-900">${course.price}</span>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-[14px] text-slate-500 line-through">${course.originalPrice}</span>
                        )}
                      </div>

                      {discount > 0 && (
                        <div className="mt-3 flex items-center justify-center">
                          <Badge
                            variant="success"
                            size="sm"
                            className="h-7 px-3 rounded-full bg-success-50 text-success-700 border-success-200"
                          >
                            Save ${discount}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full h-11 rounded-xl"
                    onClick={isEnrolled ? () => router.push(`/courses/${courseId}/learn`) : (course.price === 0 ? handleEnroll : handlePurchase)}
                  >
                    {isEnrolled ? (progress > 0 ? 'Continue learning' : 'Start learning') : 'Enroll now'}
                    <HiArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-11 rounded-xl"
                    onClick={() => {
                      const el = document.getElementById('course-content')
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    Try preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full h-11 rounded-xl"
                    onClick={() => {}}
                  >
                    <HiHeart className="w-5 h-5 mr-2" />
                    Add to wishlist
                  </Button>
                </div>

                {/* Course Stats */}
                <div className="mt-6 mb-6 pb-6 border-b border-app-border">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[13px]">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('reviews')
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className="col-span-2 flex items-center justify-between text-left hover:bg-slate-50 rounded-lg px-2 py-1 -mx-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                    >
                      <span className="text-slate-500 flex items-center gap-2">
                        <HiStar className="w-4 h-4 text-primary-600" />
                        Rating
                      </span>
                      <span className="font-semibold text-slate-900">
                        {course.rating?.toFixed(1) || '4.5'} <span className="text-slate-500 font-normal">({course.reviewsCount || 0})</span>
                      </span>
                    </button>

                    <div className="flex items-center justify-between col-span-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <HiClock className="w-4 h-4" />
                        Duration
                      </span>
                      <span className="font-semibold text-slate-900">~{course.duration || 'self-paced'}</span>
                    </div>
                    <div className="flex items-center justify-between col-span-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <HiBookOpen className="w-4 h-4" />
                        Lessons
                      </span>
                      <span className="font-semibold text-slate-900">{totalLessons} • {totalModules} modules</span>
                    </div>
                    <div className="flex items-center justify-between col-span-2">
                      <span className="text-slate-500 flex items-center gap-2">
                        <HiUserGroup className="w-4 h-4" />
                        Students
                      </span>
                      <span className="font-semibold text-slate-900">{course.studentsCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Certificate Info */}
                {course.certificateType && (
                  <div className="mb-6 pb-6 border-b border-app-border">
                    <div className="flex items-center gap-2 mb-2">
                      <HiShieldCheck className="w-5 h-5 text-primary-600" />
                      <span className="font-semibold text-slate-900">Certificate included</span>
                    </div>
                    <p className="text-[13px] leading-[1.6] text-slate-600">
                      {course.certificateType === CERTIFICATE_TYPES.PROFESSIONAL 
                        ? 'Professional certificate upon completion'
                        : course.certificateType === CERTIFICATE_TYPES.VERIFIED
                        ? 'Verified certificate available'
                        : 'Completion certificate included'}
                    </p>
                  </div>
                )}

                {/* What's included */}
                <div className="mb-6 pb-6 border-b border-app-border">
                  <div className="text-[13px] font-semibold text-slate-900 mb-3">What’s included</div>
                  <ul className="space-y-2">
                    {[
                      'Lifetime access',
                      'Certificate',
                      'Exercises & projects',
                      'Self‑paced learning',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] leading-[18px] text-slate-600">
                        <HiCheckCircle className="w-4 h-4 text-success-600 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress (if enrolled) */}
                {isEnrolled && enrollment && (
                  <div className="mb-6 pb-6 border-b border-app-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-900">Your Progress</span>
                      <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      {completedLessons} of {totalLessons} lessons completed
                    </p>
                  </div>
                )}

                {/* Money Back Guarantee */}
                <div className="mt-6 pt-6 border-t border-app-border">
                  <p className="text-xs text-center text-slate-600">
                    <HiShieldCheck className="w-4 h-4 inline mr-1 text-success-600" />
                    30-day money-back guarantee
                  </p>
                </div>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-app-border bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-[12px] text-slate-500">Enroll</div>
            <div className="text-[16px] font-extrabold text-slate-900">${course.price}</div>
          </div>
          <Button
            variant="primary"
            className="h-11 rounded-xl flex-1"
            onClick={isEnrolled ? () => router.push(`/courses/${courseId}/learn`) : (course.price === 0 ? handleEnroll : handlePurchase)}
          >
            {isEnrolled ? 'Continue' : 'Enroll now'}
          </Button>
        </div>
      </div>
    </main>
  )
}
