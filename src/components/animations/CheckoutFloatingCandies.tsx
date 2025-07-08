'use client'

import React from 'react'
import { motion } from 'framer-motion'

const CheckoutFloatingCandies: React.FC = () => {
  const candies = [
    { emoji: '💳', delay: 0, x: '10%', y: '20%' },
    { emoji: '🔒', delay: 0.5, x: '85%', y: '15%' },
    { emoji: '📦', delay: 1, x: '15%', y: '70%' },
    { emoji: '✅', delay: 1.5, x: '80%', y: '75%' },
    { emoji: '🛒', delay: 2, x: '50%', y: '10%' },
    { emoji: '💰', delay: 2.5, x: '90%', y: '45%' },
    { emoji: '🎁', delay: 3, x: '5%', y: '50%' },
    { emoji: '📱', delay: 3.5, x: '75%', y: '30%' }
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {candies.map((candy, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl opacity-20"
          style={{
            left: candy.x,
            top: candy.y
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: 0
          }}
          animate={{ 
            opacity: [0, 0.3, 0.1, 0.3],
            scale: [0, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
            y: [-20, 20, -20]
          }}
          transition={{
            duration: 8,
            delay: candy.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {candy.emoji}
        </motion.div>
      ))}
      
      {/* Floating payment security icons */}
      <motion.div
        className="absolute top-1/4 right-1/4 text-4xl opacity-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        🔐
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/3 left-1/4 text-3xl opacity-15"
        animate={{
          y: [-10, 10, -10],
          rotate: [-5, 5, -5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        💎
      </motion.div>
    </div>
  )
}

export { CheckoutFloatingCandies }
