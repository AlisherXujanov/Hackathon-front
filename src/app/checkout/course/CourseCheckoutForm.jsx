'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { 
  HiCheckCircle,
  HiShieldCheck,
  HiLockClosed,
  HiArrowLeft,
  HiSparkles
} from 'react-icons/hi'
import { courseService } from '../../../services/courseService'
import { getCourseById } from '../../../store/courses/courseData'
import { authService } from '../../../services/api'

export default function CourseCheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('course')
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [discount, setDiscount] = useState(null)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login?redirect=/checkout/course?course=' + courseId)
      return
    }
    loadCourse()
    checkDiscounts()
  }, [courseId, router])

  const loadCourse = async () => {
    setIsLoading(true)
    try {
      const data = await courseService.getCourse(courseId)
      const courseData = data?.data || data || getCourseById(courseId)
      setCourse(courseData)
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkDiscounts = () => {
    // Check for first course discount (50% off)
    const isFirstPurchase = !localStorage.getItem('has_purchased_course')
    if (isFirstPurchase) {
      setDiscount({
        type: 'first_course',
        percentage: 50,
        label: 'First Course Discount'
      })
    }
  }

  const calculatePrice = () => {
    if (!course) return 0
    let price = course.price || 0
    if (discount) {
      price = price * (1 - discount.percentage / 100)
    }
    return Math.round(price * 100) / 100
  }

  const handlePurchase = async () => {
    setIsProcessing(true)
    try {
      await courseService.purchaseCourse(courseId)
      localStorage.setItem('has_purchased_course', 'true')
      router.push(`/courses/${courseId}/learn?purchased=true`)
    } catch (error) {
      console.error('Error purchasing course:', error)
      // In a real app, you'd integrate with payment gateway here
      // For now, we'll just redirect to the course
      router.push(`/courses/${courseId}/learn?purchased=true`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading || !course) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading checkout...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const finalPrice = calculatePrice()
  const savings = course.price - finalPrice

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/courses/${courseId}`)}
            className="mb-6"
          >
            <HiArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <ScrollAnimation>
                <Card variant="glass" className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Complete Your Purchase
                  </h1>
                  <p className="text-gray-600">
                    You're about to purchase: <span className="font-semibold">{course.title}</span>
                  </p>
                </Card>
              </ScrollAnimation>

              {/* Course Summary */}
              <ScrollAnimation delay={100}>
                <Card variant="glass" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Summary</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{course.shortDescription || course.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{course.duration || 'N/A'}</span>
                          <span>•</span>
                          <span>{course.lessonsCount || 0} lessons</span>
                          {course.certificateType && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-primary-600">
                                <HiCheckCircle className="w-4 h-4" />
                                Certificate included
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </ScrollAnimation>

              {/* What's Included */}
              <ScrollAnimation delay={200}>
                <Card variant="glass" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Lifetime access to course content</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">All course materials and resources</span>
                    </li>
                    {course.certificateType && (
                      <li className="flex items-start gap-3">
                        <HiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          {course.certificateType === 'professional' 
                            ? 'Professional certificate upon completion'
                            : course.certificateType === 'verified'
                            ? 'Verified certificate available'
                            : 'Completion certificate included'}
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Access to course updates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">30-day money-back guarantee</span>
                    </li>
                  </ul>
                </Card>
              </ScrollAnimation>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <ScrollAnimation delay={100}>
                <Card variant="glass" className="p-6 sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Course Price</span>
                      <span className="font-semibold text-gray-900">${course.price}</span>
                    </div>
                    
                    {discount && (
                      <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg border border-success-200">
                        <div>
                          <span className="text-success-700 font-semibold text-sm">{discount.label}</span>
                          <p className="text-xs text-success-600">{discount.percentage}% off</p>
                        </div>
                        <span className="font-bold text-success-700">-${savings.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <div className="text-right">
                        {discount && (
                          <span className="text-sm text-gray-500 line-through mr-2">${course.price}</span>
                        )}
                        <span className="text-2xl font-bold text-gray-900">${finalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mb-4"
                    onClick={handlePurchase}
                    isLoading={isProcessing}
                  >
                    <HiLockClosed className="w-5 h-5 mr-2" />
                    Complete Purchase
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2 text-gray-600">
                      <HiShieldCheck className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <HiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span>Lifetime access included</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <HiSparkles className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span>Certificate included</span>
                    </div>
                  </div>
                </Card>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
