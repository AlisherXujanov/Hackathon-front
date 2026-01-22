'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import CertificateCard from '../../components/certificates/CertificateCard'
import Button from '../../components/Button'
import { 
  HiCheckCircle,
  HiShieldCheck,
  HiStar,
  HiDownload,
  HiShare
} from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'
import { certificateService } from '../../services/certificateService'
import { authService } from '../../services/api'

export default function CertificatesPage() {
  const router = useRouter()
  const [certificates, setCertificates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, completion, verified, professional

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return
    }
    loadCertificates()
  }, [router])

  const loadCertificates = async () => {
    setIsLoading(true)
    try {
      const data = await certificateService.getCertificates()
      setCertificates(data?.data || data || [])
    } catch (error) {
      console.error('Error loading certificates:', error)
      // For demo purposes, show sample certificates
      setCertificates([
        {
          id: 1,
          type: 'completion',
          courseTitle: 'IELTS Reading Mastery',
          description: 'Successfully completed the IELTS Reading Mastery course',
          issuedAt: new Date().toISOString(),
          certificateId: 'FRM-COMP-001',
          verificationUrl: '/certificates/verify/FRM-COMP-001',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCertificates = filter === 'all' 
    ? certificates 
    : certificates.filter(cert => cert.type === filter)

  const stats = {
    total: certificates.length,
    completion: certificates.filter(c => c.type === 'completion').length,
    verified: certificates.filter(c => c.type === 'verified').length,
    professional: certificates.filter(c => c.type === 'professional').length,
  }

  if (isLoading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading certificates...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 py-12 md:py-16">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="text-center text-white">
              <FaTrophy className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                My Certificates
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Showcase your achievements and share your certificates
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <div className="container-wrapper py-8 md:py-12">
        {/* Stats */}
        <ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card variant="glass" className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-3">
                <FaTrophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
              <p className="text-sm text-gray-600">Total Certificates</p>
            </Card>
            <Card variant="glass" className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center mx-auto mb-3">
                <HiCheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.completion}</h3>
              <p className="text-sm text-gray-600">Completion</p>
            </Card>
            <Card variant="glass" className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-3">
                <HiShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.verified}</h3>
              <p className="text-sm text-gray-600">Verified</p>
            </Card>
            <Card variant="glass" className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mx-auto mb-3">
                <HiStar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.professional}</h3>
              <p className="text-sm text-gray-600">Professional</p>
            </Card>
          </div>
        </ScrollAnimation>

        {/* Filter */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              {['all', 'completion', 'verified', 'professional'].map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </Card>
        </ScrollAnimation>

        {/* Certificates Grid */}
        {filteredCertificates.length === 0 ? (
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-12 text-center">
              <FaTrophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
              <p className="text-gray-600 mb-6">
                Complete courses to earn your first certificate!
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/courses')}
              >
                Browse Courses
              </Button>
            </Card>
          </ScrollAnimation>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate, index) => (
              <ScrollAnimation key={certificate.id} delay={index * 50}>
                <CertificateCard certificate={certificate} />
              </ScrollAnimation>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
