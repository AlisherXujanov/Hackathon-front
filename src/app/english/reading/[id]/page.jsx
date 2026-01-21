import { notFound } from 'next/navigation'
import ReadingPage from './components/ReadingPage'
import { loadReadingDataById } from '../../../../utils/english/readingLoader'

/**
 * Server-side page component for reading exercises
 * Loads reading data and passes it to client component
 */
export default async function Page({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  
  if (!id) {
    notFound()
  }

  // Try to load from all levels
  const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']
  let readingExercise = null
  let level = null

  for (const lvl of levels) {
    const exercise = await loadReadingDataById(id, lvl)
    if (exercise) {
      readingExercise = exercise
      level = lvl
      break
    }
  }

  if (!readingExercise) {
    notFound()
  }

  return (
    <ReadingPage 
      readingExercise={readingExercise} 
      level={level}
      id={id}
    />
  )
}
