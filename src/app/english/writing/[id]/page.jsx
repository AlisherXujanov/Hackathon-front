import { notFound } from 'next/navigation'
import WritingPage from './components/WritingPage'
import { loadWritingDataById } from '../../../../utils/english/writingLoader'

/**
 * Server-side page component for writing exercises
 * Loads writing data and passes it to client component
 */
export default async function Page({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  
  if (!id) {
    notFound()
  }

  // Try to load from all levels
  const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']
  let writingExercise = null
  let level = null

  for (const lvl of levels) {
    const exercise = await loadWritingDataById(id, lvl)
    if (exercise) {
      writingExercise = exercise
      level = lvl
      break
    }
  }

  if (!writingExercise) {
    notFound()
  }

  return (
    <WritingPage 
      writingExercise={writingExercise} 
      level={level}
      id={id}
    />
  )
}
