'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import ScrollAnimation from '../components/ScrollAnimation'
import { 
  HiAcademicCap, 
  HiCode, 
  HiBookOpen, 
  HiChartBar, 
  HiSparkles,
  HiCheckCircle,
  HiArrowRight,
  HiUsers,
  HiLightBulb
} from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'

export default function Home() {
  const [counters, setCounters] = useState({
    students: 0,
    courses: 0,
    success: 0,
  })

  useEffect(() => {
    const targets = { students: 10000, courses: 50, success: 95 }
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const timers = Object.keys(targets).map((key) => {
      const target = targets[key]
      const increment = target / steps
      let current = 0

      return setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
        }
        setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
      }, interval)
    })

    return () => timers.forEach(clearInterval)
  }, [])

  const features = [
    {
      icon: HiAcademicCap,
      title: 'Comprehensive Courses',
      description: 'Learn English and Programming with structured, expert-led courses.',
      color: 'primary',
    },
    {
      icon: HiCode,
      title: 'Interactive Coding',
      description: 'Practice programming with our built-in sandbox and real-time feedback.',
      color: 'secondary',
    },
    {
      icon: HiBookOpen,
      title: 'Personalized Learning',
      description: 'Adaptive content that adjusts to your learning pace and style.',
      color: 'accent',
    },
    {
      icon: HiChartBar,
      title: 'Track Progress',
      description: 'Monitor your growth with detailed analytics and insights.',
      color: 'info',
    },
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-accent-600/10 to-secondary-600/20 animate-pulse-slow" />
        
        {/* Floating Orbs Decoration */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="container-wrapper relative z-10 py-20 md:py-32">
          <ScrollAnimation>
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="accent" className="mb-6">
                Welcome to UnitSchool
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.1] mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600">
                  Learn. Practice. Excel.
                </span>
              </h1>
              
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
                Comprehensive learning platform for English and Programming. 
                Master new skills with interactive courses, real-time feedback, and personalized learning paths.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="primary" size="lg">
                  <Link href="/auth/register">
                    Get Started
                    <HiArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/dashboard">
                    Explore Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Success Rates Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Join a community of learners achieving their goals
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation delay={100}>
              <Card variant="stat" className="text-center p-8">
                <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 mb-2">
                  {counters.students.toLocaleString()}+
                </div>
                <div className="text-lg text-gray-600">Active Students</div>
              </Card>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <Card variant="stat" className="text-center p-8">
                <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-600 to-info-600 mb-2">
                  {counters.courses}+
                </div>
                <div className="text-lg text-gray-600">Courses Available</div>
              </Card>
            </ScrollAnimation>
            
            <ScrollAnimation delay={300}>
              <Card variant="stat" className="text-center p-8">
                <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-success-600 to-accent-600 mb-2">
                  {counters.success}%
                </div>
                <div className="text-lg text-gray-600">Success Rate</div>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                Why Choose UnitSchool?
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to succeed in your learning journey
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <ScrollAnimation key={feature.title} delay={index * 100}>
                  <Card variant="glass" className="p-6 md:p-8">
                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </ScrollAnimation>
              )
            })}
          </div>
        </div>
      </section>

      {/* Unique Education Section - Split Screen */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-wrapper">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation>
              <div>
                <Badge variant="primary" className="mb-4">Our Mission</Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
                  Empowering Learners Worldwide
                </h2>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                  We believe education should be accessible, engaging, and effective. 
                  Our platform combines cutting-edge technology with proven pedagogical methods 
                  to create an unparalleled learning experience.
                </p>
                <div className="space-y-4">
                  {[
                    'Interactive learning modules',
                    'Real-time progress tracking',
                    'Expert-led courses',
                    'Community support',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <HiCheckCircle className="w-6 h-6 text-success-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <Card variant="glass" className="p-8 md:p-12">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                      <HiUsers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Community Driven</div>
                      <div className="text-gray-600">Learn together, grow together</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary-600 to-info-600 flex items-center justify-center">
                      <FaTrophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Achievement System</div>
                      <div className="text-gray-600">Track your milestones</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-600 to-success-600 flex items-center justify-center">
                      <HiLightBulb className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">AI-Powered</div>
                      <div className="text-gray-600">Personalized learning paths</div>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Join thousands of students already learning and growing with UnitSchool
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="accent" size="lg">
                  <Link href="/auth/register">
                    Get Started Free
                    <HiArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                  <Link href="/auth/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </main>
  )
}
