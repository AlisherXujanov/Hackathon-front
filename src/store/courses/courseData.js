/**
 * Course Data Structure
 * This file contains the course structure and sample data
 * In production, this would come from the backend API
 */

import pythonFundamentalsThumbnail from '../../assets/images/courses/python-15-min-scaled.jpg'
import ieltsReadingMasteryThumbnail from '../../assets/images/courses/IELTS-Reading-Basic-.png'
import ieltsWritingThumbnail from '../../assets/images/courses/ielts-writing.png'

export const COURSE_CATEGORIES = {
  IELTS: 'ielts',
  PROGRAMMING: 'programming',
  WEB_DEV: 'web_dev',
  DATA_AI: 'data_ai',
  DEVOPS: 'devops',
  CYBERSECURITY: 'cybersecurity',
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
    thumbnail: ieltsReadingMasteryThumbnail.src,
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
    thumbnail: ieltsWritingThumbnail.src,
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
    thumbnail: pythonFundamentalsThumbnail.src,
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
  {
    id: 4,
    title: 'IELTS Speaking & Listening Sprint',
    slug: 'ielts-speaking-listening-sprint',
    description: 'Boost your IELTS Speaking and Listening with focused drills, mock tasks, and scoring tips.',
    shortDescription: 'Fast track for Speaking + Listening',
    category: COURSE_CATEGORIES.IELTS,
    level: COURSE_LEVELS.INTERMEDIATE,
    price: 19,
    originalPrice: 29,
    instructor: {
      id: 1,
      name: 'FrameSchool Team',
      avatar: null,
    },
    thumbnail: null,
    duration: '6 hours',
    lessonsCount: 14,
    studentsCount: 740,
    rating: 4.6,
    reviewsCount: 178,
    language: 'en',
    certificateType: CERTIFICATE_TYPES.COMPLETION,
    verifiedCertificateAvailable: true,
    verifiedCertificatePrice: 9,
    isPublished: true,
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
    modules: [
      {
        id: 1,
        title: 'Listening Boost',
        description: 'Strategies + practice blocks',
        order: 1,
        lessons: [
          { id: 401, title: 'Listening overview & traps', type: 'video', duration: 18, order: 1 },
          { id: 402, title: 'Section 1 drills', type: 'practice', duration: 22, order: 2 },
        ],
      },
      {
        id: 2,
        title: 'Speaking Sprint',
        description: 'Fluency, coherence, and pronunciation',
        order: 2,
        lessons: [
          { id: 403, title: 'Part 1: quick answers', type: 'practice', duration: 20, order: 1 },
          { id: 404, title: 'Part 2: story structure', type: 'video', duration: 16, order: 2 },
        ],
      },
    ],
    requirements: ['IELTS Band 5.0+ or equivalent'],
    learningOutcomes: ['Improve listening accuracy', 'Speak with better structure and fluency', 'Score higher with clear strategies'],
  },
  {
    id: 5,
    title: 'React Frontend Bootcamp',
    slug: 'react-frontend-bootcamp',
    description: 'Build modern UI with React: components, state, routing, forms, and best practices.',
    shortDescription: 'Practical React course with projects',
    category: COURSE_CATEGORIES.WEB_DEV,
    level: COURSE_LEVELS.BEGINNER,
    price: 0,
    originalPrice: 39,
    instructor: {
      id: 2,
      name: 'FrameSchool Team',
      avatar: null,
    },
    thumbnail: null,
    duration: '12 hours',
    lessonsCount: 24,
    studentsCount: 1320,
    rating: 4.8,
    reviewsCount: 310,
    language: 'en',
    certificateType: CERTIFICATE_TYPES.COMPLETION,
    verifiedCertificateAvailable: true,
    verifiedCertificatePrice: 12,
    isPublished: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-02',
    modules: [
      {
        id: 1,
        title: 'Core Concepts',
        description: 'Components, props, state',
        order: 1,
        lessons: [
          { id: 501, title: 'JSX and components', type: 'video', duration: 18, order: 1 },
          { id: 502, title: 'State and events', type: 'practice', duration: 25, order: 2 },
        ],
      },
      {
        id: 2,
        title: 'Projects',
        description: 'Mini-apps for portfolio',
        order: 2,
        lessons: [
          { id: 503, title: 'Todo app (UI)', type: 'project', duration: 35, order: 1 },
          { id: 504, title: 'Dashboard layout', type: 'project', duration: 30, order: 2 },
        ],
      },
    ],
    requirements: ['Basic JavaScript'],
    learningOutcomes: ['Build reusable UI', 'Work with forms and state', 'Ship a small project'],
  },
  {
    id: 6,
    title: 'Data Science with Python (Starter)',
    slug: 'data-science-python-starter',
    description: 'Intro to data analysis: NumPy/Pandas basics, charts, and simple ML intuition.',
    shortDescription: 'Data/AI starter track',
    category: COURSE_CATEGORIES.DATA_AI,
    level: COURSE_LEVELS.BEGINNER,
    price: 29,
    originalPrice: 49,
    instructor: {
      id: 2,
      name: 'FrameSchool Team',
      avatar: null,
    },
    thumbnail: pythonFundamentalsThumbnail.src,
    duration: '10 hours',
    lessonsCount: 20,
    studentsCount: 860,
    rating: 4.7,
    reviewsCount: 204,
    language: 'en',
    certificateType: CERTIFICATE_TYPES.COMPLETION,
    verifiedCertificateAvailable: true,
    verifiedCertificatePrice: 14,
    isPublished: true,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-06',
    modules: [
      {
        id: 1,
        title: 'Data Basics',
        description: 'Tables, cleaning, metrics',
        order: 1,
        lessons: [
          { id: 601, title: 'Pandas crash course', type: 'video', duration: 20, order: 1 },
          { id: 602, title: 'Cleaning & transforms', type: 'practice', duration: 28, order: 2 },
        ],
      },
      {
        id: 2,
        title: 'Visualization',
        description: 'Charts that tell story',
        order: 2,
        lessons: [
          { id: 603, title: 'Plotting basics', type: 'practice', duration: 22, order: 1 },
          { id: 604, title: 'Mini report (demo)', type: 'project', duration: 30, order: 2 },
        ],
      },
    ],
    requirements: ['Python basics (recommended)'],
    learningOutcomes: ['Read and transform datasets', 'Build simple visuals', 'Explain insights'],
  },
  {
    id: 7,
    title: 'Cybersecurity Fundamentals',
    slug: 'cybersecurity-fundamentals',
    description: 'Core security concepts: threats, auth, encryption basics, web risks, and incident mindset.',
    shortDescription: 'Start your cybersecurity journey',
    category: COURSE_CATEGORIES.CYBERSECURITY,
    level: COURSE_LEVELS.BEGINNER,
    price: 25,
    originalPrice: 45,
    instructor: {
      id: 3,
      name: 'FrameSchool Security Lab',
      avatar: null,
    },
    thumbnail: null,
    duration: '9 hours',
    lessonsCount: 18,
    studentsCount: 640,
    rating: 4.8,
    reviewsCount: 142,
    language: 'en',
    certificateType: CERTIFICATE_TYPES.COMPLETION,
    verifiedCertificateAvailable: true,
    verifiedCertificatePrice: 15,
    isPublished: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
    modules: [
      {
        id: 1,
        title: 'Security Basics',
        description: 'Threats, CIA triad, risk',
        order: 1,
        lessons: [
          { id: 701, title: 'Threat model in 15 minutes', type: 'video', duration: 15, order: 1 },
          { id: 702, title: 'Auth & sessions (demo)', type: 'video', duration: 18, order: 2 },
        ],
      },
      {
        id: 2,
        title: 'Web Risks',
        description: 'OWASP mindset',
        order: 2,
        lessons: [
          { id: 703, title: 'XSS & input validation', type: 'practice', duration: 22, order: 1 },
          { id: 704, title: 'CSRF & cookies', type: 'practice', duration: 20, order: 2 },
        ],
      },
    ],
    requirements: ['No prerequisites'],
    learningOutcomes: ['Understand basic security threats', 'Recognize common web risks', 'Describe practical mitigations'],
  },
  {
    id: 8,
    title: 'DevOps Starter: Docker & CI',
    slug: 'devops-starter-docker-ci',
    description: 'Containers, images, CI basics, and production mindset for modern teams.',
    shortDescription: 'Docker + CI pipeline basics',
    category: COURSE_CATEGORIES.DEVOPS,
    level: COURSE_LEVELS.BEGINNER,
    price: 29,
    originalPrice: 49,
    instructor: {
      id: 4,
      name: 'FrameSchool DevOps',
      avatar: null,
    },
    thumbnail: null,
    duration: '11 hours',
    lessonsCount: 22,
    studentsCount: 520,
    rating: 4.6,
    reviewsCount: 98,
    language: 'en',
    certificateType: CERTIFICATE_TYPES.COMPLETION,
    verifiedCertificateAvailable: true,
    verifiedCertificatePrice: 14,
    isPublished: true,
    createdAt: '2024-02-12',
    updatedAt: '2024-02-12',
    modules: [
      {
        id: 1,
        title: 'Docker Essentials',
        description: 'Images, containers, volumes',
        order: 1,
        lessons: [
          { id: 801, title: 'Docker in 20 minutes', type: 'video', duration: 20, order: 1 },
          { id: 802, title: 'Compose (demo stack)', type: 'practice', duration: 25, order: 2 },
        ],
      },
      {
        id: 2,
        title: 'CI Basics',
        description: 'Pipelines and checks',
        order: 2,
        lessons: [
          { id: 803, title: 'CI concepts', type: 'video', duration: 16, order: 1 },
          { id: 804, title: 'Build/test pipeline demo', type: 'project', duration: 28, order: 2 },
        ],
      },
    ],
    requirements: ['Basic command line'],
    learningOutcomes: ['Understand containers', 'Build simple CI pipeline', 'Ship with confidence'],
  },
  {
    id: 9,
    title: 'Web Security: OWASP Top 10 (Demo)',
    slug: 'web-security-owasp-top10',
    description: 'A tour through OWASP Top 10 with practical examples and remediation mindset.',
    shortDescription: 'OWASP Top 10 essentials',
    category: COURSE_CATEGORIES.CYBERSECURITY,
    level: COURSE_LEVELS.INTERMEDIATE,
    price: 35,
    originalPrice: 59,
    instructor: {
      id: 3,
      name: 'FrameSchool Security Lab',
      avatar: null,
    },
    thumbnail: null,
    duration: '13 hours',
    lessonsCount: 26,
    studentsCount: 410,
    rating: 4.9,
    reviewsCount: 120,
    language: 'en',
    certificateType: CERTIFICATE_TYPES.VERIFIED,
    verifiedCertificateAvailable: true,
    verifiedCertificatePrice: 19,
    isPublished: true,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
    modules: [
      {
        id: 1,
        title: 'Top risks',
        description: 'From A01 to A10',
        order: 1,
        lessons: [
          { id: 901, title: 'Broken access control', type: 'video', duration: 18, order: 1 },
          { id: 902, title: 'Injection & validation', type: 'video', duration: 20, order: 2 },
        ],
      },
      {
        id: 2,
        title: 'Defence',
        description: 'Patterns and checklists',
        order: 2,
        lessons: [
          { id: 903, title: 'Security headers & CSP', type: 'practice', duration: 22, order: 1 },
          { id: 904, title: 'Secure cookies & sessions', type: 'practice', duration: 18, order: 2 },
        ],
      },
    ],
    requirements: ['Basic web development'],
    learningOutcomes: ['Understand OWASP Top 10', 'Apply mitigation patterns', 'Write a short audit report'],
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
