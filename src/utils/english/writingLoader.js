/**
 * Writing Data Loader
 * Loads writing exercise data from JSON files or API
 */

/**
 * Load writing data by ID and level
 * @param {string} id - Writing exercise ID
 * @param {string} level - Level (a1, a2, b1, b2, c1, c2)
 * @returns {Promise<Object|null>} Writing exercise data or null
 */
export async function loadWritingDataById(id, level) {
  try {
    const normalizedLevel = level?.toLowerCase()
    
    // Advanced levels (B2, C1, C2): fetch from API
    if (['b2', 'c1', 'c2'].includes(normalizedLevel)) {
      const base = process.env.NEXT_PUBLIC_API_URL || 'https://crucially-innate-chimp.cloudpub.ru'
      const res = await fetch(`${base}/api/v1/practice/writing/questions-by-id/${id}`, { 
        cache: 'no-store' 
      })
      if (!res.ok) return null
      const item = await res.json()
      return item
    }
    
    // Basic levels (A1, A2, B1): import local JSON
    const module = await import(`../../store/english/writing/${normalizedLevel}.json`)
    const writingData = module.default || module
    
    if (!Array.isArray(writingData)) return null
    
    // Find exercise by ID
    const exercise = writingData.find(item => item.id === parseInt(id))
    return exercise || null
  } catch (error) {
    console.error(`Failed to load writing data for ${level} (ID: ${id}):`, error)
    return null
  }
}
