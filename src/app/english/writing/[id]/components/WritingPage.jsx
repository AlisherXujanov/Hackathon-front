'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Card from '../../../../../components/Card'
import Button from '../../../../../components/Button'
import Textarea from '../../../../../components/Textarea'
import { getMinWordsForLevel } from '../../../../../config/writingConfig'
import { HiCheckCircle, HiArrowLeft, HiSparkles } from 'react-icons/hi'
import apiClient from '../../../../../services/api'
import WritingResultsModal from './WritingResultsModal'
import WritingValidationErrorModal from './WritingValidationErrorModal'

export default function WritingPage({ writingExercise, level, id }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [validationError, setValidationError] = useState(null)
  const [isValidated, setIsValidated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [checkResults, setCheckResults] = useState(null)
  const [validationErrorData, setValidationErrorData] = useState(null)

  const minWords = useMemo(() => {
    return getMinWordsForLevel(level)
  }, [level])

  const wordCount = useMemo(() => {
    if (!text.trim()) return 0
    return text.trim().split(/\s+/).filter(w => w.trim()).length
  }, [text])

  const isMinWordsMet = wordCount >= minWords

  // Get vocabulary from writingExercise
  const vocabulary = useMemo(() => {
    if (!writingExercise?.relatedVocabulary) return []
    const vocab = writingExercise.relatedVocabulary
    const enVocab = vocab.en || {}
    const ruVocab = vocab.ru || {}
    
    return Object.keys(enVocab).map(key => ({
      en: key,
      ru: ruVocab[key] || key
    }))
  }, [writingExercise])

  const handleTextChange = (e) => {
    setText(e.target.value)
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null)
      setIsValidated(false)
    }
  }

  const handleCheck = async () => {
    if (wordCount < minWords) {
      const remaining = minWords - wordCount
      setValidationError(`Недостаточно слов. Осталось написать еще ${remaining} ${remaining === 1 ? 'слово' : remaining < 5 ? 'слова' : 'слов'}.`)
      setIsValidated(false)
      return
    }

    // Clear previous errors
    setValidationError(null)
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      // Проверяем наличие обязательных данных
      if (!writingExercise?.topic) {
        setSubmitError('Ошибка: тема упражнения не найдена')
        setIsSubmitting(false)
        return
      }
      
      if (!text || !text.trim()) {
        setSubmitError('Ошибка: текст эссе не может быть пустым')
        setIsSubmitting(false)
        return
      }
      
      // Подготавливаем данные для отправки
      // Пробуем разные варианты полей, которые может ожидать бэкенд
      const requestData = {
        writing_topic: writingExercise.topic,
        user_writing: text.trim(),
        // Добавляем дополнительные поля, если они есть
        ...(writingExercise.id && { writing_exercise_id: writingExercise.id }),
        ...(id && { exercise_id: parseInt(id) }),
        ...(level && { level: level.toUpperCase() })
      }
      
      // Логируем данные для отладки
      console.log('Отправка данных на backend:', {
        url: '/api/v1/ai/writing/submit/',
        data: requestData,
        writingExercise: {
          id: writingExercise.id,
          topic: writingExercise.topic
        },
        id,
        level,
        textLength: text.trim().length
      })
      
      // Отправляем данные на backend
      // Токен уже добавляется через interceptor в apiClient
      const response = await apiClient.post('/api/v1/ai/writing/submit/', requestData)

      // Логируем ответ от сервера для отладки
      console.log('Ответ от сервера:', response.data)

      // Проверяем успешность ответа
      if (response.data && response.data.success === false) {
        // Ошибка валидации текста
        console.log('Обнаружена ошибка валидации:', response.data)
        setValidationErrorData(response.data)
        setIsValidated(false)
        setSubmitError(null)
        setIsSubmitting(false)
        return
      } else if (response.data && response.data.success && response.data.data) {
        // Успешная проверка
        setIsValidated(true)
        setCheckResults(response.data)
        setValidationErrorData(null)
      }
      
    } catch (error) {
      // Обработка ошибок с детальной информацией
      console.error('Ошибка при отправке эссе:', error)
      console.error('Детали ошибки:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      })
      
      // Выводим полный ответ от сервера для отладки
      if (error.response?.data) {
        console.error('Полный ответ от сервера:', JSON.stringify(error.response.data, null, 2))
        
        // Если есть детали ошибки валидации, выводим их отдельно
        if (error.response.data.error?.details) {
          console.error('Детали ошибки валидации:', error.response.data.error.details)
        }
        if (error.response.data.error?.field_errors) {
          console.error('Ошибки полей:', error.response.data.error.field_errors)
        }
      }
      
      if (error.response?.data) {
        const errorData = error.response.data
        
        // Проверяем, не является ли это ошибкой валидации текста
        if (errorData.success === false && errorData.error?.code === 'text_validation_failed') {
          console.log('Обнаружена ошибка валидации в catch блоке:', errorData)
          setValidationErrorData(errorData)
          setIsValidated(false)
          setSubmitError(null)
          setIsSubmitting(false)
          return
        }
        
        // Пытаемся извлечь детальное сообщение об ошибке
        let errorMessage = 'Ошибка при отправке эссе. Попробуйте еще раз.'
        
        // Проверяем различные форматы ошибок от бэкенда
        if (errorData.error?.message) {
          errorMessage = errorData.error.message
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' 
            ? errorData.error 
            : JSON.stringify(errorData.error)
        } else if (typeof errorData === 'object') {
          // Если это объект с полями ошибок валидации (Django REST Framework формат)
          const validationErrors = Object.entries(errorData)
            .filter(([key]) => !['success', 'error'].includes(key))
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(', ')}`
              } else if (typeof value === 'object') {
                return `${key}: ${JSON.stringify(value)}`
              }
              return `${key}: ${value}`
            })
            .join('; ')
          
          if (validationErrors) {
            errorMessage = `Ошибка валидации данных: ${validationErrors}`
          } else {
            // Если не удалось извлечь понятное сообщение, показываем структурированную ошибку
            errorMessage = `Ошибка сервера (400). Проверьте консоль для деталей.`
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        }
        
        // Если это ошибка валидации полей, показываем более детальное сообщение
        if (error.response?.status === 400) {
          const fieldErrors = errorData.error?.details?.field_errors || errorData.error?.field_errors || {}
          if (Object.keys(fieldErrors).length > 0) {
            const fieldMessages = Object.entries(fieldErrors)
              .map(([field, errors]) => {
                if (Array.isArray(errors)) {
                  return `${field}: ${errors.join(', ')}`
                }
                return `${field}: ${JSON.stringify(errors)}`
              })
              .join('; ')
            errorMessage = `Ошибка валидации полей: ${fieldMessages}`
          }
        }
        
        setSubmitError(errorMessage)
      } else if (error.request) {
        setSubmitError('Ошибка сети. Проверьте подключение к интернету.')
      } else {
        setSubmitError('Произошла ошибка. Попробуйте еще раз.')
      }
      
      setIsValidated(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push('/english/writing')
  }

  if (!writingExercise) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="container-wrapper py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-600">Задание не найдено</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Fixed Header with Word Count */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm pt-16">
        <div className="container-wrapper">
          <div className="flex items-center justify-center h-16">
            <div className={`text-lg font-semibold ${
              isMinWordsMet ? 'text-success-600' : 'text-orange-600'
            }`}>
              {wordCount} слов / {minWords} минимум
            </div>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-8">
        <div className="w-full px-4 md:px-8 lg:px-12">
          {/* Action Buttons - At Top */}
          <div className="flex items-center justify-between mb-6 mt-3">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              <HiArrowLeft className="w-5 h-5 mr-2" />
              <span>Выйти из письма</span>
            </button>

              {/* Check Button */}
              <Button
                variant="accent"
                size="md"
                onClick={handleCheck}
                disabled={wordCount < minWords || isSubmitting}
                isLoading={isSubmitting}
                leftIcon={!isSubmitting && <HiSparkles className="w-5 h-5" />}
              >
                Проверить мое эссе
              </Button>
          </div>

          {/* Main Card */}
          <Card variant="glass" className="p-6 md:p-8">
              {/* Topic Header */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <h1 className="text-lg md:text-xl font-semibold text-gray-600 whitespace-nowrap">
                    Ваш ответ
                  </h1>
                  <div className="flex-1 text-center">
                    <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 leading-relaxed font-medium">
                      {writingExercise.topic}
                    </p>
                  </div>
                </div>
              </div>

              {/* Writing Textarea */}
              <div className="mb-6">
                <Textarea
                  placeholder="Начните писать здесь..."
                  value={text}
                  onChange={handleTextChange}
                  rows={15}
                  className="min-h-[300px] text-base border-dashed"
                  error={validationError && !isValidated ? validationError : submitError || null}
                />
              </div>

              {/* Useful Vocabulary Section */}
              {vocabulary.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Полезная лексика
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {vocabulary.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700"
                      >
                        <span className="font-semibold">{item.en}</span>
                        <span className="mx-2 text-purple-400">•</span>
                        <span>{item.ru}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements Section */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Требования: • Не менее {minWords} слов
                </p>
              </div>

              {/* Validation Message */}
              {isValidated && !validationError && !submitError && !checkResults && (
                <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-start">
                  <HiCheckCircle className="w-5 h-5 text-success-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-success-800 font-medium mb-1">
                      Отлично! Эссе отправлено на проверку.
                    </p>
                    <p className="text-success-700 text-sm">
                      Ваш текст успешно отправлен. Вы написали {wordCount} {wordCount === 1 ? 'слово' : wordCount < 5 ? 'слова' : 'слов'}.
                    </p>
                  </div>
                </div>
              )}
            </Card>
        </div>
      </div>

      {/* Results Modal */}
      <WritingResultsModal 
        results={checkResults} 
        onClose={() => setCheckResults(null)} 
      />

      {/* Validation Error Modal */}
      <WritingValidationErrorModal 
        errorData={validationErrorData} 
        onClose={() => setValidationErrorData(null)} 
      />
    </main>
  )
}
