// Система геймификации: очки, уровни, достижения, бейджи

// Расчет уровня на основе очков
export function calculateLevel(points) {
  // Формула: уровень = sqrt(points / 100)
  const level = Math.floor(Math.sqrt(points / 100)) + 1
  return Math.max(1, Math.min(level, 100)) // Ограничиваем от 1 до 100
}

// Опыт необходимый для уровня
export function calculateXPForLevel(level) {
  return Math.pow(level - 1, 2) * 100
}

// Опыт для следующего уровня
export function calculateXPForNextLevel(level) {
  return calculateXPForLevel(level + 1)
}

// Прогресс до следующего уровня (0-100)
export function calculateLevelProgress(points, currentLevel) {
  const currentLevelXP = calculateXPForLevel(currentLevel)
  const nextLevelXP = calculateXPForNextLevel(currentLevel)
  const progress = ((points - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  return Math.max(0, Math.min(100, Math.round(progress * 10) / 10))
}

// Достижения
export const achievements = [
  {
    id: 'first_step',
    title: 'Первый шаг',
    description: 'Завершите первый урок',
    icon: '🎯',
    category: 'learning',
    points: 10,
    requirement: { type: 'lessons_completed', value: 1 },
  },
  {
    id: 'week_streak',
    title: 'Неделя обучения',
    description: 'Поддерживайте серию 7 дней подряд',
    icon: '🔥',
    category: 'streak',
    points: 50,
    requirement: { type: 'streak_days', value: 7 },
  },
  {
    id: 'month_streak',
    title: 'Месяц обучения',
    description: 'Поддерживайте серию 30 дней подряд',
    icon: '⭐',
    category: 'streak',
    points: 200,
    requirement: { type: 'streak_days', value: 30 },
  },
  {
    id: 'python_master',
    title: 'Мастер Python',
    description: 'Завершите 10 уроков Python',
    icon: '🐍',
    category: 'programming',
    points: 100,
    requirement: { type: 'lessons_by_language', value: { language: 'Python', count: 10 } },
  },
  {
    id: 'social_butterfly',
    title: 'Социальная бабочка',
    description: 'Оставьте 50 комментариев в форуме',
    icon: '💬',
    category: 'social',
    points: 75,
    requirement: { type: 'comments_count', value: 50 },
  },
  {
    id: 'course_completer',
    title: 'Завершитель курсов',
    description: 'Завершите 3 курса',
    icon: '🎓',
    category: 'learning',
    points: 200,
    requirement: { type: 'courses_completed', value: 3 },
  },
  {
    id: 'task_solver',
    title: 'Решатель задач',
    description: 'Решите 20 задач по программированию',
    icon: '💻',
    category: 'programming',
    points: 120,
    requirement: { type: 'tasks_completed', value: 20 },
  },
  {
    id: 'early_bird',
    title: 'Ранняя пташка',
    description: 'Войдите в систему 10 дней подряд',
    icon: '🌅',
    category: 'streak',
    points: 60,
    requirement: { type: 'daily_logins', value: 10 },
  },
  {
    id: 'helper',
    title: 'Помощник',
    description: 'Помогите 10 пользователям в форуме',
    icon: '🤝',
    category: 'social',
    points: 80,
    requirement: { type: 'helpful_comments', value: 10 },
  },
]

// Бейджи
export const badges = [
  {
    id: 'bronze_learner',
    title: 'Бронзовый ученик',
    description: 'Достигните 5 уровня',
    icon: '🥉',
    category: 'level',
    requirement: { type: 'level', value: 5 },
  },
  {
    id: 'silver_learner',
    title: 'Серебряный ученик',
    description: 'Достигните 10 уровня',
    icon: '🥈',
    category: 'level',
    requirement: { type: 'level', value: 10 },
  },
  {
    id: 'gold_learner',
    title: 'Золотой ученик',
    description: 'Достигните 20 уровня',
    icon: '🥇',
    category: 'level',
    requirement: { type: 'level', value: 20 },
  },
  {
    id: 'platinum_learner',
    title: 'Платиновый ученик',
    description: 'Достигните 50 уровня',
    icon: '💎',
    category: 'level',
    requirement: { type: 'level', value: 50 },
  },
]

// Награды за уровни
export function getLevelRewards(level) {
  const rewards = []
  
  if (level >= 5) rewards.push({ type: 'badge', id: 'bronze_learner' })
  if (level >= 10) rewards.push({ type: 'badge', id: 'silver_learner' })
  if (level >= 20) rewards.push({ type: 'badge', id: 'gold_learner' })
  if (level >= 50) rewards.push({ type: 'badge', id: 'platinum_learner' })
  
  // Бонусные очки за каждый 10-й уровень
  if (level % 10 === 0) {
    rewards.push({ type: 'points', amount: level * 10 })
  }
  
  return rewards
}

// Получить данные геймификации пользователя
export function getUserGamification(userId) {
  if (typeof window === 'undefined') return null
  
  const key = `gamification_${userId}`
  const raw = localStorage.getItem(key)
  
  if (!raw) {
    // Создаем начальные данные
    const initial = {
      userId,
      totalPoints: 0,
      dailyPoints: 0,
      weeklyPoints: 0,
      monthlyPoints: 0,
      currentLevel: 1,
      unlockedAchievements: [],
      unlockedBadges: [],
      activityHistory: [],
      lastDailyReset: new Date().toISOString().split('T')[0],
      lastWeeklyReset: getWeekStart(),
      lastMonthlyReset: getMonthStart(),
    }
    localStorage.setItem(key, JSON.stringify(initial))
    return initial
  }
  
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Сохранить данные геймификации
export function saveUserGamification(userId, data) {
  if (typeof window === 'undefined') return
  const key = `gamification_${userId}`
  localStorage.setItem(key, JSON.stringify(data))
}

// Начислить очки
export function awardPoints(userId, points, reason, activityType = 'other') {
  if (typeof window === 'undefined') return null
  
  const gamification = getUserGamification(userId)
  if (!gamification) return null
  
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const weekStart = getWeekStart()
  const monthStart = getMonthStart()
  
  // Сброс ежедневных очков если нужно
  if (gamification.lastDailyReset !== today) {
    gamification.dailyPoints = 0
    gamification.lastDailyReset = today
  }
  
  // Сброс еженедельных очков если нужно
  if (gamification.lastWeeklyReset !== weekStart) {
    gamification.weeklyPoints = 0
    gamification.lastWeeklyReset = weekStart
  }
  
  // Сброс ежемесячных очков если нужно
  if (gamification.lastMonthlyReset !== monthStart) {
    gamification.monthlyPoints = 0
    gamification.lastMonthlyReset = monthStart
  }
  
  // Начисляем очки
  gamification.totalPoints += points
  gamification.dailyPoints += points
  gamification.weeklyPoints += points
  gamification.monthlyPoints += points
  
  // Пересчитываем уровень
  const newLevel = calculateLevel(gamification.totalPoints)
  const levelUp = newLevel > gamification.currentLevel
  gamification.currentLevel = newLevel
  
  // Добавляем в историю
  gamification.activityHistory.unshift({
    points,
    reason,
    activityType,
    timestamp: now.toISOString(),
  })
  
  // Ограничиваем историю последними 100 записями
  if (gamification.activityHistory.length > 100) {
    gamification.activityHistory = gamification.activityHistory.slice(0, 100)
  }
  
  saveUserGamification(userId, gamification)
  
  // Проверяем достижения и бейджи
  checkAchievements(userId)
  checkBadges(userId)
  
  return {
    ...gamification,
    levelUp,
    newLevel,
  }
}

// Проверить и разблокировать достижения
export function checkAchievements(userId) {
  if (typeof window === 'undefined') return []
  
  const gamification = getUserGamification(userId)
  if (!gamification) return []
  
  const unlocked = []
  
  // Получаем статистику пользователя
  const stats = getUserStats(userId)
  
  achievements.forEach((achievement) => {
    if (gamification.unlockedAchievements.includes(achievement.id)) {
      return // Уже разблокировано
    }
    
    const req = achievement.requirement
    let isUnlocked = false
    
    switch (req.type) {
      case 'lessons_completed':
        isUnlocked = stats.lessonsCompleted >= req.value
        break
      case 'streak_days':
        isUnlocked = stats.streakDays >= req.value
        break
      case 'lessons_by_language':
        isUnlocked = (stats.lessonsByLanguage[req.value.language] || 0) >= req.value.count
        break
      case 'comments_count':
        isUnlocked = stats.commentsCount >= req.value
        break
      case 'courses_completed':
        isUnlocked = stats.coursesCompleted >= req.value
        break
      case 'tasks_completed':
        isUnlocked = stats.tasksCompleted >= req.value
        break
      case 'daily_logins':
        isUnlocked = stats.dailyLogins >= req.value
        break
      case 'helpful_comments':
        isUnlocked = stats.helpfulComments >= req.value
        break
    }
    
    if (isUnlocked) {
      gamification.unlockedAchievements.push(achievement.id)
      unlocked.push(achievement)
      
      // Начисляем очки за достижение
      if (achievement.points) {
        awardPoints(userId, achievement.points, `Достижение: ${achievement.title}`, 'achievement')
      }
    }
  })
  
  if (unlocked.length > 0) {
    saveUserGamification(userId, gamification)
  }
  
  return unlocked
}

// Проверить и разблокировать бейджи
export function checkBadges(userId) {
  if (typeof window === 'undefined') return []
  
  const gamification = getUserGamification(userId)
  if (!gamification) return []
  
  const unlocked = []
  const stats = getUserStats(userId)
  
  badges.forEach((badge) => {
    if (gamification.unlockedBadges.includes(badge.id)) {
      return
    }
    
    const req = badge.requirement
    let isUnlocked = false
    
    switch (req.type) {
      case 'level':
        isUnlocked = gamification.currentLevel >= req.value
        break
    }
    
    if (isUnlocked) {
      gamification.unlockedBadges.push(badge.id)
      unlocked.push(badge)
    }
  })
  
  if (unlocked.length > 0) {
    saveUserGamification(userId, gamification)
  }
  
  return unlocked
}

// Получить статистику пользователя
export function getUserStats(userId) {
  if (typeof window === 'undefined') return getDefaultStats()
  
  // Получаем из различных источников localStorage
  const lessonsCompleted = parseInt(localStorage.getItem(`user_${userId}_lessons_completed`) || '0', 10)
  const tasksCompleted = parseInt(localStorage.getItem(`user_${userId}_tasks_completed`) || '0', 10)
  const coursesCompleted = parseInt(localStorage.getItem(`user_${userId}_courses_completed`) || '0', 10)
  const commentsCount = parseInt(localStorage.getItem(`user_${userId}_comments_count`) || '0', 10)
  const helpfulComments = parseInt(localStorage.getItem(`user_${userId}_helpful_comments`) || '0', 10)
  const dailyLogins = parseInt(localStorage.getItem(`user_${userId}_daily_logins`) || '0', 10)
  
  // Получаем из профиля
  const userRaw = localStorage.getItem('user')
  let streakDays = 0
  let lessonsByLanguage = {}
  
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw)
      const userData = user?.data || user
      streakDays = userData?.profile?.streak_days || 0
    } catch {}
  }
  
  // Получаем уроки по языкам
  const lessonsByLangRaw = localStorage.getItem(`user_${userId}_lessons_by_language`)
  if (lessonsByLangRaw) {
    try {
      lessonsByLanguage = JSON.parse(lessonsByLangRaw)
    } catch {}
  }
  
  return {
    lessonsCompleted,
    tasksCompleted,
    coursesCompleted,
    commentsCount,
    helpfulComments,
    dailyLogins,
    streakDays,
    lessonsByLanguage,
  }
}

