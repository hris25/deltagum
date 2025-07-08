'use client'

import React from 'react'
import { motion } from 'framer-motion'

const TestimonialFloatingCandies: React.FC = () => {
  const testimonialElements = [
    { emoji: '⭐', delay: 0, x: '15%', y: '25%' },
    { emoji: '💬', delay: 0.8, x: '85%', y: '20%' },
    { emoji: '👥', delay: 1.6, x: '10%', y: '65%' },
    { emoji: '❤️', delay: 2.4, x: '90%', y: '70%' },
    { emoji: '🏆', delay: 3.2, x: '50%', y: '15%' },
    { emoji: '✨', delay: 4, x: '75%', y: '80%' },
    { emoji: '🎉', delay: 4.8, x: '25%', y: '85%' },
    { emoji: '👍', delay: 5.6, x: '80%', y: '40%' }
  ]

  const floatingCandies = [
    { emoji: '🍓', delay: 1, x: '20%', y: '30%' },
    { emoji: '🫐', delay: 2, x: '70%', y: '25%' },
    { emoji: '🍏', delay: 3, x: '30%', y: '75%' },
    { emoji: '🍭', delay: 4, x: '85%', y: '60%' }
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Testimonial-related icons */}
      {testimonialElements.map((element, index) => (
        <motion.div
          key={`testimonial-${index}`}
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
            opacity: [0, 0.4, 0.1, 0.4],
            scale: [0, 1.3, 0.7, 1],
            rotate: [0, 15, -15, 0],
            y: [-15, 15, -15]
          }}
          transition={{
            duration: 7,
            delay: element.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      {/* Floating candy flavors */}
      {floatingCandies.map((candy, index) => (
        <motion.div
          key={`candy-${index}`}
          className="absolute text-3xl opacity-15"
          style={{
            left: candy.x,
            top: candy.y
          }}
          initial={{ 
            opacity: 0, 
            scale: 0
          }}
          animate={{ 
            opacity: [0, 0.3, 0.15],
            scale: [0, 1.2, 1],
            rotate: [0, 360],
            x: [-20, 20, -20],
            y: [-10, 10, -10]
          }}
          transition={{
            duration: 12,
            delay: candy.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {candy.emoji}
        </motion.div>
      ))}
      
      {/* Large floating review stars */}
      <motion.div
        className="absolute top-1/6 right-1/6 text-5xl opacity-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        ⭐
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/5 left-1/6 text-4xl opacity-12"
        animate={{
          y: [-20, 20, -20],
          rotate: [-10, 10, -10],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        💝
      </motion.div>

      {/* Floating hearts for love */}
      <motion.div
        className="absolute top-1/2 right-1/8 text-2xl opacity-15"
        animate={{
          y: [-30, 0, -30],
          x: [-10, 10, -10],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        💕
      </motion.div>
    </div>
  )
}

export { TestimonialFloatingCandies }
