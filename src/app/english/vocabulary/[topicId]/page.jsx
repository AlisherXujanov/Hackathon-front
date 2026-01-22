'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '../../../../components/Card'
import Button from '../../../../components/Button'
import Badge from '../../../../components/Badge'
import LoadingState from '../../../../components/english/LoadingState'
import ErrorState from '../../../../components/english/ErrorState'
import { loadVocabularyTopicData } from '../../../../utils/english/vocabularyLoader'
import { HiHome, HiCheckCircle, HiPencil, HiStar } from 'react-icons/hi'

const STORAGE_KEYS = {
  VOCAB_LANGUAGE: 'vocab_language'
}

function normalizeAnswer(value) {
  if (typeof value !== 'string') return ''
  return value
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:()\[\]"']/g, '')
    .replace(/\s+/g, ' ')
}

function getWordLabel(word) {
  return String(word || '').trim()
}

function getTopicProgressKey(topicId) {
  return `vocab_progress_${topicId}`
}

function pickRandom(items, count) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

function buildScenarioQuestions(topicTitle, words) {
  const wordList = words.map((w) => w.word)

  const scenarioTemplates = {
    name: {
      prompt: 'You are introducing yourself. Which word fits the blank?',
      sentence: 'My ___ is Alisher.'
    },
    age: {
      prompt: 'You are filling out a form. Which word is needed for how old you are?',
      sentence: 'My ___ is 25.'
    },
    address: {
      prompt: 'You are filling out a form. Which word is needed for where you live?',
      sentence: 'My ___ is 12 Main Street.'
    },
    nationality: {
      prompt: 'You are filling out a form. Which word is needed for the country you are from?',
      sentence: 'My ___ is Uzbek.'
    },
    country: {
      prompt: 'You are choosing your location in a form. Which word matches?',
      sentence: 'My ___ is Uzbekistan.'
    },
    city: {
      prompt: 'You are telling where you live. Which word fits?',
      sentence: 'I live in the ___.'
    },
    'phone number': {
      prompt: "You are filling out a form. Which word is needed for the field 'phone number'?",
      sentence: 'My ___ is +998 90 123 45 67.'
    }
  }

  const candidates = words
    .map((w) => w.word)
    .filter((w) => scenarioTemplates[normalizeAnswer(w)])

  const base = candidates.length > 0 ? candidates : wordList

  const questions = []
  const desired = Math.min(5, Math.max(3, base.length))

  for (let i = 0; i < desired; i++) {
    const correct = base[i % base.length]
    const key = normalizeAnswer(correct)
    const template = scenarioTemplates[key]

    const distractors = pickRandom(
      wordList.filter((w) => w !== correct),
      Math.min(3, Math.max(1, wordList.length - 1))
    )

    const options = pickRandom([correct, ...distractors], Math.min(4, 1 + distractors.length))

    questions.push({
      id: `sc_${i}_${key}`,
      title: topicTitle || 'Scenario',
      scenario: template?.prompt || 'Choose the best word for this situation.',
      text: template?.sentence || `Choose the correct word: ${correct}`,
      options,
      answer: correct
    })
  }

  return questions
}

function buildClozeQuestions(words) {
  const wordList = words.map((w) => w.word)

  const clozeTemplates = {
    name: {
      text: 'My ___ is Alisher.'
    },
    age: {
      text: 'My ___ is 25.'
    },
    address: {
      text: 'My ___ is 12 Main Street.'
    },
    nationality: {
      text: 'My ___ is Uzbek.'
    },
    country: {
      text: 'My ___ is Uzbekistan.'
    },
    city: {
      text: 'I live in ___.'
    },
    'phone number': {
      text: 'My ___ is +998 90 123 45 67.'
    }
  }

  const candidates = words
    .map((w) => w.word)
    .filter((w) => clozeTemplates[normalizeAnswer(w)])

  const base = candidates.length > 0 ? candidates : wordList

  const desired = Math.min(5, Math.max(3, base.length))

  const questions = []

  for (let i = 0; i < desired; i++) {
    const answer = base[i % base.length]
    const key = normalizeAnswer(answer)
    const template = clozeTemplates[key]

    const distractors = pickRandom(
      wordList.filter((w) => w !== answer),
      Math.min(3, Math.max(1, wordList.length - 1))
    )

    questions.push({
      id: `cl_${i}_${key}`,
      text: template?.text || `Type the missing word: ___ (${answer})`,
      answer,
      bank: pickRandom([answer, ...distractors], Math.min(4, 1 + distractors.length))
    })
  }

  return questions
}

