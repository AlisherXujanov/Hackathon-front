'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { HiMicrophone, HiPause, HiPlay, HiStop, HiRefresh } from 'react-icons/hi'
import Button from '../../Button'
import styles from './AudioRecorder.module.scss'

const RECORDING_STATES = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PAUSED: 'paused',
  PROCESSING: 'processing'
}

export default function AudioRecorder({ onRecordingComplete, disabled = false }) {
  const [state, setState] = useState(RECORDING_STATES.IDLE)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [error, setError] = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Start timer
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  }, [])

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [stopTimer])

  // Request microphone access and start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        setError('Ошибка записи аудио')
        setState(RECORDING_STATES.IDLE)
        stopTimer()
      }

      // Start recording
      mediaRecorder.start()
      setState(RECORDING_STATES.RECORDING)
      setRecordingTime(0)
      startTimer()
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Не удалось получить доступ к микрофону. Проверьте разрешения.')
      setState(RECORDING_STATES.IDLE)
    }
  }, [startTimer, stopTimer])

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === RECORDING_STATES.RECORDING) {
      mediaRecorderRef.current.pause()
      setState(RECORDING_STATES.PAUSED)
      stopTimer()
    }
  }, [state, stopTimer])

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === RECORDING_STATES.PAUSED) {
      mediaRecorderRef.current.resume()
      setState(RECORDING_STATES.RECORDING)
      startTimer()
    }
  }, [state, startTimer])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (state === RECORDING_STATES.RECORDING || state === RECORDING_STATES.PAUSED) {
        mediaRecorderRef.current.stop()
        setState(RECORDING_STATES.IDLE)
        stopTimer()
      }
    }
  }, [state, stopTimer])

  // Restart recording
  const restartRecording = useCallback(() => {
    stopRecording()
    setAudioBlob(null)
    setRecordingTime(0)
    setError(null)
    setTimeout(() => {
      startRecording()
    }, 100)
  }, [startRecording, stopRecording])

  // Handle recording complete
  useEffect(() => {
    if (audioBlob && state === RECORDING_STATES.IDLE && onRecordingComplete) {
      onRecordingComplete(audioBlob)
    }
  }, [audioBlob, state, onRecordingComplete])

  const isRecording = state === RECORDING_STATES.RECORDING
  const isPaused = state === RECORDING_STATES.PAUSED
  const hasRecording = audioBlob !== null

  return (
    <div className={styles.audioRecorder}>
      <div className={styles.controls}>
        {state === RECORDING_STATES.IDLE && !hasRecording && (
          <Button
            variant="primary"
            size="lg"
            onClick={startRecording}
            disabled={disabled}
            className={styles.recordButton}
          >
            <HiMicrophone className={styles.icon} />
            <span>Начать запись</span>
          </Button>
        )}

        {isRecording && (
          <>
            <Button
              variant="secondary"
              size="lg"
              onClick={pauseRecording}
              className={styles.controlButton}
            >
              <HiPause className={styles.icon} />
              <span>Пауза</span>
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={stopRecording}
              className={styles.controlButton}
            >
              <HiStop className={styles.icon} />
              <span>Остановить</span>
            </Button>
          </>
        )}

        {isPaused && (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={resumeRecording}
              className={styles.controlButton}
            >
              <HiPlay className={styles.icon} />
              <span>Продолжить</span>
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={stopRecording}
              className={styles.controlButton}
            >
              <HiStop className={styles.icon} />
              <span>Остановить</span>
            </Button>
          </>
        )}

        {hasRecording && state === RECORDING_STATES.IDLE && (
          <Button
            variant="secondary"
            size="lg"
            onClick={restartRecording}
            disabled={disabled}
            className={styles.controlButton}
          >
            <HiRefresh className={styles.icon} />
            <span>Записать заново</span>
          </Button>
        )}
      </div>

      {(isRecording || isPaused) && (
        <div className={styles.timer}>
          <div className={`${styles.indicator} ${isRecording ? styles.recording : ''}`}>
            <div className={styles.pulse} />
          </div>
          <span className={styles.time}>{formatTime(recordingTime)}</span>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  )
}
