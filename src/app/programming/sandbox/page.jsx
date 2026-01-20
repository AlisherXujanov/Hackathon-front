'use client'

import { useState } from 'react'
import Card from '../../../components/Card'
import Select from '../../../components/Select'
import Button from '../../../components/Button'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiPlay, HiCode } from 'react-icons/hi'

export default function SandboxPage() {
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, World!");')
  const [output, setOutput] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
  ]

  const handleRun = () => {
    // TODO: Implement code execution
    setOutput('Code execution results will appear here...')
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Code Sandbox</h1>
            <p className="text-base md:text-lg text-gray-600">Write and test your code in a safe environment.</p>
          </div>
        </ScrollAnimation>
        
        {/* Language Selector and Run Button */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full sm:w-auto">
                <Select
                  id="language"
                  label="Language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  options={languages}
                />
              </div>
              <Button
                onClick={handleRun}
                variant="primary"
                leftIcon={<HiPlay />}
                className="w-full sm:w-auto"
              >
                Run Code
              </Button>
            </div>
          </Card>
        </ScrollAnimation>

        {/* Code Editor and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
                <HiCode className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Code Editor</h3>
              </div>
              <textarea
                className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none resize-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Write your code here..."
              />
            </Card>
          </ScrollAnimation>
          
          <ScrollAnimation delay={300}>
            <Card variant="glass" className="overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Output</h3>
              </div>
              <div className="p-4 h-96 bg-gray-900 text-green-400 font-mono text-sm overflow-auto">
                {output || <span className="text-gray-500">Output will appear here...</span>}
              </div>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
