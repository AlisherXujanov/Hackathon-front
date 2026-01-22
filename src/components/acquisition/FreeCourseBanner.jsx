'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '../Card'
import Button from '../Button'
import Badge from '../Badge'
import { HiSparkles, HiClock, HiArrowRight, HiX } from 'react-icons/hi'
import { courseService } from '../../services/courseService'

export default function FreeCourseBanner({ onClose }) {
  const router = useRouter()
  const [freeCourse, setFreeCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFreeCourse()
  }, [])

  const loadFreeCourse = async () => {
    setIsLoading(true)
    try {
      // In production, this would fetch the free course of the month from API
      const courses = await courseService.getCourses({ price: 0 })
      const coursesData = courses?.data || courses || []
      if (coursesData.length > 0) {
        setFreeCourse(coursesData[0])
      } else {
        // Fallback to sample free course
        setFreeCourse({
          id: 1,
          title: 'IELTS Reading Fundamentals',
          description: 'Learn the basics of IELTS Reading',
          slug: 'ielts-reading-fundamentals',
        })
      }
    } catch (error) {
      console.error('Error loading free course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !freeCourse) return null

  return (
    <Card variant="glass" className="p-6 bg-gradient-to-r from-primary-50 via-accent-50 to-primary-50 border-2 border-primary-200 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <HiX className="w-5 h-5" />
        </button>
      )}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <HiSparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Badge variant="success" size="sm">
              Free This Month
            </Badge>
            <Badge variant="outline" size="sm" className="flex items-center gap-1">
              <HiClock className="w-3 h-3" />
              Limited Time
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {freeCourse.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {freeCourse.description || 'Start learning for free this month only!'}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="primary"
            onClick={() => router.push(`/courses/${freeCourse.id}`)}
          >
            Enroll Free
            <HiArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
