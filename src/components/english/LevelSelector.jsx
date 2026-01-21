'use client'

import ScrollAnimation from '../ScrollAnimation'
import Select from '../Select'
import { ENGLISH_LEVELS } from '../../config/englishCategories'

export default function LevelSelector({ value, onChange, className = '', compact = false }) {
  const containerClass = className.includes('mb-0') ? className : `mb-4 ${className}`
  
  return (
    <ScrollAnimation delay={100}>
      <div className={containerClass}>
        {compact ? (
          <div className="bg-white/5 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-xl border border-white/20">
            <Select
              id="level"
              label="Select Level"
              value={value}
              onChange={onChange}
              options={ENGLISH_LEVELS}
              className="max-w-xs"
              compact={true}
            />
          </div>
        ) : (
          <Select
            id="level"
            label="Select Level"
            value={value}
            onChange={onChange}
            options={ENGLISH_LEVELS}
            className="max-w-xs"
          />
        )}
      </div>
    </ScrollAnimation>
  )
}
