/**
 * Reading Data Loader
 * Loads reading exercise data from JSON files or API
 */

/**
 * Load reading data by ID and level
 * @param {string} id - Reading exercise ID
 * @param {string} level - Level (a1, a2, b1, b2, c1, c2)
 * @returns {Promise<Object|null>} Reading exercise data or null
 */
export async function loadReadingDataById(id, level) {
  try {
    const normalizedLevel = level?.toLowerCase()
    
    // Advanced levels (B2, C1, C2): fetch from API
    if (['b2', 'c1', 'c2'].includes(normalizedLevel)) {
      const base = process.env.NEXT_PUBLIC_API_URL || 'https://crucially-innate-chimp.cloudpub.ru'
      const res = await fetch(`${base}/api/v1/practice/reading/questions-by-id/${id}`, { 
        cache: 'no-store' 
      })
      if (!res.ok) return null
      const item = await res.json()
      return item
    }
    
    // Basic levels (A1, A2, B1): import local JSON
    const module = await import(`../../store/english/reading/${normalizedLevel}.json`)
    const readingData = module.default || module
    
    if (!Array.isArray(readingData)) return null
    
    // Find exercise by ID
    const exercise = readingData.find(item => item.id === parseInt(id))
    return exercise || null
  } catch (error) {
    console.error(`Failed to load reading data for ${level} (ID: ${id}):`, error)
    return null
  }
}

/**
 * Load reading answers for advanced levels
 * @param {string} id - Reading exercise ID
 * @returns {Promise<Object|null>} Answers data or null
 */
export async function loadReadingAnswers(id) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'https://crucially-innate-chimp.cloudpub.ru'
    const res = await fetch(`${base}/api/v1/practice/reading/answers-by-id/${id}`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    const data = await res.json()
    return data
  } catch (error) {
    console.error(`Failed to load reading answers for ID ${id}:`, error)
    return null
  }
}
