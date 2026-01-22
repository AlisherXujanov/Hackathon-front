'use client'

import { useState } from 'react'
import { HiThumbUp } from 'react-icons/hi'

export default function LikeButton({ 
  isLiked: initialLiked, 
  likes: initialLikes, 
  onLike,
  size = 'md',
  disabled = false,
}) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likes, setLikes] = useState(initialLikes)

  const handleClick = async () => {
    if (disabled) return
    
    const newLiked = !isLiked
    const newLikes = newLiked ? likes + 1 : likes - 1
    
    setIsLiked(newLiked)
    setLikes(newLikes)
    
    if (onLike) {
      try {
        await onLike()
      } catch (error) {
        // Откатываем изменения при ошибке
        setIsLiked(!newLiked)
        setLikes(likes)
      }
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all
        ${isLiked
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <HiThumbUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      <span className="font-semibold">{likes}</span>
    </button>
  )
}
