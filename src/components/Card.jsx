'use client'

const Card = ({ 
  children, 
  variant = 'glass', 
  hover = true,
  className = '',
  ...props 
}) => {
  const variants = {
    glass: 'group relative overflow-hidden rounded-card bg-white/80 backdrop-blur-md border border-app-border shadow-card transition-all duration-300',
    feature: 'group relative overflow-hidden rounded-card bg-white border border-app-border shadow-card transition-all duration-300',
    stat: 'group relative overflow-hidden rounded-card bg-gradient-to-br from-white to-gray-50 border border-app-border shadow-card transition-all duration-300',
    solid: 'group relative overflow-hidden rounded-card bg-white border border-app-border shadow-card transition-all duration-300',
  }
  
  const hoverStyles = hover 
    ? 'hover:shadow-floating hover:-translate-y-0.5' 
    : ''
  
  const classes = `${variants[variant]} ${hoverStyles} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card
