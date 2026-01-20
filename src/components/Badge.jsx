'use client'

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700',
    accent: 'bg-accent-100 text-accent-700',
    secondary: 'bg-secondary-100 text-secondary-700',
    success: 'bg-success-50 text-success-600',
    error: 'bg-error-50 text-error-600',
    warning: 'bg-warning-50 text-warning-600',
    info: 'bg-info-50 text-info-600',
    gray: 'bg-gray-100 text-gray-700',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }
  
  const classes = `inline-flex items-center rounded-full font-bold uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}

export default Badge
