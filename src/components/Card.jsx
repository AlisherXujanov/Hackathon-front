'use client'

const Card = ({ 
  children, 
  variant = 'glass', 
  hover = true,
  className = '',
  ...props 
}) => {
  const variants = {
    glass: 'group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300',
    feature: 'group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-md transition-all duration-300',
    stat: 'group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md transition-all duration-300',
    solid: 'group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-md transition-all duration-300',
  }
  
  const hoverStyles = hover 
    ? 'hover:shadow-2xl hover:-translate-y-1' 
    : ''
  
  const classes = `${variants[variant]} ${hoverStyles} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card
