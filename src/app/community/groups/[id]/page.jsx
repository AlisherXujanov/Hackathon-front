'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '../../../../components/Card'
import Button from '../../../../components/Button'
import Badge from '../../../../components/Badge'
import ScrollAnimation from '../../../../components/ScrollAnimation'
import UserAvatar from '../../../../components/community/UserAvatar'
import { communityService } from '../../../../services/communityService'
import { getGroupById } from '../../../../store/community/communityData'
import { HiArrowLeft, HiUsers, HiChatAlt2, HiCheckCircle } from 'react-icons/hi'

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id
  const [group, setGroup] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    loadGroup()
  }, [groupId])

  const loadGroup = async () => {
    try {
      setIsLoading(true)
      const data = await communityService.getGroup(groupId)
      setGroup(data)
      setIsMember(communityService.isGroupMember(groupId))
    } catch (error) {
      console.error('Ошибка при загрузке группы:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleMembership = async () => {
    try {
      if (isMember) {
        await communityService.leaveGroup(groupId)
      } else {
        await communityService.joinGroup(groupId)
      }
      await loadGroup()
    } catch (error) {
      console.error('Ошибка:', error)
      alert(error.message || 'Произошла ошибка')
    }
  }

  if (isLoading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Загрузка группы...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!group) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Группа не найдена</h1>
            <p className="text-slate-600 mb-6">Проверьте ссылку</p>
            <Button asChild variant="primary">
              <Link href="/community/groups">К списку групп</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <ScrollAnimation>
          <div className="mb-6">
            <Link href="/community/groups">
              <button className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Назад к группам
              </button>
            </Link>
          </div>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto">
          <ScrollAnimation delay={100}>
            <Card variant="glass" className="p-6 md:p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    {group.icon}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{group.name}</h1>
                    <p className="text-slate-600">{group.description}</p>
                  </div>
                </div>
                <Button
                  variant={isMember ? 'outline' : 'primary'}
                  size="md"
                  onClick={handleToggleMembership}
                  leftIcon={isMember ? <HiCheckCircle /> : <HiUsers />}
                  className="rounded-xl"
                >
                  {isMember ? 'Вы в группе' : 'Присоединиться'}
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <HiUsers className="w-5 h-5" />
                  <span className="font-semibold">{group.membersCount} участников</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiChatAlt2 className="w-5 h-5" />
                  <span>{group.postsCount} постов</span>
                </div>
                <Badge variant="outline" size="sm">
                  {group.category}
                </Badge>
              </div>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-6">
              <h2 className="text-xl font-extrabold text-slate-900 mb-4">Участники</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: Math.min(group.membersCount, 12) }).map((_, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-2" />
                    <div className="text-xs text-slate-600">Участник {idx + 1}</div>
                  </div>
                ))}
              </div>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
