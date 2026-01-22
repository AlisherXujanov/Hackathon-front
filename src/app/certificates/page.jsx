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
      <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-200">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/36 blur-3xl" />
          <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-accent-200/28 blur-3xl" />
          <div className="absolute -bottom-32 right-[18%] h-96 w-96 rounded-full bg-secondary-200/22 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(109,40,217,0.18),_transparent_60%)]" />
        </div>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/15 via-accent-600/10 to-secondary-600/15" />
          <div className="absolute inset-0 bg-white/70" />
          <div className="container-wrapper relative">
            <div className="max-w-[1200px] mx-auto py-14 md:py-20">
              <div className="text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gray-200 animate-pulse" />
                <div className="mx-auto h-10 md:h-14 w-[min(560px,90%)] rounded-lg bg-gray-200 animate-pulse" />
                <div className="mx-auto mt-4 h-6 w-[min(720px,92%)] rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        <div className="container-wrapper py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <Card key={i} variant="glass" hover={false} className="rounded-2xl p-6 text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="mx-auto h-7 w-14 rounded-lg bg-gray-200 animate-pulse" />
                <div className="mx-auto mt-2 h-4 w-28 rounded-lg bg-gray-200 animate-pulse" />
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Card key={i} variant="glass" hover={false} className="rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="h-6 w-[70%] rounded-lg bg-gray-200 animate-pulse" />
                  <div className="mt-3 h-4 w-[92%] rounded-lg bg-gray-200 animate-pulse" />
                  <div className="mt-6 h-10 w-full rounded-button bg-gray-200 animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-200">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/36 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-accent-200/28 blur-3xl" />
        <div className="absolute -bottom-32 right-[18%] h-96 w-96 rounded-full bg-secondary-200/22 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(109,40,217,0.18),_transparent_60%)]" />
      </div>

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/15 via-accent-600/10 to-secondary-600/15" />
        <div className="absolute inset-0 bg-white/70" />
        <div className="container-wrapper relative">
          <div className="max-w-[1200px] mx-auto py-14 md:py-20">
            <ScrollAnimation>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white border border-app-border shadow-card mx-auto">
                  <FaTrophy className="w-7 h-7 text-primary-600" />
                </div>
                <h1 className="mt-4 text-[44px] leading-[1.12] md:text-[56px] md:leading-[1.12] font-extrabold text-slate-900">
                  My Certificates
                </h1>
                <p className="mt-4 text-[18px] leading-[1.6] md:text-[20px] text-slate-600 max-w-[60ch] mx-auto">
                  Showcase your achievements and share your certificates.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <div className="container-wrapper py-10 md:py-12">
        {/* Stats */}
        <ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card variant="glass" className="rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-3">
                <FaTrophy className="w-6 h-6 text-primary-700" />
              </div>
              <h3 className="text-[28px] leading-[32px] font-extrabold text-slate-900 mb-1">{stats.total}</h3>
              <p className="text-sm text-slate-600">Total certificates</p>
            </Card>
            <Card variant="glass" className="rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-success-50 border border-success-200 flex items-center justify-center mx-auto mb-3">
                <HiCheckCircle className="w-6 h-6 text-success-700" />
              </div>
              <h3 className="text-[28px] leading-[32px] font-extrabold text-slate-900 mb-1">{stats.completion}</h3>
              <p className="text-sm text-slate-600">Completion</p>
            </Card>
            <Card variant="glass" className="rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-3">
                <HiShieldCheck className="w-6 h-6 text-primary-700" />
              </div>
              <h3 className="text-[28px] leading-[32px] font-extrabold text-slate-900 mb-1">{stats.verified}</h3>
              <p className="text-sm text-slate-600">Verified</p>
            </Card>
            <Card variant="glass" className="rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent-50 border border-accent-200 flex items-center justify-center mx-auto mb-3">
                <HiStar className="w-6 h-6 text-accent-700" />
              </div>
              <h3 className="text-[28px] leading-[32px] font-extrabold text-slate-900 mb-1">{stats.professional}</h3>
              <p className="text-sm text-slate-600">Professional</p>
            </Card>
          </div>
        </ScrollAnimation>

        {/* Filter */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-700">Filter:</span>
              {['all', 'completion', 'verified', 'professional'].map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className={filter === type ? 'rounded-xl' : 'rounded-xl'}
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
            <Card variant="glass" className="rounded-2xl p-12 text-center">
              <FaTrophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No certificates yet</h3>
              <p className="text-slate-600 mb-6">
                Complete courses to earn your first certificate!
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/courses')}
                className="rounded-xl"
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
