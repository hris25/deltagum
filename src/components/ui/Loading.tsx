'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'candy'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  text?: string
  fullScreen?: boolean
  className?: string
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  fullScreen = false,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'text-pink-500',
    secondary: 'text-purple-500',
    white: 'text-white',
    gray: 'text-gray-500'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const containerClasses = cn(
    'flex flex-col items-center justify-center',
    fullScreen && 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50',
    className
  )

  const renderSpinner = () => (
    <motion.div
      className={cn(
        'border-2 border-current border-t-transparent rounded-full',
        sizeClasses[size],
        colorClasses[color]
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            'rounded-full',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5',
            colorClasses[color] === 'text-white' ? 'bg-white' : 
            colorClasses[color] === 'text-gray-500' ? 'bg-gray-500' :
            colorClasses[color] === 'text-purple-500' ? 'bg-purple-500' : 'bg-pink-500'
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <motion.div
      className={cn(
        'rounded-full',
        sizeClasses[size],
        colorClasses[color] === 'text-white' ? 'bg-white' : 
        colorClasses[color] === 'text-gray-500' ? 'bg-gray-500' :
        colorClasses[color] === 'text-purple-500' ? 'bg-purple-500' : 'bg-pink-500'
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  )

  const renderCandy = () => (
    <motion.div
      className={cn(
        'text-4xl',
        size === 'sm' && 'text-2xl',
        size === 'md' && 'text-4xl',
        size === 'lg' && 'text-6xl',
        size === 'xl' && 'text-8xl'
      )}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      🍭
    </motion.div>
  )

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      case 'candy':
        return renderCandy()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className={containerClasses}>
      {renderLoader()}
      {text && (
        <motion.p
          className={cn(
            'mt-3 font-medium',
            textSizeClasses[size],
            colorClasses[color]
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Composant de loading pour les pages entières
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Chargement...' }) => (
  <Loading
    variant="candy"
    size="lg"
    text={text}
    fullScreen
  />
)

// Composant de loading pour les boutons
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => (
  <Loading
    variant="spinner"
    size={size}
    color="white"
  />
)

export { Loading }
