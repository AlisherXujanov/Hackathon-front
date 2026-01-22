'use client'

import { useState } from 'react'
import Card from '../Card'
import Button from '../Button'
import Badge from '../Badge'
import { 
  HiDownload, 
  HiShare, 
  HiCheckCircle,
  HiShieldCheck,
  HiStar,
  HiExternalLink
} from 'react-icons/hi'
import { certificateService } from '../../services/certificateService'

export default function CertificateCard({ certificate, onDownload, onShare }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const getCertificateTypeIcon = (type) => {
    switch (type) {
      case 'verified':
        return HiShieldCheck
      case 'professional':
        return HiStar
      default:
        return HiCheckCircle
    }
  }

  const getCertificateTypeLabel = (type) => {
    switch (type) {
      case 'verified':
        return 'Verified Certificate'
      case 'professional':
        return 'Professional Certificate'
      default:
        return 'Completion Certificate'
    }
  }

  const getCertificateTypeColor = (type) => {
    switch (type) {
      case 'verified':
        return 'primary'
      case 'professional':
        return 'accent'
      default:
        return 'success'
    }
  }

  const handleDownload = async () => {
    if (onDownload) {
      onDownload(certificate)
      return
    }

    setIsDownloading(true)
    try {
      const blob = await certificateService.downloadCertificate(certificate.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${certificate.courseTitle || 'certificate'}-${certificate.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading certificate:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    if (onShare) {
      onShare(certificate)
      return
    }

    setIsSharing(true)
    try {
      // Share to LinkedIn
      const shareData = await certificateService.shareToLinkedIn(certificate.id)
      if (shareData.url) {
        window.open(shareData.url, '_blank')
      }
    } catch (error) {
      console.error('Error sharing certificate:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const CertificateIcon = getCertificateTypeIcon(certificate.type)

  return (
    <Card variant="glass" className="rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-12 h-12 rounded-xl border border-app-border bg-gradient-to-br ${
                certificate.type === 'professional'
                  ? 'from-accent-500 to-accent-600'
                  : certificate.type === 'verified'
                  ? 'from-primary-500 to-primary-600'
                  : 'from-success-500 to-success-600'
              } flex items-center justify-center shadow-card`}
            >
              <CertificateIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-[18px] leading-[1.25] font-extrabold text-slate-900">
                {certificate.courseTitle || certificate.title || 'Certificate'}
              </h3>
              <Badge variant={getCertificateTypeColor(certificate.type)} size="sm" className="mt-1">
                {getCertificateTypeLabel(certificate.type)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {certificate.description && (
        <p className="text-slate-600 text-[15px] leading-[1.55] mb-4">{certificate.description}</p>
      )}

      <div className="grid grid-cols-1 gap-1 text-[13px] text-slate-500 mb-4">
        <div>
          <span className="text-slate-500">Issued</span>
          <span className="text-slate-700 font-semibold">: {new Date(certificate.issuedAt || certificate.createdAt).toLocaleDateString()}</span>
        </div>
        {certificate.certificateId && (
          <div>
            <span className="text-slate-500">ID</span>
            <span className="text-slate-700 font-semibold">: {certificate.certificateId}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-app-border">
        <Button
          variant="primary"
          size="sm"
          onClick={handleDownload}
          isLoading={isDownloading}
          className="flex-1 rounded-xl"
        >
          <HiDownload className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          isLoading={isSharing}
          className="rounded-xl"
        >
          <HiShare className="w-4 h-4 mr-2" />
          Share
        </Button>
        {certificate.verificationUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(certificate.verificationUrl, '_blank')}
            className="rounded-xl"
          >
            <HiExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
