// Генерация реалистичных данных аналитики для демонстрации

function generateDailyActivity(days = 30) {
  const data = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Реалистичные значения с небольшими колебаниями
    const baseHours = 1.5 + Math.random() * 2.5
    const lessons = Math.floor(2 + Math.random() * 5)
    const tasks = Math.floor(1 + Math.random() * 4)
    
    // Выходные дни - меньше активности
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const multiplier = isWeekend ? 0.4 : 1
    
    data.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
      hours: Math.round((baseHours * multiplier) * 10) / 10,
      lessons: Math.floor(lessons * multiplier),
      tasks: Math.floor(tasks * multiplier),
      streak: i < 7 ? true : Math.random() > 0.3,
    })
  }
  
  return data
}

function generateSkillsProgress() {
  return [
    { name: 'Python', level: 75, hours: 45, lessons: 12, color: '#3B82F6' },
    { name: 'JavaScript', level: 68, hours: 38, lessons: 10, color: '#F59E0B' },
    { name: 'React', level: 62, hours: 32, lessons: 8, color: '#10B981' },
    { name: 'English', level: 80, hours: 52, lessons: 15, color: '#8B5CF6' },
    { name: 'Cybersecurity', level: 55, hours: 28, lessons: 6, color: '#EF4444' },
    { name: 'Django', level: 48, hours: 22, lessons: 5, color: '#06B6D4' },
    { name: 'TypeScript', level: 58, hours: 30, lessons: 7, color: '#6366F1' },
    { name: 'Node.js', level: 52, hours: 25, lessons: 6, color: '#14B8A6' },
  ]
}

function generateCategoryDistribution() {
  return [
    { name: 'English', value: 35, hours: 52, color: '#8B5CF6' },
    { name: 'Programming', value: 40, hours: 60, color: '#3B82F6' },
    { name: 'Cybersecurity', value: 15, hours: 22, color: '#EF4444' },
    { name: 'Courses', value: 10, hours: 15, color: '#10B981' },
  ]
}

function generateWeeklyComparison() {
  const weeks = []
  const today = new Date()
  
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - (i * 7 + today.getDay()))
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const baseHours = 8 + Math.random() * 6
    const baseLessons = 15 + Math.floor(Math.random() * 10)
    
    weeks.push({
      week: `Неделя ${4 - i}`,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      hours: Math.round(baseHours * 10) / 10,
      lessons: baseLessons,
      tasks: Math.floor(baseLessons * 0.7),
      improvement: i > 0 ? Math.round((Math.random() * 20 - 5) * 10) / 10 : 0,
    })
  }
  
  return weeks
}

function generateActivityHeatmap(days = 365) {
  const data = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Генерация активности с реалистичными паттернами
    let count = 0
    const dayOfWeek = date.getDay()
    
    // Больше активности в будние дни
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count = Math.floor(Math.random() * 8) + 2
    } else {
      count = Math.floor(Math.random() * 4)
    }
    
    // Иногда дни без активности
    if (Math.random() > 0.85) {
      count = 0
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      count,
      level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : 3,
    })
  }
  
  return data
}

function generateCourseStats() {
  return [
    { name: 'IELTS Preparation', progress: 85, lessons: 24, total: 28, hours: 18 },
    { name: 'React Advanced', progress: 60, lessons: 12, total: 20, hours: 15 },
    { name: 'Python Basics', progress: 100, lessons: 15, total: 15, hours: 12 },
    { name: 'Cybersecurity Fundamentals', progress: 45, lessons: 9, total: 20, hours: 10 },
    { name: 'JavaScript ES6+', progress: 75, lessons: 18, total: 24, hours: 14 },
  ]
}

function generateTimeDistribution() {
  return [
    { time: '00:00', value: 0 },
    { time: '06:00', value: 2 },
    { time: '08:00', value: 15 },
    { time: '10:00', value: 25 },
    { time: '12:00', value: 20 },
    { time: '14:00', value: 18 },
    { time: '16:00', value: 22 },
    { time: '18:00', value: 30 },
    { time: '20:00', value: 28 },
    { time: '22:00', value: 12 },
    { time: '24:00', value: 5 },
  ]
}

function generateLearningStreak() {
  const today = new Date()
  let streak = 0
  const streakData = []
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Реалистичный паттерн стрика
    const hadActivity = i < 7 || Math.random() > 0.15
    if (hadActivity) {
      streak++
    } else {
      streak = 0
    }
    
    streakData.push({
      date: date.toISOString().split('T')[0],
      streak,
      active: hadActivity,
    })
  }
  
  return {
    current: streak,
    longest: Math.max(...streakData.map(d => d.streak)),
    data: streakData,
  }
}

export function getAnalyticsData(period = 'month') {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365
  
  // Проверяем localStorage
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(`analytics_data_${period}`)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        const cachedDate = new Date(parsed.generatedAt)
        const now = new Date()
        const hoursDiff = (now - cachedDate) / (1000 * 60 * 60)
        
        // Кэш действителен 6 часов
        if (hoursDiff < 6) {
          return parsed.data
        }
      } catch {
        // Игнорируем ошибки парсинга
      }
    }
  }
  
  const data = {
    dailyActivity: generateDailyActivity(days),
    skillsProgress: generateSkillsProgress(),
    categoryDistribution: generateCategoryDistribution(),
    weeklyComparison: generateWeeklyComparison(),
    activityHeatmap: generateActivityHeatmap(365),
    courseStats: generateCourseStats(),
    timeDistribution: generateTimeDistribution(),
    learningStreak: generateLearningStreak(),
    
    // Общая статистика
    totalStats: {
      totalHours: Math.round(
        generateDailyActivity(days).reduce((sum, d) => sum + d.hours, 0) * 10
      ) / 10,
      totalLessons: generateDailyActivity(days).reduce((sum, d) => sum + d.lessons, 0),
      totalTasks: generateDailyActivity(days).reduce((sum, d) => sum + d.tasks, 0),
      currentStreak: generateLearningStreak().current,
      averageDailyHours: Math.round(
        (generateDailyActivity(days).reduce((sum, d) => sum + d.hours, 0) / days) * 10
      ) / 10,
    },
  }
  
  // Сохраняем в localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      `analytics_data_${period}`,
      JSON.stringify({
        data,
        generatedAt: new Date().toISOString(),
      })
    )
  }
  
  return data
}

export function exportAnalyticsData(format = 'json') {
  const data = getAnalyticsData('year')
  
  if (format === 'json') {
    return JSON.stringify(data, null, 2)
  }
  
  if (format === 'csv') {
    // Простой CSV экспорт для dailyActivity
    const headers = 'Date,Hours,Lessons,Tasks\n'
    const rows = data.dailyActivity
      .map((d) => `${d.date},${d.hours},${d.lessons},${d.tasks}`)
      .join('\n')
    return headers + rows
  }
  
  return null
}

export default {
  getAnalyticsData,
  exportAnalyticsData,
}
