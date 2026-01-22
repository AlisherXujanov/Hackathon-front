'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function LineChart({ data, dataKey, name, color = '#3B82F6', height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          stroke="#6B7280"
          fontSize={12}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
          }}
        />
        <YAxis stroke="#6B7280" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          labelFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          name={name}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
