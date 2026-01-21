'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiX, 
  HiExclamationCircle, 
  HiXCircle,
  HiCheckCircle
} from 'react-icons/hi'
import Card from '../../../../../components/Card'

/**
 * WritingValidationErrorModal Component
 * Модальное окно для отображения ошибок валидации текста
 */
export default function WritingValidationErrorModal({ errorData, onClose }) {
  // Закрытие по Escape и управление body классом
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (errorData) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      document.body.classList.add('writing-modal-open')
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
      document.body.classList.remove('writing-modal-open')
    }
  }, [errorData, onClose])

  if (!errorData) return null

  // Анимации для модального окна
  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(8px)',
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      backdropFilter: 'blur(0px)',
      transition: { duration: 0.2 }
    }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05 + 0.3,
        duration: 0.3 
      }
    })
  }

  // Извлекаем данные валидации
  // Проверяем разные варианты структуры ответа
  const validation = errorData.error?.details?.validation || {}
  const fieldErrors = errorData.error?.details?.field_errors?.user_writing || {}
  
  // Приоритет: сначала validation, потом field_errors
  const reasons = validation.reasons || fieldErrors.reasons || []
  const overallScore = validation.overall_score || fieldErrors.overall_score || '0'
  const message = errorData.error?.message || 'Текст не прошел проверку качества'

  // Детали валидации - проверяем оба источника
  // validation.details содержит детали критериев
  const validationDetails = validation.details || fieldErrors.details || {}
  
  // Логирование для отладки
  console.log('WritingValidationErrorModal - errorData:', errorData)
  console.log('WritingValidationErrorModal - validation:', validation)
  console.log('WritingValidationErrorModal - fieldErrors:', fieldErrors)
  console.log('WritingValidationErrorModal - validationDetails:', validationDetails)
  console.log('WritingValidationErrorModal - reasons:', reasons)

  // Перевод названий критериев
  const getCriterionName = (key) => {
    const names = {
      'lexical_diversity': 'Лексическое разнообразие',
      'repetitions': 'Повторения',
      'structure': 'Структура текста',
      'spam_patterns': 'Спам-паттерны',
      'meaningfulness': 'Смысловое содержание'
    }
    return names[key] || key
  }

  // Получение иконки и цвета для статуса
  const getStatusIcon = (passed) => {
    if (passed === 'True' || passed === true) {
      return <HiCheckCircle className="w-5 h-5 text-green-600" />
    }
    return <HiXCircle className="w-5 h-5 text-red-600" />
  }

  const getStatusColor = (passed) => {
    if (passed === 'True' || passed === true) {
      return 'bg-green-50 border-green-200'
    }
    return 'bg-red-50 border-red-200'
  }

  return (
    <AnimatePresence>
      {errorData && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="w-full max-w-4xl max-h-[90vh] pointer-events-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card variant="glass" className="overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
                        <HiExclamationCircle className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Ошибка валидации текста
                      </h2>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Ваш текст не прошел проверку качества
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-4 flex-shrink-0"
                    aria-label="Закрыть"
                  >
                    <HiX className="w-7 h-7 text-gray-600 hover:text-gray-900" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                  {/* Overall Score */}
                  <motion.div
                    custom={0}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center shadow-lg"
                  >
                    <div className="text-sm font-medium opacity-90 mb-2">
                      Общая оценка качества текста
                    </div>
                    <div className="text-5xl md:text-6xl font-bold mb-1">
                      {parseFloat(overallScore).toFixed(2)}
                    </div>
                    <div className="text-lg opacity-90">
                      из 1.0 балла
                    </div>
                  </motion.div>

                  {/* Main Message */}
                  {message && (
                    <motion.div
                      custom={1}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-red-50 border-2 border-red-200 rounded-xl p-5"
                    >
                      <div className="flex items-start gap-3">
                        <HiExclamationCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-900 mb-2 text-lg">
                            Основная проблема
                          </h4>
                          <p className="text-red-800 text-base md:text-lg leading-relaxed">
                            {message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Reasons */}
                  {reasons.length > 0 && (
                    <motion.div
                      custom={2}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <HiExclamationCircle className="w-6 h-6 text-red-600" />
                        Причины отклонения ({reasons.length})
                      </h3>
                      <div className="space-y-3">
                        {reasons.map((reason, index) => (
                          <motion.div
                            key={index}
                            custom={index + 3}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <p className="text-base md:text-lg text-red-900 leading-relaxed flex-1">
                              {reason}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Validation Details */}
                  {Object.keys(validationDetails).length > 0 && (
                    <motion.div
                      custom={4}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <HiExclamationCircle className="w-6 h-6 text-orange-600" />
                        Детальная проверка критериев
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(validationDetails).map(([key, detail], index) => (
                          <motion.div
                            key={key}
                            custom={index + 5}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className={`border-2 rounded-xl p-4 ${getStatusColor(detail.passed)}`}
                          >
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(detail.passed)}
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  {getCriterionName(key)}
                                </h4>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  {detail.score || '0'}
                                </div>
                                <div className="text-xs text-gray-600">
                                  оценка
                                </div>
                              </div>
                            </div>
                            {detail.reason && detail.reason !== 'None' && (
                              <p className={`text-sm mt-2 leading-relaxed ${
                                detail.passed === 'True' || detail.passed === true 
                                  ? 'text-green-800' 
                                  : 'text-red-800'
                              }`}>
                                {detail.reason}
                              </p>
                            )}
                            {(!detail.reason || detail.reason === 'None') && (
                              <p className="text-sm mt-2 text-gray-600">
                                Критерий пройден
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Help Text */}
                  <motion.div
                    custom={10}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-blue-50 border border-blue-200 rounded-xl p-5"
                  >
                    <div className="flex items-start gap-3">
                      <HiExclamationCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2 text-lg">
                          Что нужно исправить?
                        </h4>
                        <ul className="text-blue-800 text-base space-y-2 list-disc list-inside">
                          <li>Увеличьте разнообразие используемых слов</li>
                          <li>Избегайте повторений одних и тех же слов и фраз</li>
                          <li>Используйте знаки препинания правильно</li>
                          <li>Напишите связный текст с несколькими предложениями</li>
                          <li>Убедитесь, что текст имеет смысл и относится к теме</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
