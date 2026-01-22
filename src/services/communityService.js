import { isDemoMode } from './api'
import { authService } from './api'
import { awardPoints, incrementUserStat } from '../store/gamification/gamificationData'
import {
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
  forums,
  topics,
  comments,
  groups,
  friends,
  friendRequests,
} from '../store/community/communityData'

// Функции для работы с localStorage
function getStorageKey(key) {
  return `community_${key}`
}

function readFromStorage(key, defaultValue = []) {
  if (typeof window === 'undefined') return defaultValue
  try {
    const raw = localStorage.getItem(getStorageKey(key))
    if (!raw) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

function writeToStorage(key, value) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(value))
  } catch (error) {
    console.error('Ошибка записи в localStorage:', error)
  }
}

function getCurrentUserId() {
  if (typeof window === 'undefined') return null
  try {
    const userRaw = localStorage.getItem('user')
    if (!userRaw) return null
    const user = JSON.parse(userRaw)
    return (user?.data || user)?.id || 1
  } catch {
    return 1
  }
}

export const communityService = {
  // Форумы
  getForums: async () => {
    if (isDemoMode()) {
      const stored = readFromStorage('forums')
      return stored.length > 0 ? stored : forums
    }
    // TODO: API call
    return forums
  },

  getForumTopics: async (forumId, page = 1, pageSize = 20) => {
    if (isDemoMode()) {
      const stored = readFromStorage('topics', topics)
      const forumTopics = stored.filter((t) => t.forumId === forumId)
      const sorted = forumTopics.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        results: sorted.slice(start, end),
        count: sorted.length,
        next: end < sorted.length ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
      }
    }
    // TODO: API call
    return { results: [], count: 0, next: null, previous: null }
  },

  getTopic: async (topicId) => {
    if (isDemoMode()) {
      const stored = readFromStorage('topics', topics)
      const topic = stored.find((t) => t.id === topicId)
      if (!topic) throw new Error('Тема не найдена')
      
      // Увеличиваем просмотры
      const updated = { ...topic, views: topic.views + 1 }
      const allTopics = readFromStorage('topics', topics)
      const updatedTopics = allTopics.map((t) => (t.id === topicId ? updated : t))
      writeToStorage('topics', updatedTopics)
      
      return updated
    }
    // TODO: API call
    return null
  },

  createTopic: async (forumId, data) => {
    if (isDemoMode()) {
      const currentUserId = getCurrentUserId()
      const newTopic = {
        id: `topic_${Date.now()}`,
        forumId,
        title: data.title,
        content: data.content,
        author: {
          id: currentUserId,
          username: 'current_user',
          first_name: 'Текущий',
          last_name: 'Пользователь',
          avatar_url: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        replies: 0,
        likes: 0,
        isPinned: false,
        isLocked: false,
        tags: data.tags || [],
      }
      
      const stored = readFromStorage('topics', topics)
      writeToStorage('topics', [newTopic, ...stored])
      
      return newTopic
    }
    // TODO: API call
    return null
  },

  // Комментарии
  getTopicComments: async (topicId, page = 1, pageSize = 20) => {
    if (isDemoMode()) {
      const stored = readFromStorage('comments', comments)
      const topicComments = stored.filter((c) => c.topicId === topicId)
      const sorted = topicComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        results: sorted.slice(start, end),
        count: sorted.length,
        next: end < sorted.length ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
      }
    }
    // TODO: API call
    return { results: [], count: 0, next: null, previous: null }
  },

  addComment: async (topicId, data) => {
    if (isDemoMode()) {
      const currentUserId = getCurrentUserId()
      const newComment = {
        id: `comment_${Date.now()}`,
        topicId,
        author: {
          id: currentUserId,
          username: 'current_user',
          first_name: 'Текущий',
          last_name: 'Пользователь',
          avatar_url: null,
        },
        content: data.content,
        createdAt: new Date().toISOString(),
        likes: 0,
        isEdited: false,
        replies: [],
      }
      
      const stored = readFromStorage('comments', comments)
      writeToStorage('comments', [...stored, newComment])
      
      // Обновляем количество ответов в теме
      const topics = readFromStorage('topics', [])
      const updatedTopics = topics.map((t) =>
        t.id === topicId ? { ...t, replies: t.replies + 1 } : t
      )
      writeToStorage('topics', updatedTopics)
      
      // Начисляем очки за комментарий
      if (currentUserId) {
        awardPoints(currentUserId, 2, 'Комментарий в форуме', 'comment')
        incrementUserStat(currentUserId, 'comments_count', 1)
      }
      
      return newComment
    }
    // TODO: API call
    return null
  },

  addReply: async (commentId, data) => {
    if (isDemoMode()) {
      const currentUserId = getCurrentUserId()
      const newReply = {
        id: `reply_${Date.now()}`,
        commentId,
        author: {
          id: currentUserId,
          username: 'current_user',
          first_name: 'Текущий',
          last_name: 'Пользователь',
          avatar_url: null,
        },
        content: data.content,
        createdAt: new Date().toISOString(),
        likes: 0,
      }
      
      const stored = readFromStorage('comments', comments)
      const updatedComments = stored.map((c) =>
        c.id === commentId ? { ...c, replies: [...(c.replies || []), newReply] } : c
      )
      writeToStorage('comments', updatedComments)
      
      return newReply
    }
    // TODO: API call
    return null
  },

  // Лайки
  likeTopic: async (topicId) => {
    if (isDemoMode()) {
      const topics = readFromStorage('topics', [])
      const topic = topics.find((t) => t.id === topicId)
      if (!topic) throw new Error('Тема не найдена')
      
      const liked = readFromStorage('liked_topics', [])
      const isLiked = liked.includes(topicId)
      const currentUserId = getCurrentUserId()
      
      if (isLiked) {
        // Убираем лайк
        writeToStorage('liked_topics', liked.filter((id) => id !== topicId))
        const updatedTopics = topics.map((t) =>
          t.id === topicId ? { ...t, likes: Math.max(0, t.likes - 1) } : t
        )
        writeToStorage('topics', updatedTopics)
        return { liked: false, likes: topic.likes - 1 }
      } else {
        // Добавляем лайк
        writeToStorage('liked_topics', [...liked, topicId])
        const updatedTopics = topics.map((t) =>
          t.id === topicId ? { ...t, likes: t.likes + 1 } : t
        )
        writeToStorage('topics', updatedTopics)
        
        // Начисляем очки за лайк
        if (currentUserId) {
          awardPoints(currentUserId, 1, 'Лайк темы в форуме', 'comment')
        }
        
        return { liked: true, likes: topic.likes + 1 }
      }
    }
    // TODO: API call
    return { liked: false, likes: 0 }
  },

  likeComment: async (commentId) => {
    if (isDemoMode()) {
      const comments = readFromStorage('comments', [])
      const comment = comments.find((c) => c.id === commentId)
      if (!comment) throw new Error('Комментарий не найден')
      
      const liked = readFromStorage('liked_comments', [])
      const isLiked = liked.includes(commentId)
      
      if (isLiked) {
        writeToStorage('liked_comments', liked.filter((id) => id !== commentId))
        const updated = comments.map((c) =>
          c.id === commentId ? { ...c, likes: Math.max(0, c.likes - 1) } : c
        )
        writeToStorage('comments', updated)
        return { liked: false, likes: comment.likes - 1 }
      } else {
        writeToStorage('liked_comments', [...liked, commentId])
        const updated = comments.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
        writeToStorage('comments', updated)
        return { liked: true, likes: comment.likes + 1 }
      }
    }
    // TODO: API call
    return { liked: false, likes: 0 }
  },

  isTopicLiked: (topicId) => {
    if (typeof window === 'undefined') return false
    const liked = readFromStorage('liked_topics', [])
    return liked.includes(topicId)
  },

  isCommentLiked: (commentId) => {
    if (typeof window === 'undefined') return false
    const liked = readFromStorage('liked_comments', [])
    return liked.includes(commentId)
  },

  // Группы
  getGroups: async (category = 'all') => {
    if (isDemoMode()) {
      const stored = readFromStorage('groups', groups)
      if (category === 'all') return stored
      return stored.filter((g) => g.category === category)
    }
    // TODO: API call
    return groups
  },

  getGroup: async (groupId) => {
    if (isDemoMode()) {
      const stored = readFromStorage('groups', groups)
      return stored.find((g) => g.id === groupId) || getGroupById(groupId)
    }
    // TODO: API call
    return null
  },

  joinGroup: async (groupId) => {
    if (isDemoMode()) {
      const currentUserId = getCurrentUserId()
      const memberships = readFromStorage('group_memberships', [])
      
      if (memberships.includes(groupId)) {
        throw new Error('Вы уже состоите в этой группе')
      }
      
      writeToStorage('group_memberships', [...memberships, groupId])
      
      // Обновляем количество участников
      const groups = readFromStorage('groups', [])
      const updated = groups.map((g) =>
        g.id === groupId ? { ...g, membersCount: g.membersCount + 1 } : g
      )
      writeToStorage('groups', updated)
      
      return { success: true, message: 'Вы присоединились к группе' }
    }
    // TODO: API call
    return { success: false }
  },

  leaveGroup: async (groupId) => {
    if (isDemoMode()) {
      const memberships = readFromStorage('group_memberships', [])
      if (!memberships.includes(groupId)) {
        throw new Error('Вы не состоите в этой группе')
      }
      
      writeToStorage('group_memberships', memberships.filter((id) => id !== groupId))
      
      // Обновляем количество участников
      const groups = readFromStorage('groups', [])
      const updated = groups.map((g) =>
        g.id === groupId ? { ...g, membersCount: Math.max(0, g.membersCount - 1) } : g
      )
      writeToStorage('groups', updated)
      
      return { success: true, message: 'Вы покинули группу' }
    }
    // TODO: API call
    return { success: false }
  },

  isGroupMember: (groupId) => {
    if (typeof window === 'undefined') return false
    const memberships = readFromStorage('group_memberships', [])
    return memberships.includes(groupId)
  },

  // Друзья
  getFriends: async () => {
    if (isDemoMode()) {
      const stored = readFromStorage('friends', friends)
      return stored
    }
    // TODO: API call
    return friends
  },

  getFriendRequests: async (type = 'received') => {
    if (isDemoMode()) {
      const stored = readFromStorage('friend_requests', friendRequests)
      const currentUserId = getCurrentUserId()
      
      if (type === 'received') {
        return stored.filter((r) => r.to?.id === currentUserId && r.status === 'pending')
      } else {
        return stored.filter((r) => r.from?.id === currentUserId && r.status === 'pending')
      }
    }
    // TODO: API call
    return []
  },

  sendFriendRequest: async (userId) => {
    if (isDemoMode()) {
      const currentUserId = getCurrentUserId()
      const requests = readFromStorage('friend_requests', [])
      
      // Проверяем, нет ли уже запроса
      const existing = requests.find(
        (r) =>
          (r.from?.id === currentUserId && r.to?.id === userId) ||
          (r.from?.id === userId && r.to?.id === currentUserId)
      )
      
      if (existing) {
        throw new Error('Запрос в друзья уже отправлен')
      }
      
      const newRequest = {
        id: `request_${Date.now()}`,
        from: {
          id: currentUserId,
          username: 'current_user',
          first_name: 'Текущий',
          last_name: 'Пользователь',
        },
        to: getUserById(userId) || { id: userId },
        status: 'pending',
        createdAt: new Date().toISOString(),
        message: '',
      }
      
      writeToStorage('friend_requests', [...requests, newRequest])
      return newRequest
    }
    // TODO: API call
    return null
  },

  acceptFriendRequest: async (requestId) => {
    if (isDemoMode()) {
      const requests = readFromStorage('friend_requests', [])
      const request = requests.find((r) => r.id === requestId)
      
      if (!request) throw new Error('Запрос не найден')
      
      // Обновляем статус запроса
      const updatedRequests = requests.map((r) =>
        r.id === requestId ? { ...r, status: 'accepted' } : r
      )
      writeToStorage('friend_requests', updatedRequests)
      
      // Добавляем в друзья
      const friends = readFromStorage('friends', [])
      if (!friends.find((f) => f.id === request.from.id)) {
        writeToStorage('friends', [...friends, request.from])
      }
      
      return { success: true, message: 'Запрос принят' }
    }
    // TODO: API call
    return { success: false }
  },

  rejectFriendRequest: async (requestId) => {
    if (isDemoMode()) {
      const requests = readFromStorage('friend_requests', [])
      const updated = requests.map((r) =>
        r.id === requestId ? { ...r, status: 'rejected' } : r
      )
      writeToStorage('friend_requests', updated)
      return { success: true, message: 'Запрос отклонен' }
    }
    // TODO: API call
    return { success: false }
  },

  removeFriend: async (userId) => {
    if (isDemoMode()) {
      const friends = readFromStorage('friends', [])
      writeToStorage('friends', friends.filter((f) => f.id !== userId))
      return { success: true, message: 'Друг удален' }
    }
    // TODO: API call
    return { success: false }
  },

  // Поиск пользователей
  searchUsers: async (query) => {
    if (isDemoMode()) {
      // В реальном приложении это был бы API запрос
      // Здесь возвращаем мок-данные
      const allUsers = readFromStorage('users', [])
      const searchLower = query.toLowerCase()
      return allUsers.filter(
        (u) =>
          u.username?.toLowerCase().includes(searchLower) ||
          u.first_name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower)
      )
    }
    // TODO: API call
    return []
  },
}

export default communityService
