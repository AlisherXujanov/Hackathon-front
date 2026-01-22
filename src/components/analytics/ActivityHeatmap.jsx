'use client'

import { useMemo } from 'react'

export default function ActivityHeatmap({ data, year = new Date().getFullYear() }) {
  const heatmapData = useMemo(() => {
    // Группируем данные по неделям
    const weeks = []
    const weekData = {}
    
    data.forEach((item) => {
      const date = new Date(item.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!weekData[weekKey]) {
        weekData[weekKey] = { date: weekKey, days: {} }
      }
      
      const dayKey = date.toISOString().split('T')[0]
      weekData[weekKey].days[dayKey] = item.count
    })
    
    return Object.values(weekData).slice(-52) // Последние 52 недели
  }, [data])

  const getIntensityColor = (count) => {
    if (count === 0) return 'bg-slate-100'
    if (count < 3) return 'bg-green-200'
    if (count < 6) return 'bg-green-400'
    return 'bg-green-600'
  }

  const getTooltipText = (count) => {
    if (count === 0) return 'Нет активности'
    if (count < 3) return `${count} активности`
    if (count < 6) return `${count} активностей`
    return `${count} активностей`
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex gap-1">
          {heatmapData.map((week, weekIndex) => (
            <div key={week.date} className="flex flex-col gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                const date = new Date(week.date)
                date.setDate(date.getDate() + dayIndex)
                const dayKey = date.toISOString().split('T')[0]
                const count = week.days[dayKey] || 0
                
                return (
                  <div
                    key={dayKey}
                    className={`w-3 h-3 rounded ${getIntensityColor(count)} hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer`}
                    title={`${new Date(dayKey).toLocaleDateString('ru-RU')}: ${getTooltipText(count)}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
          <span>Меньше</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-slate-100" />
            <div className="w-3 h-3 rounded bg-green-200" />
            <div className="w-3 h-3 rounded bg-green-400" />
            <div className="w-3 h-3 rounded bg-green-600" />
          </div>
          <span>Больше</span>
        </div>
      </div>
    </div>
  )
}
