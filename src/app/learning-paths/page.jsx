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
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading learning paths...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 py-12 md:py-16">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="text-center text-white">
              <HiAcademicCap className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Learning Paths
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Structured pathways to professional certificates and career advancement
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <div className="container-wrapper py-8 md:py-12">
        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {paths.map((path, index) => (
            <ScrollAnimation key={path.id} delay={index * 100}>
              <Card variant="glass" className="p-8 hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="accent" size="sm">
                        Professional Path
                      </Badge>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {path.title}
                    </h2>
                    <p className="text-gray-600">
                      {path.description}
                    </p>
                  </div>
                </div>

                {/* Path Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <div className="flex items-center gap-1">
                      <HiClock className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{path.duration}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Courses</p>
                    <div className="flex items-center gap-1">
                      <HiAcademicCap className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{path.courses?.length || 0}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Students</p>
                    <div className="flex items-center gap-1">
                      <HiUserGroup className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{path.studentsCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Certificate */}
                {path.professionalCertificate && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-accent-50 to-primary-50 rounded-lg border border-accent-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                        <FaTrophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {path.professionalCertificate.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Earn upon completion
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${path.professionalCertificate.price}
                        </p>
                        <p className="text-xs text-gray-600">or included in Plus</p>
                      </div>
                    </div>
                    {path.professionalCertificate.requirements && (
                      <div className="mt-3 pt-3 border-t border-accent-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Requirements:</p>
                        <ul className="space-y-1">
                          {path.professionalCertificate.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                              <HiCheckCircle className="w-3 h-3 text-accent-600 flex-shrink-0 mt-0.5" />
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
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Courses in this path:</h4>
                    <div className="space-y-2">
                      {path.courses.slice(0, 3).map((courseId, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <HiCheckCircle className="w-4 h-4 text-success-600" />
                          <span>Course {idx + 1}</span>
                        </div>
                      ))}
                      {path.courses.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{path.courses.length - 3} more courses
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => router.push(`/learning-paths/${path.id}`)}
                  >
                    View Path Details
                    <HiArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </ScrollAnimation>
          ))}
        </div>

        {/* Info Section */}
        <ScrollAnimation delay={paths.length * 100}>
          <Card variant="glass" className="p-8 mt-8 bg-gradient-to-r from-primary-50 to-accent-50">
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
