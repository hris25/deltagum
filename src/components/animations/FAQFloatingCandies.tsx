'use client'

import React from 'react'
import { motion } from 'framer-motion'

const FAQFloatingCandies: React.FC = () => {
  const faqElements = [
    { emoji: '❓', delay: 0, x: '12%', y: '22%' },
    { emoji: '💡', delay: 0.7, x: '88%', y: '18%' },
    { emoji: '📋', delay: 1.4, x: '15%', y: '68%' },
    { emoji: '✅', delay: 2.1, x: '85%', y: '72%' },
    { emoji: '🔍', delay: 2.8, x: '45%', y: '12%' },
    { emoji: '📚', delay: 3.5, x: '92%', y: '45%' },
    { emoji: '🎯', delay: 4.2, x: '8%', y: '52%' },
    { emoji: '💬', delay: 4.9, x: '78%', y: '28%' }
  ]

  const helpIcons = [
    { emoji: '🤝', delay: 1.5, x: '25%', y: '35%' },
    { emoji: '📞', delay: 3, x: '65%', y: '25%' },
    { emoji: '📧', delay: 4.5, x: '35%', y: '78%' },
    { emoji: '⚡', delay: 6, x: '75%', y: '65%' }
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* FAQ-related icons */}
      {faqElements.map((element, index) => (
        <motion.div
          key={`faq-${index}`}
          className="absolute text-2xl opacity-20"
          style={{
            left: element.x,
            top: element.y
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: 0
          }}
          animate={{ 
            opacity: [0, 0.35, 0.1, 0.35],
            scale: [0, 1.2, 0.8, 1],
            rotate: [0, 20, -20, 0],
            y: [-12, 12, -12]
          }}
          transition={{
            duration: 8,
            delay: element.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      {/* Help and support icons */}
      {helpIcons.map((icon, index) => (
        <motion.div
          key={`help-${index}`}
          className="absolute text-3xl opacity-15"
          style={{
            left: icon.x,
            top: icon.y
          }}
          initial={{ 
            opacity: 0, 
            scale: 0
          }}
          animate={{ 
            opacity: [0, 0.25, 0.15],
            scale: [0, 1.3, 1],
            rotate: [0, 180, 360],
            x: [-15, 15, -15]
          }}
          transition={{
            duration: 10,
            delay: icon.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {icon.emoji}
        </motion.div>
      ))}
      
      {/* Large floating question mark */}
      <motion.div
        className="absolute top-1/5 right-1/5 text-6xl opacity-8"
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        ❓
      </motion.div>
      
      {/* Floating lightbulb for ideas */}
      <motion.div
        className="absolute bottom-1/4 left-1/5 text-4xl opacity-12"
        animate={{
          y: [-25, 25, -25],
          rotate: [-8, 8, -8],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        💡
      </motion.div>

      {/* Floating search icon */}
      <motion.div
        className="absolute top-1/3 left-1/8 text-3xl opacity-12"
        animate={{
          x: [-20, 20, -20],
          y: [-10, 10, -10],
          rotate: [0, 360],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        🔍
      </motion.div>

      {/* Floating checkmark for solutions */}
      <motion.div
        className="absolute bottom-1/3 right-1/8 text-3xl opacity-15"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        ✅
      </motion.div>
    </div>
  )
}

export { FAQFloatingCandies }
