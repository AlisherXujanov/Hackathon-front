'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiX, 
  HiCheckCircle, 
  HiExclamationCircle, 
  HiLightBulb,
  HiSparkles,
  HiAcademicCap,
  HiPencil,
  HiBookOpen
} from 'react-icons/hi'
import Card from '../../../../../components/Card'

/**
 * WritingResultsModal Component
 * Красивое модальное окно с результатами проверки письма
 */
export default function WritingResultsModal({ results, onClose }) {
  // Закрытие по Escape и управление body классом
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (results) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      document.body.classList.add('writing-modal-open')
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
      document.body.classList.remove('writing-modal-open')
    }
  }, [results, onClose])

  if (!results) return null

  const { data } = results

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

  // Получение цвета для оценки
  const getScoreColor = (score) => {
    const numScore = parseFloat(score)
    if (numScore >= 8) return 'text-green-600 bg-green-50 border-green-200'
    if (numScore >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-orange-600 bg-orange-50 border-orange-200'
  }

  // Получение цвета для общей оценки
  const getOverallColor = (score) => {
    const numScore = parseFloat(score)
    if (numScore >= 8) return 'from-green-500 to-emerald-500'
    if (numScore >= 6) return 'from-yellow-500 to-orange-500'
    return 'from-orange-500 to-red-500'
  }

  return (
    <AnimatePresence>
      {results && (
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
                <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                        <HiSparkles className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Результаты проверки
                      </h2>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Ваше эссе проверено искусственным интеллектом
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
                    className={`bg-gradient-to-br ${getOverallColor(data.overall_score)} rounded-2xl p-6 text-white text-center shadow-lg`}
                  >
                    <div className="text-sm font-medium opacity-90 mb-2">
                      Общая оценка
                    </div>
                    <div className="text-5xl md:text-6xl font-bold mb-1">
                      {data.overall_score}
                    </div>
                    <div className="text-lg opacity-90">
                      из 10 баллов
                    </div>
                  </motion.div>

                  {/* Scores Grid */}
                  <motion.div
                    custom={1}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <HiAcademicCap className="w-6 h-6 text-purple-600" />
                      Оценки по критериям
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Грамматика', score: data.grammar_score, icon: HiBookOpen },
                        { label: 'Структура', score: data.structure_score, icon: HiPencil },
                        { label: 'Словарь', score: data.vocabulary_score, icon: HiAcademicCap },
                        { label: 'Креативность', score: data.creativity_score, icon: HiSparkles },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          custom={index + 2}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className={`p-4 rounded-xl border-2 ${getScoreColor(item.score)}`}
                        >
                          <item.icon className="w-5 h-5 mb-2" />
                          <div className="text-2xl font-bold mb-1">
                            {item.score}
                          </div>
                          <div className="text-xs font-medium opacity-80">
                            {item.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Feedback Text */}
                  {data.feedback_text && (
                    <motion.div
                      custom={3}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-blue-50 border border-blue-200 rounded-xl p-5"
                    >
                      <div className="flex items-start gap-3">
                        <HiLightBulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2 text-lg">
                            Общий отзыв
                          </h4>
                          <p className="text-blue-800 text-base md:text-lg leading-relaxed">
                            {data.feedback_text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Errors */}
                  {data.errors && data.errors.length > 0 && (
                    <motion.div
                      custom={4}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <HiExclamationCircle className="w-6 h-6 text-red-600" />
                        Найденные ошибки ({data.errors.length})
                      </h3>
                      <div className="space-y-3">
                        {data.errors.map((error, index) => (
                          <motion.div
                            key={index}
                            custom={index + 5}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-red-50 border border-red-200 rounded-lg p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                    {error.type}
                                  </span>
                                  {error.position && (
                                    <span className="text-xs text-gray-600">
                                      {error.position}
                                    </span>
                                  )}
                                </div>
                                <p className="text-base text-red-900 mb-1">
                                  <span className="font-medium">Ошибка:</span> {error.error}
                                </p>
                                {error.correction && (
                                  <p className="text-base text-green-800">
                                    <span className="font-medium">Правильно:</span> {error.correction}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Improvements */}
                  {data.improvements && data.improvements.length > 0 && (
                    <motion.div
                      custom={5}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <HiLightBulb className="w-6 h-6 text-yellow-600" />
                        Рекомендации по улучшению
                      </h3>
                      <div className="space-y-3">
                        {data.improvements.map((improvement, index) => (
                          <motion.div
                            key={index}
                            custom={index + 6}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex items-start gap-3"
                          >
                            <HiCheckCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-base md:text-lg text-yellow-900 leading-relaxed">
                              {improvement}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Tips */}
                  {data.tips && data.tips.length > 0 && (
                    <motion.div
                      custom={6}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <HiSparkles className="w-6 h-6 text-purple-600" />
                        Полезные советы
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {data.tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            custom={index + 7}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-purple-50 border border-purple-200 rounded-lg p-5"
                          >
                            <p className="text-base md:text-lg text-purple-900 leading-relaxed">
                              {tip}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
