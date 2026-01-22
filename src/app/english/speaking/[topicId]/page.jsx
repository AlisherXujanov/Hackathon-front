'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { HiHome, HiMicrophone } from 'react-icons/hi'
import Card from '../../../../components/Card'
import Button from '../../../../components/Button'
import Badge from '../../../../components/Badge'
import LoadingState from '../../../../components/english/LoadingState'
import ErrorState from '../../../../components/english/ErrorState'
import AudioRecorder from '../../../../components/english/speaking/AudioRecorder'
import PronunciationAnalysis from '../../../../components/english/speaking/PronunciationAnalysis'
import { loadSpeakingTopic } from '../../../../utils/english/speakingLoader'
import { speakingService } from '../../../../services/api'

export default function SpeakingTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params?.topicId

  const [topicData, setTopicData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [transcribedText, setTranscribedText] = useState(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionError, setTranscriptionError] = useState(null)

  // Load topic data
  useEffect(() => {
    async function loadData() {
      if (!topicId) {
        setError('Topic ID is required')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await loadSpeakingTopic(topicId)
        if (!data) {
          setError(`Topic "${topicId}" not found`)
          setLoading(false)
          return
        }

        setTopicData(data)
      } catch (err) {
        console.error('Error loading speaking topic:', err)
        setError(err.message || 'Failed to load topic data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [topicId])

  // Handle recording complete
  const handleRecordingComplete = useCallback(async (blob) => {
    setAudioBlob(blob)
    setTranscribedText(null)
    setTranscriptionError(null)
    setIsTranscribing(true)

    try {
      // Convert Blob to File for API
      const audioFile = new File([blob], 'recording.webm', { type: 'audio/webm' })
      
      // Send to API for transcription
      const result = await speakingService.transcribe(audioFile)
      
      // Extract text from response
      const text = result?.text || result?.data?.text || ''
      setTranscribedText(text)
    } catch (err) {
      console.error('Error transcribing audio:', err)
      setTranscriptionError(err.message || 'Ошибка при транскрибации аудио')
    } finally {
      setIsTranscribing(false)
    }
  }, [])

  // Get text to pronounce (modelAnswer.part2)
  const textToPronounce = topicData?.modelAnswer?.part2 || ''

  if (loading) {
    return <LoadingState message="Загрузка урока speaking..." />
  }

  if (error) {
    return (
      <div className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (!topicData) {
    return (
      <div className="container-wrapper pt-24 pb-10 sm:pt-28">
        <ErrorState message="Topic not found" />
      </div>
    )
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper pt-24 pb-10 sm:pt-28 md:pb-14">
        {/* Header */}
        <Card variant="glass" hover={false} className="mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/english/speaking')}
                  className="flex items-center gap-2"
                >
                  <HiHome className="w-4 h-4" />
                  <span>Назад</span>
                </Button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 justify-start md:justify-center mb-2">
                  <Badge variant="primary">{topicData.level}</Badge>
                  {topicData.estimatedTime && (
                    <Badge variant="gray">{topicData.estimatedTime}</Badge>
                  )}
                </div>
                <h1 className="text-[32px] leading-[40px] md:text-[44px] md:leading-[52px] font-bold text-gray-900 break-words text-left md:text-center">
                  {topicData.title}
                </h1>
                {topicData.part2?.topic && (
                  <p className="mt-2 typo-caption text-gray-500 text-left md:text-center">
                    {topicData.part2.topic}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <HiMicrophone className="w-6 h-6 text-pink-500" />
              </div>
            </div>
          </div>
        </Card>

        {/* Text to pronounce */}
        {textToPronounce ? (
          <Card variant="glass" className="mb-6">
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Прочитайте этот текст вслух
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Внимательно прочитайте текст ниже. После записи система сравнит ваше произношение с оригиналом.
              </p>
              <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200 rounded-lg shadow-sm">
                <p className="text-gray-900 leading-relaxed text-lg font-medium">
                  {textToPronounce}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card variant="glass" className="mb-6">
            <div className="p-4 md:p-6">
              <p className="text-gray-600 text-center">
                Текст для произношения не найден
              </p>
            </div>
          </Card>
        )}

        {/* Audio Recorder */}
        <Card variant="glass" className="mb-6">
          <div className="p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Запись вашего произношения
            </h2>
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={isTranscribing}
            />
            {isTranscribing && (
              <div className="mt-4 text-center">
                <p className="text-gray-600">Обработка аудио...</p>
              </div>
            )}
            {transcriptionError && (
              <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-error-700 text-sm">{transcriptionError}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Analysis Results */}
        {transcribedText && textToPronounce && (
          <PronunciationAnalysis
            originalText={textToPronounce}
            transcribedText={transcribedText}
          />
        )}
      </div>
    </main>
  )
}
