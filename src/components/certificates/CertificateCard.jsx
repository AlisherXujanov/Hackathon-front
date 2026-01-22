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
    <Card variant="glass" className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
              certificate.type === 'professional' 
                ? 'from-accent-500 to-accent-600' 
                : certificate.type === 'verified'
                ? 'from-primary-500 to-primary-600'
                : 'from-success-500 to-success-600'
            } flex items-center justify-center`}>
              <CertificateIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
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
        <p className="text-gray-600 text-sm mb-4">{certificate.description}</p>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Issued: {new Date(certificate.issuedAt || certificate.createdAt).toLocaleDateString()}</span>
        {certificate.certificateId && (
          <>
            <span>•</span>
            <span>ID: {certificate.certificateId}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <Button
          variant="primary"
          size="sm"
          onClick={handleDownload}
          isLoading={isDownloading}
          className="flex-1"
        >
          <HiDownload className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          isLoading={isSharing}
        >
          <HiShare className="w-4 h-4 mr-2" />
          Share
        </Button>
        {certificate.verificationUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(certificate.verificationUrl, '_blank')}
          >
            <HiExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
