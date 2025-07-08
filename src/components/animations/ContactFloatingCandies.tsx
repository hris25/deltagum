'use client'

import React from 'react'
import { motion } from 'framer-motion'

const ContactFloatingCandies: React.FC = () => {
  const contactElements = [
    { emoji: '📧', delay: 0, x: '18%', y: '25%' },
    { emoji: '📞', delay: 0.6, x: '82%', y: '20%' },
    { emoji: '💬', delay: 1.2, x: '15%', y: '65%' },
    { emoji: '📍', delay: 1.8, x: '85%', y: '70%' },
    { emoji: '⏰', delay: 2.4, x: '50%', y: '15%' },
    { emoji: '📱', delay: 3, x: '90%', y: '45%' },
    { emoji: '✉️', delay: 3.6, x: '10%', y: '50%' },
    { emoji: '🌐', delay: 4.2, x: '75%', y: '30%' }
  ]

  const socialElements = [
    { emoji: '📘', delay: 1, x: '25%', y: '35%' },
    { emoji: '📷', delay: 2, x: '70%', y: '25%' },
    { emoji: '🐦', delay: 3, x: '30%', y: '75%' },
    { emoji: '📺', delay: 4, x: '80%', y: '60%' }
  ]

  const supportElements = [
    { emoji: '🤝', delay: 2.5, x: '40%', y: '40%' },
    { emoji: '💝', delay: 4.5, x: '60%', y: '55%' },
    { emoji: '⚡', delay: 6.5, x: '20%', y: '80%' },
    { emoji: '🎯', delay: 8.5, x: '85%', y: '85%' }
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Contact method icons */}
      {contactElements.map((element, index) => (
        <motion.div
          key={`contact-${index}`}
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
            scale: [0, 1.2, 0.8, 1],
            rotate: [0, 25, -25, 0],
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

      {/* Social media icons */}
      {socialElements.map((social, index) => (
        <motion.div
          key={`social-${index}`}
          className="absolute text-3xl opacity-15"
          style={{
            left: social.x,
            top: social.y
          }}
          initial={{ 
            opacity: 0, 
            scale: 0
          }}
          animate={{ 
            opacity: [0, 0.3, 0.15],
            scale: [0, 1.3, 1],
            rotate: [0, 360],
            x: [-20, 20, -20]
          }}
          transition={{
            duration: 11,
            delay: social.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {social.emoji}
        </motion.div>
      ))}

      {/* Support and help icons */}
      {supportElements.map((support, index) => (
        <motion.div
          key={`support-${index}`}
          className="absolute text-2xl opacity-18"
          style={{
            left: support.x,
            top: support.y
          }}
          initial={{ 
            opacity: 0, 
            scale: 0
          }}
          animate={{ 
            opacity: [0, 0.35, 0.18],
            scale: [0, 1.1, 1],
            rotate: [0, 15, -15, 0],
            y: [-10, 10, -10]
          }}
          transition={{
            duration: 9,
            delay: support.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {support.emoji}
        </motion.div>
      ))}
      
      {/* Large floating email icon */}
      <motion.div
        className="absolute top-1/6 right-1/6 text-5xl opacity-10"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.18, 0.1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        📧
      </motion.div>
      
      {/* Floating phone icon */}
      <motion.div
        className="absolute bottom-1/4 left-1/6 text-4xl opacity-12"
        animate={{
          y: [-20, 20, -20],
          rotate: [-12, 12, -12],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        📞
      </motion.div>

      {/* Floating heart for customer care */}
      <motion.div
        className="absolute top-1/2 right-1/8 text-3xl opacity-15"
        animate={{
          y: [-25, 0, -25],
          x: [-8, 8, -8],
          scale: [0.9, 1.2, 0.9]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        💖
      </motion.div>

      {/* Floating message bubble */}
      <motion.div
        className="absolute top-1/3 left-1/10 text-3xl opacity-12"
        animate={{
          x: [-15, 15, -15],
          y: [-8, 8, -8],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        💬
      </motion.div>

      {/* Floating handshake for support */}
      <motion.div
        className="absolute bottom-1/3 right-1/7 text-3xl opacity-14"
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 8, -8, 0],
          opacity: [0.14, 0.22, 0.14]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        🤝
      </motion.div>
    </div>
  )
}

export { ContactFloatingCandies }
