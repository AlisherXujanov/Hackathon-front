'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
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
  HiAcademicCap
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

  if (isLoading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-12">
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

  if (error || !course) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
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
  const totalLessons = course.modules?.reduce((sum, module) => sum + (module.lessons?.length || 0), 0) || course.lessonsCount || 0

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 py-12 md:py-16">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="text-white">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {course.category === 'ielts' ? 'IELTS' : course.category}
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {course.level === COURSE_LEVELS.BEGINNER ? 'Beginner' : 
                   course.level === COURSE_LEVELS.INTERMEDIATE ? 'Intermediate' : 'Advanced'}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
                {course.description || course.shortDescription}
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <div className="container-wrapper py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Info */}
            <ScrollAnimation>
              <Card variant="glass" className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {course.description || course.shortDescription}
                  </p>
                </div>
              </Card>
            </ScrollAnimation>

            {/* What You'll Learn */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <ScrollAnimation delay={100}>
                <Card variant="glass" className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                  <ul className="space-y-3">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <HiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </ScrollAnimation>
            )}

            {/* Course Content */}
            {course.modules && course.modules.length > 0 && (
              <ScrollAnimation delay={200}>
                <Card variant="glass" className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
                  <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id || moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h3 className="font-semibold text-gray-900">
                            Module {module.order || moduleIndex + 1}: {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          )}
                        </div>
                        {module.lessons && module.lessons.length > 0 && (
                          <div className="divide-y divide-gray-200">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div 
                                key={lesson.id || lessonIndex} 
                                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-3">
                                  {isEnrolled ? (
                                    <HiPlay className="w-5 h-5 text-primary-600" />
                                  ) : (
                                    <HiLockClosed className="w-5 h-5 text-gray-400" />
                                  )}
                                  <span className="text-gray-700">
                                    {lesson.order || lessonIndex + 1}. {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
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
                    ))}
                  </div>
                </Card>
              </ScrollAnimation>
            )}

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <ScrollAnimation delay={300}>
                <Card variant="glass" className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-primary-600 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </ScrollAnimation>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ScrollAnimation delay={100}>
              <Card variant="glass" className="p-6 sticky top-8">
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg mb-6 overflow-hidden">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiAcademicCap className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  {course.price === 0 ? (
                    <div className="text-center">
                      <span className="text-4xl font-bold text-success-600">Free</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-gray-900">${course.price}</span>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-xl text-gray-500 line-through">
                            ${course.originalPrice}
                          </span>
                        )}
                      </div>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <p className="text-sm text-success-600 font-semibold">
                          Save ${course.originalPrice - course.price}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Course Stats */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <HiStar className="w-4 h-4 text-yellow-500" />
                      Rating
                    </span>
                    <span className="font-semibold text-gray-900">
                      {course.rating?.toFixed(1) || '4.5'} ({course.reviewsCount || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <HiClock className="w-4 h-4" />
                      Duration
                    </span>
                    <span className="font-semibold text-gray-900">{course.duration || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <HiBookOpen className="w-4 h-4" />
                      Lessons
                    </span>
                    <span className="font-semibold text-gray-900">{totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <HiUserGroup className="w-4 h-4" />
                      Students
                    </span>
                    <span className="font-semibold text-gray-900">{course.studentsCount || 0}</span>
                  </div>
                </div>

                {/* Certificate Info */}
                {course.certificateType && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <HiShieldCheck className="w-5 h-5 text-primary-600" />
                      <span className="font-semibold text-gray-900">Certificate Included</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {course.certificateType === CERTIFICATE_TYPES.PROFESSIONAL 
                        ? 'Professional certificate upon completion'
                        : course.certificateType === CERTIFICATE_TYPES.VERIFIED
                        ? 'Verified certificate available'
                        : 'Completion certificate included'}
                    </p>
                  </div>
                )}

                {/* Progress (if enrolled) */}
                {isEnrolled && enrollment && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Your Progress</span>
                      <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {completedLessons} of {totalLessons} lessons completed
                    </p>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-3">
                  {isEnrolled ? (
                    <>
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={() => router.push(`/courses/${courseId}/learn`)}
                      >
                        {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                        <HiArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={course.price === 0 ? handleEnroll : handlePurchase}
                      >
                        {course.price === 0 ? 'Enroll for Free' : `Purchase for $${course.price}`}
                      </Button>
                      {course.price > 0 && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full"
                          onClick={handleEnroll}
                        >
                          Try Free Trial
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Money Back Guarantee */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-center text-gray-600">
                    <HiShieldCheck className="w-4 h-4 inline mr-1 text-success-600" />
                    30-day money-back guarantee
                  </p>
                </div>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </main>
  )
}
