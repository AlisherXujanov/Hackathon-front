'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ProgressComparison({ currentData, previousData, height = 300 }) {
  const comparisonData = currentData.map((current, index) => {
    const previous = previousData[index]
    return {
      period: current.week || current.name,
      current: current.hours || current.value,
      previous: previous?.hours || previous?.value || 0,
      improvement: previous 
        ? Math.round(((current.hours || current.value) - (previous.hours || previous.value)) / (previous.hours || previous.value) * 100)
        : 0,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="period" 
          stroke="#6B7280"
          fontSize={12}
        />
        <YAxis stroke="#6B7280" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
        />
        <Legend />
        <Bar dataKey="previous" name="Предыдущий период" fill="#94A3B8" radius={[8, 8, 0, 0]} />
        <Bar dataKey="current" name="Текущий период" fill="#3B82F6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
