'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '../../components/Card'
import Button from '../../components/Button'
import ScrollAnimation from '../../components/ScrollAnimation'
import { 
  HiCheck, 
  HiSparkles, 
  HiLightningBolt,
  HiShieldCheck,
  HiChartBar,
  HiUserGroup,
  HiLockClosed,
  HiStar,
  HiViewGrid,
  HiTable,
  HiBookOpen
} from 'react-icons/hi'
import planTranslations from '../../locales/en/plan.json'
import styles from './Plan.module.scss'

export default function PlanPage() {
  const router = useRouter()
  const [hoveredPlan, setHoveredPlan] = useState(null)
  const [viewMode, setViewMode] = useState('cards') // 'cards' or 'table'
  const [selectedFeature, setSelectedFeature] = useState(null)
  const t = planTranslations

  const plans = [
    {
      id: 'free',
      name: t.free.name,
      price: t.free.price,
      period: t.free.period,
      description: t.free.description,
      features: t.free.features,
      cta: t.free.cta,
      gradient: 'from-gray-400 to-gray-600',
      icon: HiLockClosed,
      popular: false,
      current: true
    },
    {
      id: 'pro',
      name: t.pro.name,
      price: t.pro.price,
      period: t.pro.period,
      description: t.pro.description,
      features: t.pro.features,
      cta: t.pro.cta,
      gradient: 'from-purple-500 to-pink-500',
      icon: HiLightningBolt,
      popular: true,
      popularLabel: t.pro.popular
    },
    {
      id: 'plus',
      name: t.plus.name,
      price: t.plus.price,
      period: t.plus.period,
      description: t.plus.description,
      features: t.plus.features,
      cta: t.plus.cta,
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      icon: HiStar,
      popular: true,
      popularLabel: t.plus.popular
    }
  ]

  const handleSelectPlan = (planId) => {
    if (planId === 'free') return
    router.push(`/checkout?plan=${planId}`)
  }

  // Scroll to selected feature when switching to table view
  useEffect(() => {
    if (viewMode === 'table' && selectedFeature) {
      setTimeout(() => {
        const element = document.querySelector(`[data-feature="${selectedFeature}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    }
  }, [viewMode, selectedFeature])

  // Comparison features data
  const comparisonFeatures = [
    {
      id: 'courses',
      name: t.compare.features.courses || 'Course Access',
      icon: HiBookOpen,
      free: '1 free/month',
      pro: '3 courses/month',
      plus: 'Unlimited',
      highlight: 'plus'
    },
    {
      id: 'certificates',
      name: t.compare.features.certificates || 'Certificates',
      icon: HiShieldCheck,
      free: 'None',
      pro: 'Completion',
      plus: 'All Types',
      highlight: 'plus'
    },
    {
      id: 'aiRequests',
      name: t.compare.features.aiRequests,
      icon: HiSparkles,
      free: 'Limited (5/day)',
      pro: 'Unlimited (basic)',
      plus: 'Unlimited (premium)',
      highlight: 'plus'
    },
    {
      id: 'aiModels',
      name: t.compare.features.aiModels,
      icon: HiShieldCheck,
      free: 'Basic Models',
      pro: 'Basic Models',
      plus: 'Premium Models',
      highlight: 'plus'
    },
    {
      id: 'analytics',
      name: t.compare.features.analytics,
      icon: HiChartBar,
      free: 'Basic Stats',
      pro: 'Advanced Analytics',
      plus: 'Premium Dashboard',
      highlight: 'plus'
    },
    {
      id: 'support',
      name: t.compare.features.support,
      icon: HiUserGroup,
      free: 'Community',
      pro: 'Priority Support',
      plus: '24/7 Priority',
      highlight: 'plus'
    }
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 relative">
      {/* Background decoration - simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-purple-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-pink-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-12 md:pb-20 relative z-10">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Choose Your Perfect Plan</span>
                <span className="xs:hidden">Plans</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent px-4">
              {t.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t.subtitle}
            </p>
          </div>
        </ScrollAnimation>

        {/* View Mode Toggle */}
        <ScrollAnimation delay={100}>
          <div className="flex justify-center mb-6 sm:mb-8 px-4">
            <div className="inline-flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl border border-gray-200 shadow-md sm:shadow-lg">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-sm sm:text-base font-medium transition-colors duration-150 flex items-center gap-1.5 sm:gap-2 ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HiViewGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-sm sm:text-base font-medium transition-colors duration-150 flex items-center gap-1.5 sm:gap-2 ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HiTable className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Compare</span>
              </button>
            </div>
          </div>
        </ScrollAnimation>

        {/* Plans Grid - Cards View */}
        {viewMode === 'cards' && (
          <div className={`${styles.plansGrid} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6`}>
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const isHovered = hoveredPlan === plan.id
              
              return (
                <ScrollAnimation key={plan.id} delay={index * 50}>
                  <div
                    className={`${styles.planWrapper} relative flex flex-col ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-20">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md flex items-center gap-1.5 sm:gap-2">
                          <HiStar className="w-3 h-3" />
                          <span className="whitespace-nowrap">{plan.popularLabel}</span>
                        </span>
                      </div>
                    )}
                    
                    <Card 
                      variant="glass" 
                      className={`${styles.planCard} ${plan.popular ? styles.popular : ''} ${isHovered ? styles.hovered : ''} flex flex-col relative overflow-hidden`}
                    >
                      <div className={`${styles.cardContent} relative z-10 flex flex-col flex-1`}>
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 sm:mb-6 shadow-md transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>

                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                          {plan.name}
                        </h3>
                        
                        <div className="mb-3 sm:mb-4">
                          <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{plan.price}</span>
                          <span className="text-sm sm:text-base text-gray-600 ml-2">{plan.period}</span>
                        </div>

                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 min-h-[2.5rem] sm:min-h-[3rem]">
                          {plan.description}
                        </p>

                        <ul className={`${styles.featuresList} flex-1 mb-6 sm:mb-8`}>
                          {plan.features.map((feature, idx) => (
                            <li 
                              key={idx} 
                              className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3"
                            >
                              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mt-0.5">
                                <HiCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                              </div>
                              <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto pt-3 sm:pt-4">
                          <Button
                            variant={plan.popular ? 'primary' : plan.current ? 'ghost' : 'secondary'}
                            size="md"
                            className="w-full text-sm sm:text-base"
                            onClick={() => handleSelectPlan(plan.id)}
                            disabled={plan.current}
                          >
                            {plan.cta}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ScrollAnimation>
              )
            })}
          </div>
        )}

        {/* Comparison Table View */}
        {viewMode === 'table' && (
          <ScrollAnimation delay={100}>
            <Card variant="glass" className="p-4 sm:p-6 md:p-8 mb-8 mx-4 sm:mx-0 overflow-x-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-900 px-2">
                {t.compare.title}
              </h2>
              <div className="min-w-full overflow-x-auto">
                <table className={`${styles.comparisonTable} w-full`}>
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-sm sm:text-base text-gray-900">Features</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className={`text-center py-3 sm:py-4 px-2 sm:px-4 font-bold text-sm sm:text-base ${plan.popular ? 'bg-gradient-to-b from-purple-50 to-pink-50' : ''}`}>
                          <div className="flex flex-col items-center gap-1 sm:gap-2">
                            <span className="text-base sm:text-lg">{plan.name}</span>
                            <span className="text-xs sm:text-sm text-gray-600 font-normal">{plan.price}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, idx) => {
                      const FeatureIcon = feature.icon
                      return (
                        <tr 
                          key={feature.id}
                          data-feature={feature.id}
                          className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedFeature === feature.id ? 'bg-purple-50 ring-1 ring-purple-200' : ''}`}
                          onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                        >
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <FeatureIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <span className="font-medium text-xs sm:text-sm md:text-base text-gray-900">{feature.name}</span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              {feature.free === 'Limited (10/day)' ? (
                                <span className="text-gray-500 text-xs sm:text-sm">{feature.free}</span>
                              ) : (
                                <span className="text-gray-700 text-xs sm:text-sm">{feature.free}</span>
                              )}
                            </div>
                          </td>
                          <td className={`py-3 sm:py-4 px-2 sm:px-4 text-center ${feature.highlight === 'pro' ? 'bg-purple-50' : ''}`}>
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <HiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700 font-medium text-xs sm:text-sm">{feature.pro}</span>
                            </div>
                          </td>
                          <td className={`py-3 sm:py-4 px-2 sm:px-4 text-center ${feature.highlight === 'plus' ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <HiStar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                              <span className="text-gray-900 font-semibold text-xs sm:text-sm">{feature.plus}</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td className="py-4 sm:py-6 px-2 sm:px-4"></td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="py-4 sm:py-6 px-2 sm:px-4 text-center">
                          <Button
                            variant={plan.popular ? 'primary' : plan.current ? 'ghost' : 'secondary'}
                            size="sm"
                            className="w-full text-xs sm:text-sm"
                            onClick={() => handleSelectPlan(plan.id)}
                            disabled={plan.current}
                          >
                            {plan.cta}
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </ScrollAnimation>
        )}

        {/* Additional Features Showcase */}
        {viewMode === 'cards' && (
          <ScrollAnimation delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6">
              {comparisonFeatures.slice(0, 3).map((feature, idx) => {
                const FeatureIcon = feature.icon
                return (
                  <Card 
                    key={feature.id} 
                    variant="glass" 
                    className="p-4 sm:p-6 text-center hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                    onClick={() => {
                      setViewMode('table')
                      setSelectedFeature(feature.id)
                      setTimeout(() => {
                        document.querySelector(`[data-feature="${feature.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }, 300)
                    }}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                      <FeatureIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900">{feature.name}</h3>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <span className="text-gray-500">Free:</span>
                        <span className="text-gray-700">{feature.free}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <HiCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                        <span className="text-purple-600 font-medium">Pro:</span>
                        <span className="text-gray-700">{feature.pro}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <HiStar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
                        <span className="text-orange-600 font-medium">Plus:</span>
                        <span className="text-gray-900 font-semibold">{feature.plus}</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </ScrollAnimation>
        )}

        {/* Trust Indicators */}
        <ScrollAnimation delay={viewMode === 'cards' ? 300 : 200}>
          <Card variant="glass" className="p-6 sm:p-8 md:p-12 bg-gradient-to-r from-purple-50/50 to-pink-50/50 mx-4 sm:mx-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <HiShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Secure Payment</h3>
                <p className="text-gray-600 text-xs sm:text-sm">256-bit SSL encryption</p>
              </div>
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <HiSparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Cancel Anytime</h3>
                <p className="text-gray-600 text-xs sm:text-sm">No long-term commitments</p>
              </div>
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <HiUserGroup className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">24/7 Support</h3>
                <p className="text-gray-600 text-xs sm:text-sm">We're here to help you</p>
              </div>
            </div>
          </Card>
        </ScrollAnimation>
      </div>
    </main>
  )
}
