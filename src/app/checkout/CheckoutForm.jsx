'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'
import ScrollAnimation from '../../components/ScrollAnimation'
import { 
  HiLockClosed, 
  HiCreditCard,
  HiShieldCheck,
  HiArrowLeft,
  HiCheckCircle
} from 'react-icons/hi'
import checkoutTranslations from '../../locales/en/checkout.json'
import planTranslations from '../../locales/en/plan.json'
import styles from './Checkout.module.scss'

export default function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') || 'pro'
  const t = checkoutTranslations
  const planT = planTranslations

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    country: ''
  })

  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const plans = useMemo(() => ({
    pro: { name: planT.pro.name, price: planT.pro.price },
    plus: { name: planT.plus.name, price: planT.plus.price }
  }), [planT])

  const selectedPlan = plans[planId] || plans.pro

  useEffect(() => {
    if (planId && !plans[planId]) {
      router.push('/plan')
    }
  }, [planId, router, plans])

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3)
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = t.errors.cardNumber
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = t.errors.expiryDate
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = t.errors.cvv
    }

    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      newErrors.cardholderName = t.errors.cardholderName
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.errors.email
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/about?success=true')
      }, 3000)
    }, 2000)
  }

  if (isComplete) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30 flex items-center justify-center">
        <ScrollAnimation>
          <Card variant="glass" className="p-12 text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiCheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your subscription has been activated. Redirecting to about page...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </Card>
        </ScrollAnimation>
      </main>
    )
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container-wrapper py-12 md:py-20 relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <ScrollAnimation>
            <Link href="/plan" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors px-4 sm:px-0">
              <HiArrowLeft className="w-5 h-5 mr-2" />
              {t.actions.back}
            </Link>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main Form */}
            <div className="lg:col-span-7">
              <ScrollAnimation>
                <Card variant="glass" className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <HiLockClosed className="w-6 h-6 text-purple-600" />
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {t.title}
                    </h1>
                  </div>
                  <p className="text-gray-600 mb-8">{t.subtitle}</p>

                  <form onSubmit={handleSubmit}>
                    {/* Payment Method */}
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                        <HiCreditCard className="w-5 h-5 text-purple-600" />
                        {t.paymentMethod.title}
                      </h2>
                      
                      <div className="space-y-4">
                        <Input
                          label={t.paymentMethod.cardNumber}
                          placeholder={t.paymentMethod.cardNumberPlaceholder}
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          error={errors.cardNumber}
                          maxLength={19}
                          leftIcon={<HiCreditCard className="w-5 h-5" />}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label={t.paymentMethod.expiryDate}
                            placeholder={t.paymentMethod.expiryPlaceholder}
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            error={errors.expiryDate}
                            maxLength={5}
                          />
                          <Input
                            label={t.paymentMethod.cvv}
                            placeholder={t.paymentMethod.cvvPlaceholder}
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            error={errors.cvv}
                            maxLength={3}
                            type="password"
                          />
                        </div>

                        <Input
                          label={t.paymentMethod.cardholderName}
                          placeholder={t.paymentMethod.cardholderPlaceholder}
                          value={formData.cardholderName}
                          onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                          error={errors.cardholderName}
                        />
                      </div>
                    </div>

                    {/* Billing Information */}
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900">
                        {t.billingInfo.title}
                      </h2>
                      
                      <div className="space-y-4">
                        <Input
                          label={t.billingInfo.email}
                          placeholder={t.billingInfo.emailPlaceholder}
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          error={errors.email}
                        />
                        <Input
                          label={t.billingInfo.country}
                          placeholder={t.billingInfo.countryPlaceholder}
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                      <HiShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-900 mb-1">{t.security.title}</h3>
                        <p className="text-sm text-green-700">{t.security.description}</p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      isLoading={isProcessing}
                      disabled={isProcessing}
                    >
                      {isProcessing ? t.actions.processing : t.actions.complete}
                    </Button>
                  </form>
                </Card>
              </ScrollAnimation>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-5 flex flex-col">
              <ScrollAnimation delay={200}>
                <Card variant="glass" className={`${styles.summaryCard} p-6 md:p-8 lg:sticky lg:top-8`}>
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    {t.orderSummary.title}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">{t.orderSummary.plan}</span>
                      <span className="font-semibold text-gray-900">{selectedPlan.name}</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">{t.orderSummary.billing}</span>
                      <span className="text-gray-900">{t.orderSummary.monthly}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold text-gray-900">{t.orderSummary.total}</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {selectedPlan.price}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 text-center pt-2">
                      {t.orderSummary.tax}
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-purple-900">
                        <p className="font-semibold mb-1">What's included:</p>
                        <ul className="space-y-1 text-purple-700">
                          {planId === 'pro' && planT.pro.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-600">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                          {planId === 'plus' && planT.plus.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-600">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
