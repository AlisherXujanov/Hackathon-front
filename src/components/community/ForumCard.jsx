'use client'

import Link from 'next/link'
import Card from '../Card'
import Badge from '../Badge'
import { HiChatAlt2, HiArrowRight } from 'react-icons/hi'

export default function ForumCard({ forum }) {
  return (
    <Link href={`/community/forums/${forum.id}`}>
      <Card variant="glass" className="p-6 h-full group hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
              style={{ backgroundColor: `${forum.color}20` }}
            >
              {forum.icon}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                {forum.name}
              </h3>
              <p className="text-sm text-slate-600 mt-1">{forum.description}</p>
            </div>
          </div>
          <HiArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <HiChatAlt2 className="w-4 h-4" />
            <span>{forum.topicsCount} тем</span>
          </div>
          <Badge variant="outline" size="sm">
            {forum.postsCount} постов
          </Badge>
        </div>
      </Card>
    </Link>
  )
}
