'use client'

import { forwardRef } from 'react'

const Select = forwardRef(({ 
  label, 
  error, 
  options = [],
  className = '',
  compact = false,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={props.id} 
          className={`block font-medium mb-2 ${
            compact 
              ? 'text-xs text-white mb-1.5' 
              : 'text-sm text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          block w-full rounded-lg border px-3
          ${compact ? 'py-2 text-sm' : 'py-2.5'}
          ${error 
            ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          }
          text-gray-900 bg-white
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-colors duration-200
          cursor-pointer
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
