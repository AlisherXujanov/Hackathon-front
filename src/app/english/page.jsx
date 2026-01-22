'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EnglishPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to grammar page by default
    router.replace('/english/grammar')
  }, [router])

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper pt-24 sm:pt-28 pb-8 md:pb-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    </main>
  )
}
