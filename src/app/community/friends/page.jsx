'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Input from '../../../components/Input'
import ScrollAnimation from '../../../components/ScrollAnimation'
import FriendCard from '../../../components/community/FriendCard'
import FriendRequestCard from '../../../components/community/FriendRequestCard'
import { communityService } from '../../../services/communityService'
import { HiArrowLeft, HiUsers, HiUserAdd, HiSearch } from 'react-icons/hi'

export default function FriendsPage() {
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('friends')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [friendsData, requestsData] = await Promise.all([
        communityService.getFriends(),
        communityService.getFriendRequests('received'),
      ])
      setFriends(friendsData)
      setRequests(requestsData)
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFriend = (friendId) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId))
  }

  const handleRespondToRequest = (requestId, status) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId))
    if (status === 'accepted') {
      loadData()
    }
  }

  const filteredFriends = friends.filter((f) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      f.first_name?.toLowerCase().includes(q) ||
      f.last_name?.toLowerCase().includes(q) ||
      f.username?.toLowerCase().includes(q)
    )
  })

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <ScrollAnimation>
          <div className="mb-6">
            <Link href="/community">
              <button className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4 transition-colors">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Назад в Community
              </button>
            </Link>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center shadow-lg">
                <HiUsers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Друзья</h1>
                <p className="text-slate-600">Ваши друзья и запросы в друзья</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Tabs */}
        <ScrollAnimation delay={150}>
          <Card variant="glass" className="p-2 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('friends')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'friends'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Друзья ({friends.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'requests'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Запросы {requests.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {requests.length}
                  </span>
                )}
              </button>
            </div>
          </Card>
        </ScrollAnimation>

        {activeTab === 'friends' && (
          <>
            <ScrollAnimation delay={200}>
              <Card variant="glass" className="p-5 mb-6">
                <Input
                  placeholder="Поиск друзей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<HiSearch className="w-5 h-5" />}
                />
              </Card>
            </ScrollAnimation>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Загрузка друзей...</p>
              </div>
            ) : filteredFriends.length === 0 ? (
              <ScrollAnimation delay={250}>
                <Card variant="glass" className="p-12 text-center">
                  <HiUsers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {searchQuery ? 'Друзья не найдены' : 'У вас пока нет друзей'}
                  </h3>
                  <p className="text-slate-600">
                    {searchQuery ? 'Попробуйте изменить запрос' : 'Найдите пользователей и отправьте запросы в друзья'}
                  </p>
                </Card>
              </ScrollAnimation>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFriends.map((friend, index) => (
                  <ScrollAnimation key={friend.id} delay={250 + index * 50}>
                    <FriendCard friend={friend} onRemove={handleRemoveFriend} />
                  </ScrollAnimation>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Загрузка запросов...</p>
              </div>
            ) : requests.length === 0 ? (
              <ScrollAnimation delay={200}>
                <Card variant="glass" className="p-12 text-center">
                  <HiUserAdd className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Нет запросов</h3>
                  <p className="text-slate-600">У вас пока нет входящих запросов в друзья</p>
                </Card>
              </ScrollAnimation>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requests.map((request, index) => (
                  <ScrollAnimation key={request.id} delay={200 + index * 50}>
                    <FriendRequestCard request={request} onRespond={handleRespondToRequest} />
                  </ScrollAnimation>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
