'use client'

import Card from '../../../components/Card'
import Badge from '../../../components/Badge'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiUsers, HiClipboardList, HiKey } from 'react-icons/hi'

export default function ClassDetailPage({ params }) {
  const students = [
    { id: 1, name: 'Student Name 1', progress: 75 },
    { id: 2, name: 'Student Name 2', progress: 90 },
    { id: 3, name: 'Student Name 3', progress: 60 },
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Class Details</h1>
            <p className="text-gray-600">Manage your class and track student progress</p>
          </div>
        </ScrollAnimation>
        
        {/* Class Information */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-6 md:p-8 mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Class Information</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">Class description and details...</p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary" className="flex items-center space-x-2">
                <HiKey className="w-4 h-4" />
                <span>Invite Code: ABC123</span>
              </Badge>
            </div>
          </Card>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students List */}
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-6">
                <HiUsers className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl md:text-2xl font-semibold">Students</h3>
              </div>
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{student.name}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{student.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </ScrollAnimation>
          
          {/* Activities */}
          <ScrollAnimation delay={300}>
            <Card variant="glass" className="p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-6">
                <HiClipboardList className="w-6 h-6 text-accent-600" />
                <h3 className="text-xl md:text-2xl font-semibold">Activities</h3>
              </div>
              <p className="text-gray-600">Recent class activities will be displayed here.</p>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
