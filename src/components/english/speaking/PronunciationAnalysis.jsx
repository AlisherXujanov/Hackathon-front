'use client'

import { useMemo } from 'react'
import { HiCheckCircle, HiXCircle, HiExclamation } from 'react-icons/hi'
import Badge from '../../Badge'
import Card from '../../Card'
import { compareTexts, formatTextWithComparison } from '../../../utils/speaking/textComparison'
import styles from './PronunciationAnalysis.module.scss'

export default function PronunciationAnalysis({ originalText, transcribedText }) {
  const analysis = useMemo(() => {
    if (!originalText || !transcribedText) {
      return null
    }
    return compareTexts(originalText, transcribedText)
  }, [originalText, transcribedText])

  const formattedSegments = useMemo(() => {
    if (!analysis || !originalText) return []
    return formatTextWithComparison(originalText, analysis)
  }, [analysis, originalText])

  if (!analysis) {
    return (
      <Card variant="glass" className={styles.analysisCard}>
        <p className={styles.emptyMessage}>Запишите аудио для анализа произношения</p>
      </Card>
    )
  }

  const { accuracy, totalWords, correctWords, missingWords, incorrectWordsList } = analysis

  return (
    <div className={styles.analysis}>
      <Card variant="glass" className={styles.analysisCard}>
        <h3 className={styles.title}>Результаты анализа</h3>

        {/* Статистика */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <span className={styles.accuracyValue}>{accuracy}%</span>
            </div>
            <div className={styles.statLabel}>Точность</div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <span className={styles.correctValue}>{correctWords}</span>
              <span className={styles.totalValue}>/{totalWords}</span>
            </div>
            <div className={styles.statLabel}>Правильных слов</div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <span className={styles.missingValue}>{missingWords.length}</span>
            </div>
            <div className={styles.statLabel}>Пропущено</div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <span className={styles.incorrectValue}>{incorrectWordsList.length}</span>
            </div>
            <div className={styles.statLabel}>Ошибок</div>
          </div>
        </div>

        {/* Визуализация текста */}
        <div className={styles.textVisualization}>
          <h4 className={styles.sectionTitle}>Оригинальный текст</h4>
          <div className={styles.textContainer}>
            {formattedSegments.map((segment, index) => {
              const statusClass = styles[segment.status] || styles.missing
              return (
                <span
                  key={index}
                  className={`${styles.word} ${statusClass}`}
                  title={segment.status === 'correct' ? 'Правильно' : segment.status === 'missing' ? 'Пропущено' : 'Ошибка'}
                >
                  {segment.text}
                </span>
              )
            })}
          </div>
        </div>

        {/* Транскрибированный текст */}
        <div className={styles.transcribedText}>
          <h4 className={styles.sectionTitle}>Ваше произношение</h4>
          <p className={styles.transcribedContent}>{transcribedText}</p>
        </div>

        {/* Детали ошибок */}
        {missingWords.length > 0 && (
          <div className={styles.errorsSection}>
            <div className={styles.errorType}>
              <HiExclamation className={styles.errorIcon} />
              <h4 className={styles.errorTitle}>Пропущенные слова</h4>
              <div className={styles.errorWords}>
                {missingWords.map((word, index) => (
                  <Badge key={index} variant="warning" className={styles.errorBadge}>
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {incorrectWordsList.length > 0 && (
          <div className={styles.errorsSection}>
            <div className={styles.errorType}>
              <HiXCircle className={styles.errorIcon} />
              <h4 className={styles.errorTitle}>Неправильно произнесенные слова</h4>
              <div className={styles.errorWords}>
                {incorrectWordsList.map((word, index) => (
                  <Badge key={index} variant="error" className={styles.errorBadge}>
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Оценка */}
        <div className={styles.rating}>
          {accuracy >= 90 && (
            <div className={styles.ratingGood}>
              <HiCheckCircle className={styles.ratingIcon} />
              <span>Отличное произношение! Продолжайте в том же духе.</span>
            </div>
          )}
          {accuracy >= 70 && accuracy < 90 && (
            <div className={styles.ratingMedium}>
              <HiExclamation className={styles.ratingIcon} />
              <span>Хорошее произношение, но есть что улучшить. Обратите внимание на ошибки выше.</span>
            </div>
          )}
          {accuracy < 70 && (
            <div className={styles.ratingPoor}>
              <div className={styles.ratingHeader}>
                <HiXCircle className={styles.ratingIcon} />
                <span className={styles.ratingTitle}>Требуется улучшение</span>
              </div>
              <p className={styles.ratingMessage}>
                Попробуйте еще раз. Внимательно прочитайте текст и обратите внимание на выделенные ошибки выше. 
                Старайтесь произносить каждое слово четко и полностью.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
