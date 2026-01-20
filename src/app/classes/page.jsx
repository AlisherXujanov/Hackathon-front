'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import ScrollAnimation from '../../components/ScrollAnimation'
import { HiPlus, HiUsers, HiArrowRight, HiX } from 'react-icons/hi'

export default function ClassesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const classes = [
    {
      id: 1,
      name: 'Advanced English Grammar',
      description: 'Master complex grammar rules and improve your writing skills',
      students: 12,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      name: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming',
      students: 8,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      name: 'Business English',
      description: 'Professional communication and business writing',
      students: 15,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <ScrollAnimation>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">My Classes</h1>
              <p className="text-gray-600">Manage your classes and track student progress</p>
            </div>
          </ScrollAnimation>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            leftIcon={<HiPlus />}
          >
            Create Class
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem, index) => (
            <ScrollAnimation key={classItem.id} delay={index * 100}>
              <Link href={`/classes/${classItem.id}`}>
                <Card variant="glass" className="p-6 h-full group cursor-pointer">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${classItem.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <HiUsers className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {classItem.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {classItem.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <HiUsers className="w-4 h-4 mr-1" />
                      {classItem.students} students
                    </span>
                    <div className="flex items-center text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
                      View Class
                      <HiArrowRight className="ml-1 w-5 h-5" />
                    </div>
                  </div>
                </Card>
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        {/* Enhanced Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            
            {/* Modal */}
            <ScrollAnimation>
              <Card variant="glass" className="relative z-10 w-full max-w-md p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Create New Class</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>
                
                <form className="space-y-5">
                  <Input
                    id="className"
                    label="Class Name"
                    placeholder="Enter class name"
                    required
                  />
                  
                  <Textarea
                    id="description"
                    label="Description"
                    placeholder="Enter class description"
                    rows={4}
                    required
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                    >
                      Create Class
                    </Button>
                  </div>
                </form>
              </Card>
            </ScrollAnimation>
          </div>
        )}
      </div>
    </main>
  )
}
