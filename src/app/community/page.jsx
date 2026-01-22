'use client'

import Link from 'next/link'
import Card from '../../components/Card'
import Button from '../../components/Button'
import ScrollAnimation from '../../components/ScrollAnimation'
import ForumCard from '../../components/community/ForumCard'
import GroupCard from '../../components/community/GroupCard'
import { getForums, getGroups } from '../../store/community/communityData'
import { HiUsers, HiChatAlt2, HiUserGroup, HiArrowRight, HiPlus } from 'react-icons/hi'

export default function CommunityPage() {
  const forums = getForums()
  const groups = getGroups().slice(0, 6)

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <ScrollAnimation>
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4">
              Сообщество
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              Общайтесь, делитесь опытом, находите единомышленников и развивайтесь вместе
            </p>
          </div>
        </ScrollAnimation>

        {/* Quick Links */}
        <ScrollAnimation delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link href="/community/forums">
              <Card variant="glass" className="p-6 text-center group hover:shadow-lg transition-all">
                <HiChatAlt2 className="w-12 h-12 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Форумы</h3>
                <p className="text-sm text-slate-600">Обсуждения и вопросы</p>
              </Card>
            </Link>
            <Link href="/community/groups">
              <Card variant="glass" className="p-6 text-center group hover:shadow-lg transition-all">
                <HiUserGroup className="w-12 h-12 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Группы</h3>
                <p className="text-sm text-slate-600">Сообщества по интересам</p>
              </Card>
            </Link>
            <Link href="/community/friends">
              <Card variant="glass" className="p-6 text-center group hover:shadow-lg transition-all">
                <HiUsers className="w-12 h-12 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Друзья</h3>
                <p className="text-sm text-slate-600">Ваши друзья и контакты</p>
              </Card>
            </Link>
          </div>
        </ScrollAnimation>

        {/* Forums Section */}
        <ScrollAnimation delay={200}>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Форумы</h2>
              <Button asChild variant="outline" size="sm" rightIcon={<HiArrowRight />}>
                <Link href="/community/forums">Все форумы</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forums.slice(0, 6).map((forum, index) => (
                <ScrollAnimation key={forum.id} delay={250 + index * 50}>
                  <ForumCard forum={forum} />
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </ScrollAnimation>

        {/* Groups Section */}
        <ScrollAnimation delay={400}>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Популярные группы</h2>
              <Button asChild variant="outline" size="sm" rightIcon={<HiArrowRight />}>
                <Link href="/community/groups">Все группы</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group, index) => (
                <ScrollAnimation key={group.id} delay={450 + index * 50}>
                  <GroupCard group={group} />
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </ScrollAnimation>

        {/* Create Topic CTA */}
        <ScrollAnimation delay={600}>
          <Card variant="glass" className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Создайте свою тему</h3>
                <p className="text-slate-600">Задайте вопрос или поделитесь опытом с сообществом</p>
              </div>
              <Button asChild variant="primary" size="md" leftIcon={<HiPlus />} className="rounded-xl">
                <Link href="/community/create">Создать тему</Link>
              </Button>
            </div>
          </Card>
        </ScrollAnimation>
      </div>
    </main>
  )
}
