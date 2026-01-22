// Мок-данные для Community системы

function generateUserId() {
  return Math.floor(Math.random() * 10000) + 1
}

function generateDate(daysAgo = 0) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

function generateUser(name, role = 'student') {
  const id = generateUserId()
  const username = name.toLowerCase().replace(/\s+/g, '_')
  return {
    id,
    username,
    first_name: name.split(' ')[0],
    last_name: name.split(' ')[1] || '',
    email: `${username}@example.com`,
    role,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    is_online: Math.random() > 0.7,
    rating: Math.floor(Math.random() * 100) + 50,
    joined_at: generateDate(Math.floor(Math.random() * 365)),
  }
}

export const forums = [
  {
    id: 'general',
    name: 'Общие обсуждения',
    description: 'Общие вопросы и обсуждения',
    icon: '💬',
    color: '#3B82F6',
    topicsCount: 45,
    postsCount: 234,
  },
  {
    id: 'programming',
    name: 'Программирование',
    description: 'Вопросы по программированию, алгоритмам и технологиям',
    icon: '💻',
    color: '#10B981',
    topicsCount: 128,
    postsCount: 892,
  },
  {
    id: 'english',
    name: 'Английский язык',
    description: 'Изучение английского языка, грамматика, практика',
    icon: '📚',
    color: '#8B5CF6',
    topicsCount: 67,
    postsCount: 456,
  },
  {
    id: 'cybersecurity',
    name: 'Кибербезопасность',
    description: 'CTF, безопасность, практические задачи',
    icon: '🔒',
    color: '#EF4444',
    topicsCount: 89,
    postsCount: 567,
  },
  {
    id: 'help',
    name: 'Помощь',
    description: 'Вопросы и помощь по использованию платформы',
    icon: '❓',
    color: '#F59E0B',
    topicsCount: 34,
    postsCount: 178,
  },
]

const users = [
  generateUser('Иван Петров'),
  generateUser('Мария Сидорова'),
  generateUser('Алексей Козлов'),
  generateUser('Елена Волкова'),
  generateUser('Дмитрий Новиков'),
  generateUser('Анна Смирнова'),
  generateUser('Сергей Лебедев'),
  generateUser('Ольга Морозова'),
  generateUser('Павел Соколов'),
  generateUser('Татьяна Павлова'),
]

function generateTopics(forumId, count = 10) {
  const topics = []
  const forum = forums.find((f) => f.id === forumId)
  
  const topicTemplates = {
    general: [
      'Как начать обучение?',
      'Лучшие практики для новичков',
      'Как мотивировать себя?',
      'Обмен опытом',
      'Вопросы по платформе',
    ],
    programming: [
      'Помогите с алгоритмом',
      'Лучший способ изучить React?',
      'Python vs JavaScript',
      'Проблема с кодом',
      'Рекомендации по курсам',
      'Как улучшить навыки?',
      'Вопрос по TypeScript',
      'Django или Flask?',
    ],
    english: [
      'Как улучшить произношение?',
      'Подготовка к IELTS',
      'Лучшие ресурсы для изучения',
      'Грамматические вопросы',
      'Практика разговорного',
    ],
    cybersecurity: [
      'CTF задачи - нужна помощь',
      'Как начать в кибербезопасности?',
      'Инструменты для пентеста',
      'Вопросы по лабам',
      'Карьера в InfoSec',
    ],
    help: [
      'Не могу войти в аккаунт',
      'Как сбросить пароль?',
      'Проблема с загрузкой',
      'Вопрос по сертификатам',
    ],
  }

  const templates = topicTemplates[forumId] || topicTemplates.general

  for (let i = 0; i < count; i++) {
    const author = users[Math.floor(Math.random() * users.length)]
    const daysAgo = Math.floor(Math.random() * 30)
    const views = Math.floor(Math.random() * 500) + 10
    const replies = Math.floor(Math.random() * 20)
    const likes = Math.floor(Math.random() * 50)

    topics.push({
      id: `${forumId}_topic_${i + 1}`,
      forumId,
      title: templates[i % templates.length] + (i > templates.length ? ` #${Math.floor(i / templates.length) + 1}` : ''),
      content: `Это пример содержания темы. Здесь может быть подробное описание вопроса или обсуждения. Пользователь ${author.first_name} задает вопрос по теме "${templates[i % templates.length]}".`,
      author,
      createdAt: generateDate(daysAgo),
      updatedAt: generateDate(Math.max(0, daysAgo - Math.floor(Math.random() * daysAgo))),
      views,
      replies,
      likes,
      isPinned: i < 2,
      isLocked: false,
      tags: ['вопрос', 'помощь'].slice(0, Math.floor(Math.random() * 2) + 1),
    })
  }

  return topics
}

