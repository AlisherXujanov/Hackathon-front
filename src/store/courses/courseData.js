/**
 * Course Data Structure
 * This file contains the course structure and sample data
 * In production, this would come from the backend API
 */

export const COURSE_CATEGORIES = {
  IELTS: 'ielts',
  PROGRAMMING: 'programming',
  BUSINESS_ENGLISH: 'business_english',
  TECHNICAL_WRITING: 'technical_writing',
}

export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
}

export const CERTIFICATE_TYPES = {
  COMPLETION: 'completion',
  VERIFIED: 'verified',
  PROFESSIONAL: 'professional',
}

/**
 * Sample course structure
 * This will be replaced with actual API data
 */
export const sampleCourses = [
  {
    id: 1,
    title: 'IELTS Reading Mastery',
    slug: 'ielts-reading-mastery',
    description: 'Master IELTS Reading with comprehensive strategies, practice tests, and expert guidance to achieve Band 7+',
    shortDescription: 'Complete IELTS Reading preparation course',
    category: COURSE_CATEGORIES.IELTS,
    level: COURSE_LEVELS.INTERMEDIATE,
    price: 29,
    originalPrice: 39,
    instructor: {
      id: 1,
      name: 'FrameSchool Team',
      avatar: null,
    },
    thumbnail: '/assets/images/courses/ielts-reading.jpg',
    duration: '8 hours',
    lessonsCount: 22,
    studentsCount: 1250,
    rating: 4.8,
    reviewsCount: 342,
    language: 'en',
    certificateType: CERTIFICATE_TYPES.COMPLETION,
    verifiedCertificateAvailable: true,
    verifiedCertificatePrice: 14,
    isPublished: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    modules: [
      {
        id: 1,
        title: 'Reading Fundamentals',
        description: 'Learn the basics of IELTS Reading',
        order: 1,
        lessons: [
          {
            id: 1,
            title: 'Introduction to IELTS Reading',
            type: 'video',
            duration: 15,
            order: 1,
            isCompleted: false,
          },
          {
            id: 2,
            title: 'Reading Strategies Overview',
            type: 'video',
            duration: 20,
            order: 2,
            isCompleted: false,
          },
        ],
      },
      {
        id: 2,
        title: 'Question Types',
        description: 'Master all IELTS Reading question types',
        order: 2,
        lessons: [
          {
            id: 3,
            title: 'Multiple Choice Questions',
            type: 'video',
            duration: 25,
            order: 1,
            isCompleted: false,
          },
        ],
      },
    ],
    requirements: [
      'Basic English reading skills',
      'IELTS Band 5.0 or equivalent',
    ],
    learningOutcomes: [
      'Understand all IELTS Reading question types',
      'Apply effective reading strategies',
      'Achieve Band 7+ in Reading section',
    ],
  },
  {
    id: 2,
    title: 'IELTS Writing Task 1 & 2',
    slug: 'ielts-writing-complete',
    description: 'Master both IELTS Writing tasks with step-by-step guidance, model answers, and personalized feedback',
    shortDescription: 'Complete IELTS Writing preparation',
    category: COURSE_CATEGORIES.IELTS,
    level: COURSE_LEVELS.INTERMEDIATE,
    price: 29,
    originalPrice: 39,
    instructor: {
      id: 1,
      name: 'FrameSchool Team',
      avatar: null,
    },
    thumbnail: '/assets/images/courses/ielts-writing.jpg',
    duration: '10 hours',
    lessonsCount: 28,
    studentsCount: 980,
    rating: 4.7,
    reviewsCount: 256,
    language: 'en',
    certificateType: CERTIFICATE_TYPES.COMPLETION,
    verifiedCertificateAvailable: true,
    verifiedCertificatePrice: 14,
    isPublished: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    modules: [],
    requirements: [],
    learningOutcomes: [],
  },
  {
    id: 3,
    title: 'Python Fundamentals',
    slug: 'python-fundamentals',
    description: 'Learn Python programming from scratch with hands-on projects and real-world examples',
    shortDescription: 'Complete Python programming course for beginners',
    category: COURSE_CATEGORIES.PROGRAMMING,
    level: COURSE_LEVELS.BEGINNER,
    price: 39,
    originalPrice: 49,
    instructor: {
      id: 2,
      name: 'FrameSchool Team',
      avatar: null,
    },
    thumbnail: '/assets/images/courses/python.jpg',
    duration: '15 hours',
    lessonsCount: 35,
    studentsCount: 2100,
    rating: 4.9,
    reviewsCount: 512,
    language: 'en',
    certificateType: CERTIFICATE_TYPES.COMPLETION,
    verifiedCertificateAvailable: true,
    verifiedCertificatePrice: 19,
    isPublished: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15',
    modules: [],
    requirements: [],
    learningOutcomes: [],
  },
]

/**
 * Learning paths structure
 */
export const learningPaths = [
  {
    id: 1,
    title: 'IELTS Band 7+ Preparation',
    description: 'Complete preparation path for achieving IELTS Band 7+',
    slug: 'ielts-band-7-path',
    courses: [1, 2, 3, 4], // Course IDs
    professionalCertificate: {
      id: 1,
      title: 'IELTS Preparation Professional Certificate',
      price: 99,
      requirements: [
        'Complete all 4 courses',
        'Pass final comprehensive exam',
        'Achieve 70%+ in all assessments',
      ],
    },
    duration: '40 hours',
    studentsCount: 450,
    rating: 4.8,
    thumbnail: '/assets/images/paths/ielts-path.jpg',
  },
  {
    id: 2,
    title: 'Full-Stack Web Developer',
    description: 'Become a full-stack developer with HTML, CSS, JavaScript, and backend skills',
    slug: 'fullstack-developer-path',
    courses: [3, 5, 6, 7, 8], // Course IDs
    professionalCertificate: {
      id: 2,
      title: 'Full-Stack Web Developer Certificate',
      price: 149,
      requirements: [
        'Complete all 5 courses',
        'Pass comprehensive exam',
        'Submit capstone project',
      ],
    },
    duration: '60 hours',
    studentsCount: 320,
    rating: 4.7,
    thumbnail: '/assets/images/paths/fullstack-path.jpg',
  },
]

/**
 * Get course by ID (mock function - replace with API call)
 */
export const getCourseById = (courseId) => {
  return sampleCourses.find(course => course.id === parseInt(courseId))
}

/**
 * Get courses by category (mock function - replace with API call)
 */
export const getCoursesByCategory = (category) => {
  return sampleCourses.filter(course => course.category === category)
}

/**
 * Get learning path by ID (mock function - replace with API call)
 */
export const getLearningPathById = (pathId) => {
  return learningPaths.find(path => path.id === parseInt(pathId))
}

export default {
  sampleCourses,
  learningPaths,
  getCourseById,
  getCoursesByCategory,
  getLearningPathById,
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  CERTIFICATE_TYPES,
}
