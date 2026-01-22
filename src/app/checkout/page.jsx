'use client'

import { Suspense } from 'react'
import CheckoutForm from './CheckoutForm'

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </main>
    }>
      <CheckoutForm />
    </Suspense>
  )
}
