'use client'

import { useState } from 'react'
import Card from '../Card'
import Button from '../Button'
import Input from '../Input'
import Badge from '../Badge'
import { HiUserGroup, HiClipboard, HiCheckCircle, HiSparkles } from 'react-icons/hi'

export default function ReferralProgram() {
  const [referralCode, setReferralCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [friendEmail, setFriendEmail] = useState('')

  // Generate referral code (in production, this would come from API)
  const userReferralCode = 'FRAME2024' // This would be fetched from user profile

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userReferralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendReferral = () => {
    // In production, this would send referral email via API
    alert('Referral email sent!')
    setFriendEmail('')
  }

  return (
    <Card variant="glass" className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <HiUserGroup className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Refer a Friend</h3>
          <p className="text-sm text-gray-600">Both get 1 month free Pro</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Your Referral Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Referral Code
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={userReferralCode}
              readOnly
              className="font-mono"
            />
            <Button
              variant={copied ? 'success' : 'outline'}
              size="md"
              onClick={handleCopyCode}
            >
              {copied ? (
                <>
                  <HiCheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <HiClipboard className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Send Referral */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send Referral to Friend
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="friend@example.com"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleSendReferral}
              disabled={!friendEmail}
            >
              Send
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <HiSparkles className="w-5 h-5 text-primary-600" />
            <span className="font-semibold text-gray-900">Benefits</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <HiCheckCircle className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
              <span>You get 1 month free Pro when they sign up</span>
            </li>
            <li className="flex items-start gap-2">
              <HiCheckCircle className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
              <span>Your friend gets 1 month free Pro</span>
            </li>
            <li className="flex items-start gap-2">
              <HiCheckCircle className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
              <span>Unlimited referrals</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
