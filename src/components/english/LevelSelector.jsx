'use client'

import ScrollAnimation from '../ScrollAnimation'
import Select from '../Select'
import { ENGLISH_LEVELS } from '../../config/englishCategories'

export default function LevelSelector({ value, onChange, className = '' }) {
  return (
    <ScrollAnimation delay={100}>
      <div className={`mb-8 ${className}`}>
        <Select
          id="level"
          label="Select Level"
          value={value}
          onChange={onChange}
          options={ENGLISH_LEVELS}
          className="max-w-xs"
        />
      </div>
    </ScrollAnimation>
  )
}
