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
    <main className="w-full overflow-x-hidden min-h-screen">
      {/* Hero Section - Professional Design */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-slate-50 via-white to-primary-50 overflow-x-hidden overflow-y-visible">
        {/* Main Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: 'url("/assets/images/home/image1.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
          {/* Overlay gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/70 via-white/60 to-primary-50/50" />
        </div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236D28D9' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-40 h-40 bg-primary-200/20 rounded-full blur-3xl animate-float" />
        

        <div className="relative container-wrapper py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-5 animate-fade-up">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mt-3">
                <span className="text-lg mr-2">🎓</span>
                <span>Premium Education Platform</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-snug">
                Your Gateway to
                <span className="block pb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600">
                  Digital Excellence
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Transform your learning journey with cutting-edge courses, interactive practice, and personalized AI-powered guidance. Join thousands of successful students worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild variant="primary" size="lg" className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg">
                  <Link href="/auth/register" className="flex items-center">
                    Start Learning Free
                    <HiArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="bg-white border-2 border-primary-200 text-primary-700 hover:bg-primary-50 px-8 py-4 text-lg">
                  <Link href="/dashboard">
                    Explore Courses
                  </Link>
                </Button>
              </div>
              
              <div className="inline-flex flex-wrap items-center gap-6 rounded-2xl border border-white/60 bg-white/70 px-6 py-4 shadow-lg shadow-primary-100/40 backdrop-blur">
                <div className="relative">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-600">10K+</div>
                  <div className="text-sm font-semibold text-gray-700">Active Students</div>
                </div>
                <div className="hidden h-10 w-px bg-gradient-to-b from-transparent via-primary-200 to-transparent md:block" />
                <div className="relative">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-600 to-accent-600">95%</div>
                  <div className="text-sm font-semibold text-gray-700">Success Rate</div>
                </div>
                <div className="hidden h-10 w-px bg-gradient-to-b from-transparent via-primary-200 to-transparent md:block" />
                <div className="relative">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-primary-600">50+</div>
                  <div className="text-sm font-semibold text-gray-700">Expert Courses</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Professional Image */}
            <div className="relative animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative z-10">
                {/* Overlay Cards */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <HiAcademicCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Expert Led</div>
                      <div className="text-sm text-gray-600">Professional Courses</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                      <HiUsers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Community</div>
                      <div className="text-sm text-gray-600">Learn Together</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-100 rounded-full opacity-60 animate-pulse-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* Success Rates Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: 'url("/assets/images/home/bacground5.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </div>
        
        <div className="relative container-wrapper">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Trusted by Thousands Worldwide
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join a thriving community of learners achieving their educational goals
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <ScrollAnimation>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform scale-95 group-hover:scale-100" />
                <div className="relative bg-white rounded-2xl shadow-md transition-all duration-300 ease-out p-7 text-center border border-gray-200/70 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div className="inline-block text-4xl md:text-5xl font-bold leading-tight pb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700 mb-3">
                    {counters.students.toLocaleString()}+
                  </div>
                  <div className="text-base font-semibold text-gray-800 mb-1">Active Students</div>
                  <div className="text-xs text-gray-500">Learning daily worldwide</div>
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform scale-95 group-hover:scale-100" />
                <div className="relative bg-white rounded-2xl shadow-md transition-all duration-300 ease-out p-7 text-center border border-gray-200/70 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div className="inline-block text-4xl md:text-5xl font-bold leading-tight pb-1 bg-clip-text text-transparent bg-gradient-to-r from-secondary-600 to-secondary-700 mb-3">
                    {counters.courses}+
                  </div>
                  <div className="text-base font-semibold text-gray-800 mb-1">Expert Courses</div>
                  <div className="text-xs text-gray-500">Comprehensive content</div>
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform scale-95 group-hover:scale-100" />
                <div className="relative bg-white rounded-2xl shadow-md transition-all duration-300 ease-out p-7 text-center border border-gray-200/70 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div className="inline-block text-4xl md:text-5xl font-bold leading-tight pb-1 bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-accent-700 mb-3">
                    {counters.success}%
                  </div>
                  <div className="text-base font-semibold text-gray-800 mb-1">Success Rate</div>
                  <div className="text-xs text-gray-500">Student achievements</div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background Pattern with SVG */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: 'url("/assets/images/home/bacground3.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </div>
        
        <div className="relative container-wrapper">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Why Choose UnitSchool?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to succeed in your educational journey
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <ScrollAnimation key={feature.title}>
                  <div className="group">
                    <div className="h-full bg-white rounded-2xl shadow-md transition-all duration-300 ease-out p-6 border border-gray-200/70 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-1 relative overflow-hidden">
                      {/* Background gradient on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${
                        feature.color === 'primary' ? 'from-primary-50 to-primary-100' :
                        feature.color === 'secondary' ? 'from-secondary-50 to-secondary-100' :
                        feature.color === 'accent' ? 'from-accent-50 to-accent-100' :
                        'from-info-50 to-info-100'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                          feature.color === 'primary' ? 'from-primary-500 to-primary-600' :
                          feature.color === 'secondary' ? 'from-secondary-500 to-secondary-600' :
                          feature.color === 'accent' ? 'from-accent-500 to-accent-600' :
                          'from-info-500 to-info-600'
                        } flex items-center justify-center mb-4 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-110`}>
                          <Icon className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-600 leading-relaxed text-sm mb-4">
                          {feature.description}
                        </p>
                        
                        <div className="flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
                          <span>Learn more</span>
                          <HiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              )
            })}
          </div>
        </div>
      </section>

      {/* Unique Education Section - Split Screen */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: 'url("/assets/images/home/background1.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </div>
        
        <div className="relative container-wrapper">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation>
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  🚀 Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Empowering Learners Worldwide
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We believe education should be accessible, engaging, and effective. Our platform combines cutting-edge technology with proven methods.
                </p>
                
                <div className="space-y-3">
                  {[
                    'Interactive learning modules',
                    'Real-time progress tracking', 
                    'Expert-led courses',
                    'Community support',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button asChild variant="primary" size="lg" className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
                  <Link href="/auth/register" className="inline-flex items-center gap-2">
                    <span>Start Learning Today</span>
                    <HiArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation>
              <div className="relative">
                <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 border border-gray-200/70">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 group">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                        <HiUsers className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">Community Driven</div>
                        <div className="text-gray-600">Learn together, grow together</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 group">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                        <FaTrophy className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">Achievement System</div>
                        <div className="text-gray-600">Track your milestones</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 group">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                        <HiLightBulb className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">AI-Powered</div>
                        <div className="text-gray-600">Personalized learning paths</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-100 rounded-full opacity-40 blur-xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-100 rounded-full opacity-40 blur-xl" />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* SVG Showcase Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: 'url("/assets/images/home/bacground3.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </div>
        
        <div className="relative container-wrapper">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Learning Made Simple
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform provides everything you need for successful learning
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ScrollAnimation>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(99,102,241,0.35)]">
                  <img src="/assets/images/home/smart.png" alt="Smart Learning" className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Learning</h3>
                <p className="text-gray-600">Adaptive technology that learns with you</p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(14,116,144,0.35)]">
                  <img src="/assets/images/home/Interactive Practice.png" alt="Interactive Practice" className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Practice</h3>
                <p className="text-gray-600">Hands-on experience with real feedback</p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(251,146,60,0.35)]">
                  <img src="/assets/images/home/Proven Success.png" alt="Proven Success" className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Proven Success</h3>
                <p className="text-gray-600">Track your progress and achievements</p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.22) 1px, transparent 1px)',
          backgroundSize: '26px 26px'
        }} />
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200/40 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent-200/50 rounded-full blur-2xl animate-float" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-secondary-200/50 rounded-full blur-xl animate-pulse-slow" />
        
        <div className="relative container-wrapper">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-primary-700 rounded-full text-base font-semibold mb-8 shadow-lg border border-primary-100 animate-pulse">
              <span className="text-xl leading-none mr-2">🎓</span>
              <span>Join Our Community</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Ready to Start Your
              <span className="block bg-clip-text pb-2 text-transparent bg-gradient-to-r from-primary-700 via-accent-600 to-secondary-700">Learning Journey?</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students already learning with UnitSchool's comprehensive educational platform and transform your future today
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="primary" size="lg" className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-xl px-8 py-4 text-lg font-semibold">
                <Link href="/auth/register" className="inline-flex items-center gap-2">
                  <span>Get Started Free</span>
                  <HiArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Button asChild variant="secondary" size="lg" className="bg-white/90 border-2 border-primary-200 text-primary-700 hover:bg-white shadow-lg px-8 py-4 text-lg font-semibold">
                <Link href="/auth/login" className="inline-flex items-center gap-2">
                  <HiUsers className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              </Button>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-600 text-sm">
                <div className="flex items-center">
                  <HiCheckCircle className="w-4 h-4 mr-2 text-success-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <HiCheckCircle className="w-4 h-4 mr-2 text-success-600" />
                  <span>Free forever plan available</span>
                </div>
                <div className="flex items-center">
                  <HiCheckCircle className="w-4 h-4 mr-2 text-success-600" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
