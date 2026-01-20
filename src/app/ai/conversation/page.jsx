'use client'

import { useState } from 'react'
import Card from '../../../components/Card'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiSparkles, HiPaperAirplane, HiUser } from 'react-icons/hi'

export default function AIConversationPage() {
  const [conversationType, setConversationType] = useState('writing')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const types = [
    { id: 'writing', label: 'Writing Assistant', color: 'primary' },
    { id: 'grammar', label: 'Grammar Helper', color: 'info' },
    { id: 'coding', label: 'Coding Assistant', color: 'accent' },
  ]

  const handleSend = () => {
    if (!input.trim()) return
    
    // TODO: Implement AI conversation logic
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <HiSparkles className="w-8 h-8 text-accent-600" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">AI Assistant</h1>
            </div>
            <p className="text-base md:text-lg text-gray-600">Get AI-powered help and personalized learning recommendations</p>
          </div>
        </ScrollAnimation>
        
        {/* Conversation Type Selector */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setConversationType(type.id)}
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-200
                    ${conversationType === type.id
                      ? `bg-${type.color}-600 text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </Card>
        </ScrollAnimation>

        {/* Chat Interface */}
        <ScrollAnimation delay={200}>
          <Card variant="glass" className="h-[600px] flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <HiSparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Start a conversation with the AI assistant</p>
                  <p className="text-sm mt-2">Ask questions, get help with writing, grammar, or coding</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                        <HiSparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`
                        max-w-xs lg:max-w-md px-4 py-3 rounded-2xl
                        ${msg.role === 'user'
                          ? 'bg-gradient-to-br from-primary-600 to-accent-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                        }
                      `}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <HiUser className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex space-x-3">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  variant="primary"
                  rightIcon={<HiPaperAirplane />}
                  disabled={!input.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </ScrollAnimation>
      </div>
    </main>
  )
}
