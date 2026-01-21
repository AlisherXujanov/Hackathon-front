'use client'

import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  leftIcon,
  rightIcon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            block w-full rounded-lg border
            ${error 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
            ${leftIcon ? 'pl-12' : 'pl-3'}
            ${rightIcon ? 'pr-12' : 'pr-3'}
            py-2.5 text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-colors duration-200
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-auto">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