function buildTask(topicTitle) {
  if ((topicTitle || '').toLowerCase().includes('personal')) {
    return {
      id: 'task_personal_info',
      title: 'Real-life Task (60 seconds)',
      instruction: 'Fill in 3 profile fields using English. Keep it short and real.',
      checklist: ['name', 'city', 'phone number'],
      template: 'My name is ___. I live in ___. My phone number is ___.',
      example: 'My name is Alisher. I live in Tashkent. My phone number is +998 90 123 45 67.'
    }
  }

  return {
    id: 'task_generic',
    title: 'Real-life Task (60 seconds)',
    instruction: 'Write 2-3 short sentences using today\'s words.',
    checklist: ['2 sentences', 'use today\'s words'],
    template: 'My ___ is ___. I live in ___.',
    example: 'My name is Alisher. I live in Tashkent.'
  }
}

export default function VocabularyTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params?.topicId

  const [language, setLanguage] = useState('ru')
  const [topicData, setTopicData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [stage, setStage] = useState('exposure')
  const [useItStep, setUseItStep] = useState('scenario')

  const [recallQueue, setRecallQueue] = useState([])
  const [recallIndex, setRecallIndex] = useState(0)
  const [recallInput, setRecallInput] = useState('')
  const [recallFeedback, setRecallFeedback] = useState(null)
  const [recallStats, setRecallStats] = useState({ attempts: 0, correct: 0 })

  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [scenarioCorrect, setScenarioCorrect] = useState(0)
  const [scenarioSuccessByWord, setScenarioSuccessByWord] = useState({})

  const [typingMode, setTypingMode] = useState(false)
  const [clozeIndex, setClozeIndex] = useState(0)
  const [clozeInput, setClozeInput] = useState('')
  const [clozeFeedback, setClozeFeedback] = useState(null)
  const [clozeCorrect, setClozeCorrect] = useState(0)
  const [productionSuccessByWord, setProductionSuccessByWord] = useState({})

  const [taskDone, setTaskDone] = useState(false)
  const [taskText, setTaskText] = useState('')

  const [hardWordIds, setHardWordIds] = useState([])

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.VOCAB_LANGUAGE)
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    if (language) localStorage.setItem(STORAGE_KEYS.VOCAB_LANGUAGE, language)
  }, [language])

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
        const data = await loadVocabularyTopicData(topicId)
        if (!data?.topic) {
          setError(`Topic "${topicId}" not found`)
          setLoading(false)
          return
        }

        setTopicData(data.topic)

        const words = data.topic.words || []
        const initialQueue = words.map((_, idx) => idx)
        setRecallQueue(initialQueue)
        setRecallIndex(0)

        const progressKey = getTopicProgressKey(topicId)
        const saved = localStorage.getItem(progressKey)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (parsed?.stage) setStage(parsed.stage)
            if (parsed?.useItStep) setUseItStep(parsed.useItStep)
            if (typeof parsed?.scenarioCorrect === 'number') setScenarioCorrect(parsed.scenarioCorrect)
            if (parsed?.scenarioSuccessByWord && typeof parsed.scenarioSuccessByWord === 'object') {
              setScenarioSuccessByWord(parsed.scenarioSuccessByWord)
            }
            if (typeof parsed?.clozeCorrect === 'number') setClozeCorrect(parsed.clozeCorrect)
            if (parsed?.productionSuccessByWord && typeof parsed.productionSuccessByWord === 'object') {
              setProductionSuccessByWord(parsed.productionSuccessByWord)
            }
            if (typeof parsed?.taskDone === 'boolean') setTaskDone(parsed.taskDone)
            if (typeof parsed?.taskText === 'string') setTaskText(parsed.taskText)
            if (parsed?.recallStats) setRecallStats(parsed.recallStats)
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Error loading vocabulary topic:', err)
        setError(err.message || 'Failed to load topic data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [topicId])

  const scenarioQuestions = useMemo(() => {
    if (!topicData?.words) return []
    return buildScenarioQuestions(topicData.topic, topicData.words)
  }, [topicData])

  const clozeQuestions = useMemo(() => {
    if (!topicData?.words) return []
    return buildClozeQuestions(topicData.words)
  }, [topicData])

  const task = useMemo(() => buildTask(topicData?.topic), [topicData])

  const coreWords = useMemo(() => {
    const words = topicData?.words || []
    return words.slice(0, Math.min(3, words.length)).map((w) => w.word)
  }, [topicData])

  const recallAccuracy = useMemo(() => {
    if (recallStats.attempts === 0) return 0
    return Math.round((recallStats.correct / recallStats.attempts) * 100)
  }, [recallStats])

  const mastery = useMemo(() => {
    const scenarioOk = coreWords.length === 0
      ? true
      : coreWords.every((w) => !!scenarioSuccessByWord[normalizeAnswer(w)])

    const productionOk = coreWords.length === 0
      ? true
      : coreWords.every((w) => !!productionSuccessByWord[normalizeAnswer(w)])

    return {
      recallOk: recallAccuracy >= 85,
      scenarioOk,
      productionOk,
      taskOk: taskDone
    }
  }, [recallAccuracy, coreWords, scenarioSuccessByWord, productionSuccessByWord, taskDone])

  const canFinish = mastery.recallOk && mastery.scenarioOk && mastery.productionOk && mastery.taskOk

  const persistProgress = useCallback(
    (patch = {}) => {
      if (!topicId) return
      const progressKey = getTopicProgressKey(topicId)
      const next = {
        stage,
        useItStep,
        recallStats,
        scenarioCorrect,
        scenarioSuccessByWord,
        clozeCorrect,
        productionSuccessByWord,
        taskDone,
        taskText,
        ...patch
      }
      localStorage.setItem(progressKey, JSON.stringify(next))
    },
    [topicId, stage, useItStep, recallStats, scenarioCorrect, scenarioSuccessByWord, clozeCorrect, productionSuccessByWord, taskDone, taskText]
  )

  useEffect(() => {
    persistProgress()
  }, [persistProgress])

  useEffect(() => {
    if (!topicId) return
    const key = `vocab_hard_${topicId}`
    const saved = localStorage.getItem(key)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) setHardWordIds(parsed)
    } catch {
      // ignore
    }
  }, [topicId])

  useEffect(() => {
    if (!topicId) return
    const key = `vocab_hard_${topicId}`
    localStorage.setItem(key, JSON.stringify(hardWordIds))
  }, [topicId, hardWordIds])

  const currentRecallWord = useMemo(() => {
    const words = topicData?.words || []
    const currentIdx = recallQueue[recallIndex]
    if (typeof currentIdx !== 'number') return null
    return words[currentIdx] || null
  }, [topicData, recallQueue, recallIndex])

  const recallPrompt = useMemo(() => {
    if (!currentRecallWord?.translation) return ''
    const t = currentRecallWord.translation
    return t[language] || t.en || ''
  }, [currentRecallWord, language])

  const handleRecallCheck = useCallback(() => {
    if (!currentRecallWord) return
    const expected = normalizeAnswer(currentRecallWord.word)
    const actual = normalizeAnswer(recallInput)

    const isCorrect = expected.length > 0 && actual === expected

    setRecallStats((s) => ({
      attempts: s.attempts + 1,
      correct: s.correct + (isCorrect ? 1 : 0)
    }))

    setRecallFeedback(
      isCorrect
        ? { type: 'success', text: 'Correct!' }
        : { type: 'error', text: `Correct answer: ${getWordLabel(currentRecallWord.word)}` }
    )

    if (!isCorrect) {
      setRecallQueue((q) => [...q, q[recallIndex]])
    }
  }, [currentRecallWord, recallInput, recallIndex])

  const handleRecallNext = useCallback(() => {
    setRecallInput('')
    setRecallFeedback(null)

    const nextIndex = recallIndex + 1
    if (nextIndex >= recallQueue.length) {
      setStage('useit')
      setUseItStep('scenario')
      return
    }

    setRecallIndex(nextIndex)
  }, [recallIndex, recallQueue.length])

  const handleStartRecall = useCallback(() => {
    setStage('recall')
    setRecallInput('')
    setRecallFeedback(null)
  }, [])

  const handleScenarioAnswer = useCallback(
    (selected) => {
      const q = scenarioQuestions[scenarioIndex]
      if (!q) return

      const isCorrect = selected === q.answer
      if (isCorrect) {
        setScenarioCorrect((v) => v + 1)
        setScenarioSuccessByWord((prev) => ({
          ...prev,
          [normalizeAnswer(q.answer)]: true
        }))
      }

      const next = scenarioIndex + 1
      if (next >= scenarioQuestions.length) {
        setUseItStep('production')
        setScenarioIndex(0)
        return
      }

      setScenarioIndex(next)
    },
    [scenarioQuestions, scenarioIndex]
  )

  const checkCloze = useCallback(
    (value) => {
      const q = clozeQuestions[clozeIndex]
      if (!q) return

      const expected = normalizeAnswer(q.answer)
      const actual = normalizeAnswer(value)
      const isCorrect = expected.length > 0 && actual === expected

      setClozeFeedback(
        isCorrect
          ? { type: 'success', text: 'Correct!' }
          : { type: 'error', text: `Correct answer: ${getWordLabel(q.answer)}` }
      )

      if (isCorrect) {
        setClozeCorrect((v) => v + 1)
        setProductionSuccessByWord((prev) => ({
          ...prev,
          [normalizeAnswer(q.answer)]: true
        }))
      }
    },
    [clozeQuestions, clozeIndex]
  )

  const handleClozeNext = useCallback(() => {
    setClozeInput('')
    setClozeFeedback(null)

    const next = clozeIndex + 1
    if (next >= clozeQuestions.length) {
      setUseItStep('task')
      setClozeIndex(0)
      return
    }

    setClozeIndex(next)
  }, [clozeIndex, clozeQuestions.length])

  const handleFinish = useCallback(() => {
    if (!canFinish) return
    persistProgress({ stage: 'done', useItStep: 'task', completedAt: Date.now() })
    setStage('done')
  }, [canFinish, persistProgress])

  const reviewPlan = useMemo(() => {
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    return [
      { day: 1, type: 'Production', dueAt: now + 1 * day },
      { day: 3, type: 'Scenario choice', dueAt: now + 3 * day },
      { day: 7, type: 'Write / say 2 sentences', dueAt: now + 7 * day }
    ]
  }, [])

  const stageMeta = useMemo(() => {
    const words = topicData?.words || []
    const baseTotal = words.length
    const recallDone = Math.min(recallStats.correct, baseTotal)
    const useItDone = (mastery.scenarioOk ? 1 : 0) + (mastery.productionOk ? 1 : 0) + (mastery.taskOk ? 1 : 0)
    return {
      exposure: `${baseTotal} слов`,
      recall: `${recallDone}/${baseTotal}`,
      useit: `${useItDone}/3`
    }
  }, [topicData, recallStats.correct, mastery.scenarioOk, mastery.productionOk, mastery.taskOk])

  const setStageAndPersist = useCallback((nextStage) => {
    setStage(nextStage)
    if (nextStage === 'useit') {
      setUseItStep('scenario')
    }
  }, [])

  if (loading) {
    return <LoadingState message="Loading vocabulary lesson..." />
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

  const words = topicData.words || []

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper pt-24 pb-10 sm:pt-28 md:pb-14">
        <Card variant="glass" hover={false} className="mb-4">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-3">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/english/vocabulary')}
                  className="flex items-center gap-2"
                >
                  <HiHome className="w-4 h-4" />
                  <span>Назад</span>
                </Button>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 justify-start md:justify-center">
                  <Badge variant="primary">{topicData.level}</Badge>
                  <Badge variant="gray">{words.length} слов</Badge>
                </div>
                <h1 className="mt-2 text-[32px] leading-[40px] md:text-[44px] md:leading-[52px] font-bold text-gray-900 break-words text-left md:text-center">
                  {topicData.topic}
                </h1>
                <p className="mt-1 typo-caption text-gray-500 text-left md:text-center">
                  <span className="text-gray-500">Flow:</span> Exposure • Recall • Use it
                </p>
              </div>

              <div className="flex items-center justify-start md:justify-end gap-2">
                <label className="typo-caption text-gray-600">Язык</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-10 px-3 rounded-button border border-app-border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ru">RU</option>
                  <option value="en">EN</option>
                  <option value="uz">UZ</option>
                </select>
              </div>
            </div>

            <div className="mt-4 rounded-button border border-app-border bg-white p-1">
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => setStageAndPersist('exposure')}
                  className={`h-10 rounded-button px-3 text-sm font-semibold transition-colors ${
                    stage === 'exposure'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Exposure</span>
                    <span className="text-xs text-gray-500">{stageMeta.exposure}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setStageAndPersist('recall')}
                  className={`h-10 rounded-button px-3 text-sm font-semibold transition-colors ${
                    stage === 'recall'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Recall</span>
                    <span className="text-xs text-gray-500">{stageMeta.recall}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setStageAndPersist('useit')}
                  className={`h-10 rounded-button px-3 text-sm font-semibold transition-colors ${
                    stage === 'useit'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Use it</span>
                    <span className="text-xs text-gray-500">{stageMeta.useit}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {stage === 'exposure' && (
          <div className="space-y-3 md:space-y-4">
            <Card variant="glass" className="p-3 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="typo-h2">Exposure</h2>
                  <p className="typo-body text-gray-600 mt-2">
                    Просмотрите слова и примеры. Затем начните проверку.
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={handleStartRecall}>
                  Начать проверку
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {words.map((w) => (
                <Card key={w.id} variant="glass" className="p-3 md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[18px] md:text-[20px] font-semibold text-gray-900 break-words">
                        {w.word}
                      </p>
                      <p className="text-[13px] md:text-[14px] text-gray-500 mt-1 break-words">
                        {(w.translation && (w.translation[language] || w.translation.en)) || ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      title="Пометить как сложное"
                      onClick={() => {
                        setHardWordIds((prev) => {
                          const id = w.id
                          return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                        })
                      }}
                      className={`h-10 w-10 rounded-button border border-app-border flex items-center justify-center transition-colors ${
                        hardWordIds.includes(w.id) ? 'bg-warning-50 text-warning-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <HiStar className="w-5 h-5" />
                    </button>
                  </div>

                  {Array.isArray(w.example) && w.example.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {w.example.slice(0, 2).map((ex, idx) => (
                        <p key={idx} className="text-[14px] leading-[22px] text-gray-800">
                          {ex}
                        </p>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {stage === 'recall' && (
          <div className="space-y-3 md:space-y-4">
            <Card variant="glass" className="p-3 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="typo-h2">Проверка (Recall)</h2>
                  <p className="typo-body text-gray-600 mt-2">
                    Введите слово по значению. Ошибки будут повторяться.
                  </p>
                </div>
                <Badge variant={recallAccuracy >= 85 ? 'success' : 'warning'}>
                  {recallAccuracy}%
                </Badge>
              </div>
            </Card>

            <Card variant="glass" className="p-3 md:p-5">
              <div className="flex items-center justify-between">
                <p className="typo-caption text-gray-600">
                  Карточка {Math.min(recallIndex + 1, recallQueue.length)} / {recallQueue.length}
                </p>
                {currentRecallWord && (
                  <Badge variant="gray">{currentRecallWord.word}</Badge>
                )}
              </div>

              <div className="mt-3">
                <p className="typo-caption text-gray-900">Значение</p>
                <p className="typo-body text-gray-700 mt-1">{recallPrompt}</p>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <input
                  value={recallInput}
                  onChange={(e) => setRecallInput(e.target.value)}
                  className="w-full h-11 px-3 rounded-button border border-app-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Введите слово..."
                />

                {recallFeedback ? (
                  <Button variant="primary" size="sm" onClick={handleRecallNext}>
                    Дальше
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={handleRecallCheck}>
                    Проверить
                  </Button>
                )}
              </div>

              {recallFeedback && (
                <div
                  className={`mt-3 rounded-lg border p-3 text-sm ${
                    recallFeedback.type === 'success'
                      ? 'bg-success-50 border-success-200 text-success-700'
                      : 'bg-error-50 border-error-200 text-error-700'
                  }`}
                >
                  {recallFeedback.text}
                </div>
              )}

              <div className="mt-3 typo-caption text-gray-500">
                Попытки: {recallStats.attempts}. Верно: {recallStats.correct}.
              </div>
            </Card>
          </div>
        )}

        {stage === 'useit' && (
          <div className="space-y-3 md:space-y-4">
            <Card variant="glass" className="p-3 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="typo-h2">Use it (Практика)</h2>
                  <p className="typo-body text-gray-600 mt-2">
                    Контекст → Сборка → Мини‑задача. Task обязателен для завершения.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={mastery.scenarioOk ? 'success' : 'warning'}>Scenario</Badge>
                  <Badge variant={mastery.productionOk ? 'success' : 'warning'}>Production</Badge>
                  <Badge variant={mastery.taskOk ? 'success' : 'warning'}>Task</Badge>
                </div>
              </div>
            </Card>

            {useItStep === 'scenario' && (
              <Card variant="glass" className="p-3 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiCheckCircle className="w-5 h-5 text-primary-600" />
                    <h3 className="text-base md:text-lg font-bold text-gray-900">Шаг A — Контекстный выбор</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {scenarioIndex + 1} / {scenarioQuestions.length}
                  </p>
                </div>

                {scenarioQuestions[scenarioIndex] && (
                  <div className="mt-3">
                    <p className="text-gray-700 text-sm">{scenarioQuestions[scenarioIndex].scenario}</p>
                    <p className="text-gray-900 font-semibold mt-2">{scenarioQuestions[scenarioIndex].text}</p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scenarioQuestions[scenarioIndex].options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleScenarioAnswer(opt)}
                          className="w-full text-left h-11 px-3 rounded-button border border-app-border bg-white hover:bg-gray-50 transition-colors text-sm font-semibold"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                      Верно на шаге: {scenarioCorrect}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {useItStep === 'production' && (
              <Card variant="glass" className="p-3 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiPencil className="w-5 h-5 text-primary-600" />
                    <h3 className="text-base md:text-lg font-bold text-gray-900">Шаг B — Production</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {clozeIndex + 1} / {clozeQuestions.length}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    id="typingMode"
                    type="checkbox"
                    checked={typingMode}
                    onChange={(e) => setTypingMode(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="typingMode" className="text-sm text-gray-700">
                    Ввод текста
                  </label>
                </div>

                {clozeQuestions[clozeIndex] && (
                  <div className="mt-3">
                    <p className="text-gray-900 font-semibold">{clozeQuestions[clozeIndex].text}</p>

                    {!typingMode ? (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {clozeQuestions[clozeIndex].bank.map((w) => (
                          <button
                            key={w}
                            onClick={() => {
                              checkCloze(w)
                              setClozeInput(w)
                            }}
                            className="w-full text-left h-11 px-3 rounded-button border border-app-border bg-white hover:bg-gray-50 transition-colors text-sm font-semibold"
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <input
                          value={clozeInput}
                          onChange={(e) => setClozeInput(e.target.value)}
                          className="w-full h-11 px-3 rounded-button border border-app-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Введите слово..."
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => checkCloze(clozeInput)}
                          disabled={!clozeInput.trim()}
                        >
                          Проверить
                        </Button>
                      </div>
                    )}

                    {clozeFeedback && (
                      <div
                        className={`mt-3 rounded-lg border p-3 text-sm ${
                          clozeFeedback.type === 'success'
                            ? 'bg-success-50 border-success-200 text-success-700'
                            : 'bg-error-50 border-error-200 text-error-700'
                        }`}
                      >
                        {clozeFeedback.text}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-gray-500">Верно на шаге: {clozeCorrect}</p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleClozeNext}
                        disabled={!clozeFeedback}
                      >
                        Дальше
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {useItStep === 'task' && (
              <Card variant="glass" className="p-3 md:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Шаг C — Мини‑задача</h3>
                  <Badge variant={taskDone ? 'success' : 'warning'}>{taskDone ? 'Done' : 'Required'}</Badge>
                </div>

                <p className="typo-body text-gray-700 mt-2">{task.instruction}</p>

                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-900">Checklist</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                    {task.checklist.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 rounded-button border border-app-border bg-white p-3">
                  <p className="text-xs font-semibold text-gray-600">Template</p>
                  <p className="text-sm text-gray-900 mt-1">{task.template}</p>
                </div>

                <div className="mt-3 rounded-button border border-app-border bg-white p-3">
                  <p className="text-xs font-semibold text-gray-600">Your answer (optional)</p>
                  <textarea
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    rows={3}
                    className="mt-2 w-full px-3 py-2 rounded-button border border-app-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Напишите здесь (необязательно)..."
                  />
                </div>

                <div className="mt-3 rounded-button border border-app-border bg-white p-3">
                  <p className="text-xs font-semibold text-gray-600">Example</p>
                  <p className="text-sm text-gray-900 mt-1">{task.example}</p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={taskDone}
                      onChange={(e) => setTaskDone(e.target.checked)}
                      className="h-4 w-4"
                    />
                    Сделано
                  </label>

                  <Button variant="primary" size="sm" onClick={handleFinish} disabled={!canFinish}>
                    Завершить
                  </Button>
                </div>

                {!canFinish && (
                  <div className="mt-3 text-xs text-gray-600">
                    Чтобы завершить урок:
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${mastery.recallOk ? 'bg-success-600' : 'bg-gray-300'}`} />
                        <span>Recall ≥ 85% (сейчас {recallAccuracy}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${mastery.scenarioOk ? 'bg-success-600' : 'bg-gray-300'}`} />
                        <span>Scenario: core‑слова ({coreWords.length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${mastery.productionOk ? 'bg-success-600' : 'bg-gray-300'}`} />
                        <span>Production: core‑слова ({coreWords.length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${mastery.taskOk ? 'bg-success-600' : 'bg-gray-300'}`} />
                        <span>Task выполнен</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {stage === 'done' && (
          <div className="space-y-3 md:space-y-4">
            <Card variant="glass" className="p-3 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="typo-h2">Урок завершён</h2>
                  <p className="typo-body text-gray-600 mt-2">
                    Отлично. Дальше — короткие повторы по расписанию.
                  </p>
                </div>
                <Badge variant="success">Mastery</Badge>
              </div>
            </Card>

            <Card variant="glass" className="p-3 md:p-5">
              <h3 className="text-base md:text-lg font-bold text-gray-900">План повторения</h3>
              <div className="mt-2 space-y-2">
                {reviewPlan.map((item) => (
                  <div key={item.day} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Day {item.day}</p>
                      <p className="text-xs text-gray-600 truncate">{item.type}</p>
                    </div>
                    <Badge variant="gray" size="sm">
                      {new Date(item.dueAt).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <Button variant="secondary" size="sm" onClick={() => router.push('/english/vocabulary')}>
                  К темам
                </Button>
                <Button variant="primary" size="sm" onClick={() => {
                  setStage('useit')
                  setUseItStep('task')
                }}>
                  Показать Task
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
