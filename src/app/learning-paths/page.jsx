'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import ScrollAnimation from '../../components/ScrollAnimation'
import { 
  HiStar, 
  HiClock, 
  HiUserGroup,
  HiCheckCircle,
  HiArrowRight,
  HiAcademicCap,
  HiShieldCheck
} from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'
import { courseService } from '../../services/courseService'
import { learningPaths } from '../../store/courses/courseData'

export default function LearningPathsPage() {
  const router = useRouter()
  const [paths, setPaths] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLearningPaths()
  }, [])

  const loadLearningPaths = async () => {
    setIsLoading(true)
    try {
      const data = await courseService.getLearningPaths()
      setPaths(data?.data || data || learningPaths)
    } catch (error) {
      console.warn('Using sample learning paths data:', error)
      setPaths(learningPaths)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-200">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/36 blur-3xl" />
          <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-accent-200/28 blur-3xl" />
          <div className="absolute -bottom-32 right-[18%] h-96 w-96 rounded-full bg-secondary-200/22 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(109,40,217,0.18),_transparent_60%)]" />
        </div>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/15 via-accent-600/10 to-secondary-600/15" />
          <div className="absolute inset-0 bg-white/70" />
          <div className="container-wrapper relative">
            <div className="max-w-[1200px] mx-auto px-0 py-14 md:py-20">
              <div className="text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gray-200 animate-pulse" />
                <div className="mx-auto h-10 md:h-14 w-[min(560px,90%)] rounded-lg bg-gray-200 animate-pulse" />
                <div className="mx-auto mt-4 h-6 w-[min(720px,92%)] rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        <div className="container-wrapper py-10 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {[0, 1].map((i) => (
              <Card key={i} variant="glass" hover={false} className="rounded-2xl p-6 md:p-8">
                <div className="h-6 w-36 rounded-lg bg-gray-200 animate-pulse" />
                <div className="mt-3 h-10 w-[80%] rounded-lg bg-gray-200 animate-pulse" />
                <div className="mt-3 h-5 w-[92%] rounded-lg bg-gray-200 animate-pulse" />
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="h-14 rounded-lg bg-gray-200 animate-pulse" />
                  ))}
                </div>
                <div className="mt-6 h-24 rounded-xl bg-gray-200 animate-pulse" />
                <div className="mt-6 h-11 rounded-button bg-gray-200 animate-pulse" />
              </Card>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-200">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/36 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-accent-200/28 blur-3xl" />
        <div className="absolute -bottom-32 right-[18%] h-96 w-96 rounded-full bg-secondary-200/22 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(109,40,217,0.18),_transparent_60%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/15 via-accent-600/10 to-secondary-600/15" />
        <div className="absolute inset-0 bg-white/70" />
        <div className="container-wrapper relative">
          <div className="max-w-[1200px] mx-auto px-0 py-14 md:py-20">
            <ScrollAnimation>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white border border-app-border shadow-card mx-auto">
                  <HiAcademicCap className="w-7 h-7 text-primary-600" />
                </div>
                <h1 className="mt-4 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
                  Пути обучения
                </h1>
                <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600 max-w-[60ch] mx-auto">
                  Структурированные программы для профессиональных сертификатов и карьерного роста.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <div className="container-wrapper py-10 md:py-12">
        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {paths.map((path, index) => (
            <ScrollAnimation key={path.id} delay={index * 100}>
              <Card variant="glass" className="rounded-2xl p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="primary"
                        size="sm"
                        className="bg-primary-50 text-primary-700 border-primary-200"
                      >
                        Профессиональный трек
                      </Badge>
                    </div>
                    <h2 className="mt-3 text-[28px] leading-[1.15] md:text-[32px] md:leading-[1.15] font-extrabold text-slate-900 break-words">
                      {path.title}
                    </h2>
                    <p className="mt-3 text-[15px] md:text-[16px] leading-[1.6] text-slate-600 max-w-[70ch]">
                      {path.description}
                    </p>
                  </div>
                </div>

                {/* Path Stats */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pb-6 border-b border-app-border">
                  <div>
                    <p className="text-[12px] leading-[18px] text-slate-500">Длительность</p>
                    <div className="mt-1 flex items-center gap-2">
                      <HiClock className="w-4 h-4 text-slate-400" />
                      <span className="text-[16px] font-semibold text-slate-900">{path.duration}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] leading-[18px] text-slate-500">Курсы</p>
                    <div className="mt-1 flex items-center gap-2">
                      <HiAcademicCap className="w-4 h-4 text-slate-400" />
                      <span className="text-[16px] font-semibold text-slate-900">{path.courses?.length || 0}</span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[12px] leading-[18px] text-slate-500">Студенты</p>
                    <div className="mt-1 flex items-center gap-2">
                      <HiUserGroup className="w-4 h-4 text-slate-400" />
                      <span className="text-[16px] font-semibold text-slate-900">{path.studentsCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Certificate */}
                {path.professionalCertificate && (
                  <div className="mt-6 rounded-xl border border-app-border bg-white p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center flex-shrink-0">
                          <FaTrophy className="w-5 h-5 text-primary-700" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 break-words">
                            {path.professionalCertificate.title}
                          </h3>
                          <p className="text-[13px] leading-[18px] text-slate-500 mt-1">
                            Доступен после завершения
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-[28px] leading-[32px] font-extrabold text-slate-900">
                          ${path.professionalCertificate.price}
                        </div>
                        <div className="text-[13px] leading-[18px] text-slate-500">
                          Включено в Plus
                        </div>
                      </div>
                    </div>

                    {path.professionalCertificate.requirements && (
                      <div className="mt-4 pt-4 border-t border-app-border">
                        <p className="text-[13px] font-semibold text-slate-700 mb-2">Требования</p>
                        <ul className="space-y-2">
                          {path.professionalCertificate.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[13px] leading-[18px] text-slate-600">
                              <HiCheckCircle className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Course List Preview */}
                {path.courses && path.courses.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-[13px] font-semibold text-slate-900 mb-3">Курсы в треке</h4>
                    <div className="space-y-2">
                      {path.courses.slice(0, 3).map((courseId, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <HiCheckCircle className="w-4 h-4 text-success-600" />
                          <span>Курс {idx + 1}</span>
                        </div>
                      ))}
                      {path.courses.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{path.courses.length - 3} ещё
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button
                    variant="primary"
                    className="sm:flex-1 rounded-xl"
                    onClick={() => router.push(`/learning-paths/${path.id}`)}
                  >
                    Смотреть программу
                    <HiArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Link
                    href={`/learning-paths/${path.id}`}
                    className="text-sm font-semibold text-primary-700 hover:text-primary-800 underline underline-offset-4"
                  >
                    Подробнее
                  </Link>
                </div>
              </Card>
            </ScrollAnimation>
          ))}
        </div>

        {/* Info Section */}
        <ScrollAnimation delay={paths.length * 100}>
          <Card variant="glass" className="rounded-2xl p-6 md:p-8 mt-8 bg-white">
            <div className="text-center">
              <HiShieldCheck className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Why Choose Learning Paths?
              </h3>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                Learning paths provide structured, comprehensive education that leads to professional certificates. 
                Each path combines multiple courses with assessments and projects to ensure you master the skills.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
                <div>
                  <HiCheckCircle className="w-6 h-6 text-success-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Structured Learning</h4>
                  <p className="text-sm text-gray-600">
                    Follow a carefully designed curriculum that builds skills progressively
                  </p>
                </div>
                <div>
                  <FaTrophy className="w-6 h-6 text-accent-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Professional Certificates</h4>
                  <p className="text-sm text-gray-600">
                    Earn recognized certificates that validate your expertise
                  </p>
                </div>
                <div>
                  <HiStar className="w-6 h-6 text-primary-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Career Ready</h4>
                  <p className="text-sm text-gray-600">
                    Gain job-ready skills that employers value and recognize
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </ScrollAnimation>
      </div>
    </main>
  )
}
