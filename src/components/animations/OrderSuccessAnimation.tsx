'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OrderSuccessAnimationProps {
  isVisible: boolean
  onComplete?: () => void
}

const OrderSuccessAnimation: React.FC<OrderSuccessAnimationProps> = ({
  isVisible,
  onComplete
}) => {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCheckmark, setShowCheckmark] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Séquence d'animation
      setTimeout(() => setShowCheckmark(true), 300)
      setTimeout(() => setShowConfetti(true), 600)
      setTimeout(() => {
        setShowConfetti(false)
        onComplete?.()
      }, 3000)
    } else {
      setShowCheckmark(false)
      setShowConfetti(false)
    }
  }, [isVisible, onComplete])

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    emoji: ['🎉', '🎊', '✨', '🌟', '💫', '🎈'][Math.floor(Math.random() * 6)],
    delay: Math.random() * 2,
    x: Math.random() * 100,
    duration: 2 + Math.random() * 2
  }))

  const candyPieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: ['🍓', '🫐', '🍏', '🍭', '🍬'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 1.5,
    x: Math.random() * 100,
    duration: 3 + Math.random() * 2
  }))

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Success Card */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center relative overflow-hidden"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20,
              duration: 0.6 
            }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50" />
            
            {/* Checkmark Animation */}
            <div className="relative z-10">
              <AnimatePresence>
                {showCheckmark && (
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 400, 
                      damping: 15 
                    }}
                  >
                    <motion.svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <motion.h2
                className="text-2xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Commande confirmée !
              </motion.h2>

              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Merci pour votre achat ! Vous allez recevoir un email de confirmation avec les détails de votre commande.
              </motion.p>

              {/* Order Details Preview */}
              <motion.div
                className="bg-gray-50 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <span>📦</span>
                  <span>Livraison estimée : 2-3 jours ouvrés</span>
                </div>
              </motion.div>

              {/* Floating Success Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  className="absolute top-4 right-4 text-2xl"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  ✨
                </motion.div>

                <motion.div
                  className="absolute top-4 left-4 text-2xl"
                  animate={{
                    y: [-5, 5, -5],
                    rotate: [-10, 10, -10]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  🎉
                </motion.div>

                <motion.div
                  className="absolute bottom-4 right-4 text-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  💝
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {confettiPieces.map((piece) => (
                  <motion.div
                    key={`confetti-${piece.id}`}
                    className="absolute text-2xl"
                    style={{ left: `${piece.x}%`, top: '-10%' }}
                    initial={{ 
                      y: -100, 
                      opacity: 0,
                      rotate: 0,
                      scale: 0
                    }}
                    animate={{ 
                      y: window.innerHeight + 100,
                      opacity: [0, 1, 1, 0],
                      rotate: [0, 360, 720],
                      scale: [0, 1, 1, 0]
                    }}
                    transition={{
                      duration: piece.duration,
                      delay: piece.delay,
                      ease: 'easeOut'
                    }}
                  >
                    {piece.emoji}
                  </motion.div>
                ))}

                {candyPieces.map((candy) => (
                  <motion.div
                    key={`candy-${candy.id}`}
                    className="absolute text-3xl"
                    style={{ left: `${candy.x}%`, top: '-10%' }}
                    initial={{ 
                      y: -100, 
                      opacity: 0,
                      rotate: 0,
                      scale: 0
                    }}
                    animate={{ 
                      y: window.innerHeight + 100,
                      opacity: [0, 1, 1, 0],
                      rotate: [0, 180, 360],
                      scale: [0, 1.2, 1, 0],
                      x: [0, Math.random() * 100 - 50, 0]
                    }}
                    transition={{
                      duration: candy.duration,
                      delay: candy.delay,
                      ease: 'easeOut'
                    }}
                  >
                    {candy.emoji}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { OrderSuccessAnimation }
