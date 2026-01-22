'use client'

export default function UserAvatar({ user, size = 'md', showOnline = false }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.md
  const initials = user?.first_name?.[0] || user?.username?.[0] || 'U'
  const avatarUrl = user?.avatar_url

  return (
    <div className="relative inline-block">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.username || 'User'}
          className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-md`}
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold flex items-center justify-center border-2 border-white shadow-md ${
          avatarUrl ? 'hidden' : ''
        }`}
      >
        {initials.toUpperCase()}
      </div>
      {showOnline && user?.is_online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  )
}
