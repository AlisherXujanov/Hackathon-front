'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Textarea from '../../../components/Textarea'
import Select from '../../../components/Select'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { communityService } from '../../../services/communityService'
import { getForums } from '../../../store/community/communityData'
import { HiArrowLeft, HiPlus } from 'react-icons/hi'

export default function CreateTopicPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const forumIdFromUrl = searchParams.get('forum')
  
  const [forumId, setForumId] = useState(forumIdFromUrl || '')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const forums = useMemo(() => getForums(), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!forumId || !title.trim() || !content.trim()) {
      alert('Заполните все обязательные поля')
      return
    }

    setIsSubmitting(true)
    try {
      const topic = await communityService.createTopic(forumId, {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      })
      router.push(`/community/forums/${forumId}/${topic.id}`)
    } catch (error) {
      console.error('Ошибка при создании темы:', error)
      alert(error.message || 'Произошла ошибка при создании темы')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <div className="max-w-3xl mx-auto">
          <ScrollAnimation>
            <div className="mb-6">
              <Link href={forumId ? `/community/forums/${forumId}` : '/community/forums'}>
                <button className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                  <HiArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </button>
              </Link>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={100}>
            <Card variant="glass" className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Создать тему</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Select
                  label="Форум"
                  value={forumId}
                  onChange={(e) => setForumId(e.target.value)}
                  options={forums.map((f) => ({ value: f.id, label: f.name }))}
                  required
                />

                <Input
                  label="Заголовок"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите заголовок темы"
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Содержание
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Опишите вашу тему подробно..."
                    rows={10}
                    required
                  />
                </div>

                <Input
                  label="Теги (через запятую)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="например: вопрос, помощь, python"
                />

                <div className="flex items-center gap-3 pt-4 border-t border-app-border">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    leftIcon={<HiPlus />}
                    className="rounded-xl"
                  >
                    Создать тему
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="rounded-xl"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
