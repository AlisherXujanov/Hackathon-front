'use client'

import { forwardRef } from 'react'
import Link from 'next/link'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  leftIcon,
  rightIcon,
  asChild = false,
  href,
  className = '',
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 text-white shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5 active:scale-95 focus:ring-primary-500',
    secondary: 'bg-transparent border-2 border-primary-600/20 text-primary-600 hover:border-primary-600 hover:bg-primary-50 active:scale-95 focus:ring-primary-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:scale-95 focus:ring-gray-500',
    accent: 'bg-accent-600 text-white shadow-lg shadow-accent-600/20 hover:bg-accent-700 hover:shadow-xl hover:shadow-accent-600/30 hover:-translate-y-0.5 active:scale-95 focus:ring-accent-500',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  }
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
  
  const content = isLoading ? (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </>
  ) : (
    <>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </>
  )

  if (asChild && href) {
    return (
      <Link
        href={href}
        className={classes}
        {...props}
      >
        {content}
      </Link>
    )
  }

  if (href && !asChild) {
    return (
      <Link
        href={href}
        className={classes}
        {...props}
      >
        {content}
      </Link>
    )
  }
  
  return (
    <button
      ref={ref}
      className={classes}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {content}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
