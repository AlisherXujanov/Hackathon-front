'use client'

import ScrollAnimation from '../ScrollAnimation'
import CustomLevelSelector from './CustomLevelSelector'

export default function CategoryHeader({ icon: Icon, title, description, color, levelSelector }) {
  return (
    <ScrollAnimation>
      <div className="relative mb-6">
        {/* Background Treatment */}
        <div 
          className="absolute inset-0 -mx-4 md:-mx-8 lg:-mx-12 rounded-2xl bg-gradient-to-br from-white via-gray-50/50 to-white backdrop-blur-sm"
          style={{ backgroundImage: 'url(/assets/images/home/1save.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        />
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color} rounded-full`} />
        
        {/* Level Selector - Top Right */}
        {levelSelector && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 z-20">
            <CustomLevelSelector
              value={levelSelector.value}
              onChange={levelSelector.onChange}
              compact={true}
            />
          </div>
        )}
        
        {/* Content Container */}
        <div className="relative px-6 py-4 md:py-6 lg:py-8">
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Icon Container with Enhanced Styling */}
            <div className="relative">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl shadow-primary-500/20 transition-transform duration-300 hover:scale-110 hover:rotate-3`}>
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              {/* Decorative accent */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${color} opacity-30 blur-sm`} />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-200 overflow-visible" style={{ lineHeight: '1.3', paddingBottom: '0.1em' }}>
                {title}
              </h1>
              <div className="flex items-center space-x-3 mb-1">
                <div className={`h-0.5 w-12 bg-gradient-to-r ${color} rounded-full`} />
                <p className="text-base md:text-lg lg:text-xl text-white leading-relaxed max-w-3xl">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  )
}