function getDefaultStats() {
  return {
    lessonsCompleted: 0,
    tasksCompleted: 0,
    coursesCompleted: 0,
    commentsCount: 0,
    helpfulComments: 0,
    dailyLogins: 0,
    streakDays: 0,
    lessonsByLanguage: {},
  }
}

// Обновить статистику
export function updateUserStat(userId, statType, value) {
  if (typeof window === 'undefined') return
  
  const key = `user_${userId}_${statType}`
  localStorage.setItem(key, String(value))
}

// Увеличить статистику
export function incrementUserStat(userId, statType, amount = 1) {
  if (typeof window === 'undefined') return
  
  const key = `user_${userId}_${statType}`
  const current = parseInt(localStorage.getItem(key) || '0', 10)
  localStorage.setItem(key, String(current + amount))
}

// Вспомогательные функции для дат
function getWeekStart() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const weekStart = new Date(now.setDate(diff))
  return weekStart.toISOString().split('T')[0]
}

function getMonthStart() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
}

export default {
  calculateLevel,
  calculateXPForLevel,
  calculateXPForNextLevel,
  calculateLevelProgress,
  getUserGamification,
  saveUserGamification,
  awardPoints,
  checkAchievements,
  checkBadges,
  getUserStats,
  updateUserStat,
  incrementUserStat,
  achievements,
  badges,
  getLevelRewards,
}
