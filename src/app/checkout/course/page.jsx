'use client'

import { Suspense } from 'react'
import CourseCheckoutForm from './CourseCheckoutForm'

export default function CourseCheckoutPage() {
  return (
    <Suspense fallback={
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading checkout...</p>
            </div>
          </div>
        </div>
      </main>
    }>
      <CourseCheckoutForm />
    </Suspense>
  )
}