function generateComments(topicId, count = 5) {
  const comments = []
  
  for (let i = 0; i < count; i++) {
    const author = users[Math.floor(Math.random() * users.length)]
    const daysAgo = Math.floor(Math.random() * 20)
    const likes = Math.floor(Math.random() * 20)
    const hasReplies = Math.random() > 0.6

    const comment = {
      id: `${topicId}_comment_${i + 1}`,
      topicId,
      author,
      content: `Это комментарий от ${author.first_name}. Здесь может быть полезная информация, ответ на вопрос или обсуждение темы.`,
      createdAt: generateDate(daysAgo),
      likes,
      isEdited: Math.random() > 0.8,
      replies: hasReplies ? generateReplies(`${topicId}_comment_${i + 1}`, Math.floor(Math.random() * 3) + 1) : [],
    }

    comments.push(comment)
  }

  return comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}

function generateReplies(commentId, count = 2) {
  const replies = []
  
  for (let i = 0; i < count; i++) {
    const author = users[Math.floor(Math.random() * users.length)]
    const daysAgo = Math.floor(Math.random() * 10)

    replies.push({
      id: `${commentId}_reply_${i + 1}`,
      commentId,
      author,
      content: `Ответ от ${author.first_name} на комментарий.`,
      createdAt: generateDate(daysAgo),
      likes: Math.floor(Math.random() * 10),
    })
  }

  return replies
}

export const groups = [
  {
    id: 'python',
    name: 'Python Developers',
    description: 'Сообщество разработчиков на Python',
    category: 'Languages',
    icon: '🐍',
    color: '#3B82F6',
    membersCount: 1245,
    postsCount: 234,
    isPublic: true,
    createdAt: generateDate(180),
  },
  {
    id: 'react',
    name: 'React Community',
    description: 'Изучаем React вместе',
    category: 'Frameworks',
    icon: '⚛️',
    color: '#10B981',
    membersCount: 892,
    postsCount: 156,
    isPublic: true,
    createdAt: generateDate(150),
  },
  {
    id: 'ielts',
    name: 'IELTS Preparation',
    description: 'Подготовка к экзамену IELTS',
    category: 'Exams',
    icon: '📝',
    color: '#8B5CF6',
    membersCount: 567,
    postsCount: 89,
    isPublic: true,
    createdAt: generateDate(120),
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Experts',
    description: 'Профессионалы в области кибербезопасности',
    category: 'Security',
    icon: '🛡️',
    color: '#EF4444',
    membersCount: 445,
    postsCount: 67,
    isPublic: true,
    createdAt: generateDate(90),
  },
  {
    id: 'javascript',
    name: 'JavaScript Masters',
    description: 'Все о JavaScript и экосистеме',
    category: 'Languages',
    icon: '📜',
    color: '#F59E0B',
    membersCount: 1123,
    postsCount: 198,
    isPublic: true,
    createdAt: generateDate(200),
  },
  {
    id: 'django',
    name: 'Django Developers',
    description: 'Веб-разработка на Django',
    category: 'Frameworks',
    icon: '🎸',
    color: '#06B6D4',
    membersCount: 678,
    postsCount: 123,
    isPublic: true,
    createdAt: generateDate(100),
  },
]

// Генерируем темы для всех форумов
export const topics = forums.flatMap((forum) => generateTopics(forum.id, 8))

// Генерируем комментарии для тем
export const comments = topics.flatMap((topic) => generateComments(topic.id, 3 + Math.floor(Math.random() * 5)))

// Генерируем друзей
export const friends = users.slice(0, 6).map((user) => ({
  ...user,
  friendshipDate: generateDate(Math.floor(Math.random() * 100)),
  mutualFriends: Math.floor(Math.random() * 10),
}))

// Генерируем запросы в друзья
export const friendRequests = users.slice(6, 10).map((user) => ({
  id: `request_${user.id}`,
  from: user,
  to: users[0], // текущий пользователь
  status: 'pending',
  createdAt: generateDate(Math.floor(Math.random() * 7)),
  message: `Привет! Давай дружить!`,
}))

// Функции для получения данных
export function getForums() {
  return forums
}

export function getForumById(id) {
  return forums.find((f) => f.id === id)
}

export function getTopicsByForum(forumId) {
  return topics.filter((t) => t.forumId === forumId)
}

export function getTopicById(id) {
  return topics.find((t) => t.id === id)
}

export function getCommentsByTopic(topicId) {
  return comments.filter((c) => c.topicId === topicId)
}

export function getGroups() {
  return groups
}

export function getGroupById(id) {
  return groups.find((g) => g.id === id)
}

export function getFriends() {
  return friends
}

export function getFriendRequests() {
  return friendRequests
}

export function getUserById(id) {
  return users.find((u) => u.id === id)
}

export default {
  forums,
  topics,
  comments,
  groups,
  friends,
  friendRequests,
  users,
  getForums,
  getForumById,
  getTopicsByForum,
  getTopicById,
  getCommentsByTopic,
  getGroups,
  getGroupById,
  getFriends,
  getFriendRequests,
  getUserById,
}
