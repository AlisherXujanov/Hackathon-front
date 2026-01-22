'use client'

export default function StatsCard({ label, value, icon: Icon, color = 'primary', trend, trendValue }) {
  const colorClasses = {
    primary: 'from-blue-500 to-blue-600',
    success: 'from-green-500 to-green-600',
    accent: 'from-purple-500 to-purple-600',
    warning: 'from-yellow-500 to-yellow-600',
    error: 'from-red-500 to-red-600',
  }

  const gradient = colorClasses[color] || colorClasses.primary

  return (
    <div className="bg-white rounded-2xl p-6 border border-app-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'}
            {trendValue && <span>{trendValue}%</span>}
          </div>
        )}
      </div>
      <div className="text-sm font-medium text-slate-600 mb-1">{label}</div>
      <div className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
        {value}
      </div>
    </div>
  )
}
