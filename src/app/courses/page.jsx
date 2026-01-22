'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import ScrollAnimation from '../../components/ScrollAnimation'
import Select from '../../components/Select'
import Input from '../../components/Input'
import { 
  HiSearch, 
  HiStar, 
  HiClock, 
  HiUserGroup,
  HiFilter,
  HiBookOpen,
  HiCode,
  HiAcademicCap,
  HiSparkles,
  HiArrowRight,
  HiCheckCircle
} from 'react-icons/hi'
import { courseService } from '../../services/courseService'
import { sampleCourses, COURSE_CATEGORIES, COURSE_LEVELS } from '../../store/courses/courseData'
import FreeCourseBanner from '../../components/acquisition/FreeCourseBanner'
import styles from './Courses.module.scss'

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchQuery, selectedCategory, selectedLevel, priceRange, sortBy])

  const loadCourses = async () => {
    setIsLoading(true)
    try {
      // Try to fetch from API, fallback to sample data
      const data = await courseService.getCourses()
      setCourses(data?.data || data || sampleCourses)
    } catch (error) {
      // Fallback to sample data if API fails
      console.warn('Using sample course data:', error)
      setCourses(sampleCourses)
    } finally {
      setIsLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = [...courses]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.shortDescription?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    // Price filter
    if (priceRange !== 'all') {
      if (priceRange === 'free') {
        filtered = filtered.filter(course => course.price === 0)
      } else if (priceRange === 'under-20') {
        filtered = filtered.filter(course => course.price < 20)
      } else if (priceRange === '20-50') {
        filtered = filtered.filter(course => course.price >= 20 && course.price <= 50)
      } else if (priceRange === 'over-50') {
        filtered = filtered.filter(course => course.price > 50)
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.studentsCount || 0) - (a.studentsCount || 0)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        default:
          return 0
      }
    })

    setFilteredCourses(filtered)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case COURSE_CATEGORIES.IELTS:
        return HiAcademicCap
      case COURSE_CATEGORIES.PROGRAMMING:
        return HiCode
      case COURSE_CATEGORIES.BUSINESS_ENGLISH:
        return HiBookOpen
      default:
        return HiSparkles
    }
  }

  const getCategoryLabel = (category) => {
    switch (category) {
      case COURSE_CATEGORIES.IELTS:
        return 'IELTS'
      case COURSE_CATEGORIES.PROGRAMMING:
        return 'Programming'
      case COURSE_CATEGORIES.BUSINESS_ENGLISH:
        return 'Business English'
      default:
        return category
    }
  }

  const getLevelLabel = (level) => {
    switch (level) {
      case COURSE_LEVELS.BEGINNER:
        return 'Beginner'
      case COURSE_LEVELS.INTERMEDIATE:
        return 'Intermediate'
      case COURSE_LEVELS.ADVANCED:
        return 'Advanced'
      default:
        return level
    }
  }

  if (isLoading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Explore Our Courses
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Master new skills with expert-led courses and earn certificates
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <div className="container-wrapper py-8 md:py-12">
        {/* Free Course Banner */}
        <ScrollAnimation>
          <div className="mb-6">
            <FreeCourseBanner />
          </div>
        </ScrollAnimation>

        {/* Search and Filters */}
        <ScrollAnimation>
          <Card variant="glass" className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<HiSearch className="w-5 h-5" />}
                />
              </div>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: COURSE_CATEGORIES.IELTS, label: 'IELTS' },
                  { value: COURSE_CATEGORIES.PROGRAMMING, label: 'Programming' },
                  { value: COURSE_CATEGORIES.BUSINESS_ENGLISH, label: 'Business English' },
                ]}
              />
              <Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                options={[
                  { value: 'all', label: 'All Levels' },
                  { value: COURSE_LEVELS.BEGINNER, label: 'Beginner' },
                  { value: COURSE_LEVELS.INTERMEDIATE, label: 'Intermediate' },
                  { value: COURSE_LEVELS.ADVANCED, label: 'Advanced' },
                ]}
              />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'popular', label: 'Most Popular' },
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'newest', label: 'Newest' },
                ]}
              />
            </div>
          </Card>
        </ScrollAnimation>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <HiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCourses.map((course, index) => {
              const CategoryIcon = getCategoryIcon(course.category)
              return (
                <ScrollAnimation key={course.id} delay={index * 50}>
                  <Card 
                    variant="glass" 
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    {/* Course Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-500 to-accent-500 overflow-hidden">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CategoryIcon className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      {course.originalPrice && course.originalPrice > course.price && (
                        <Badge 
                          variant="success" 
                          className="absolute top-3 right-3"
                        >
                          {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CategoryIcon className="w-5 h-5 text-primary-600" />
                        <Badge variant="outline" size="sm">
                          {getCategoryLabel(course.category)}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {getLevelLabel(course.level)}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>

                      {/* Course Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <HiStar className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">{course.rating?.toFixed(1) || '4.5'}</span>
                          <span className="text-gray-500">({course.reviewsCount || 0})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiClock className="w-4 h-4" />
                          <span>{course.duration || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiUserGroup className="w-4 h-4" />
                          <span>{course.studentsCount || 0}</span>
                        </div>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          {course.price === 0 ? (
                            <span className="text-2xl font-bold text-success-600">Free</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                              {course.originalPrice && course.originalPrice > course.price && (
                                <span className="text-lg text-gray-500 line-through">
                                  ${course.originalPrice}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/courses/${course.id}`)
                          }}
                        >
                          View Course
                          <HiArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>

                      {/* Certificate Badge */}
                      {course.certificateType && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-primary-600">
                          <HiCheckCircle className="w-4 h-4" />
                          <span>Certificate included</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </ScrollAnimation>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
