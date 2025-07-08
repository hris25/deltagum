'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent } from '@/components/ui'
import { fadeIn, slideUp } from '@/lib/animations'

const EmptyCart: React.FC = () => {
  const handleStartShopping = () => {
    const productsSection = document.getElementById('products')
    productsSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      exit={fadeIn.initial}
      transition={{ duration: 0.5 }}
    >
      <Card className="text-center">
        <CardContent className="py-16 px-8">
          {/* Empty Cart Animation */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 20,
              delay: 0.2 
            }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ 
                rotate: [0, -10, 10, -5, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              🛒
            </motion.div>
          </motion.div>

          {/* Empty State Content */}
          <motion.div
            initial={slideUp.initial}
            animate={slideUp.animate}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Votre panier est vide
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Il semble que vous n'ayez pas encore ajouté de délicieux bonbons à votre panier. 
              Découvrez nos créations artisanales aux saveurs uniques !
            </p>
          </motion.div>

          {/* Floating Candies */}
          <motion.div
            className="relative mb-8 h-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {['🍓', '🫐', '🍏', '🍭', '🍬'].map((emoji, index) => (
              <motion.div
                key={emoji}
                className="absolute text-2xl"
                style={{
                  left: `${20 + index * 15}%`,
                  top: '50%'
                }}
                animate={{
                  y: [-10, 10, -10],
                  rotate: [-5, 5, -5],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut'
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartShopping}
              className="text-lg px-8 py-4"
            >
              <span className="mr-2">🍭</span>
              Découvrir nos bonbons
            </Button>
          </motion.div>

          {/* Benefits */}
          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-semibold text-gray-800 mb-1">Artisanal</h4>
              <p className="text-sm text-gray-600">Créations uniques faites main</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🌱</div>
              <h4 className="font-semibold text-gray-800 mb-1">Naturel</h4>
              <p className="text-sm text-gray-600">Ingrédients de qualité premium</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">💝</div>
              <h4 className="font-semibold text-gray-800 mb-1">Parfait cadeau</h4>
              <p className="text-sm text-gray-600">Emballage soigné inclus</p>
            </div>
          </motion.div>

          {/* Popular Flavors Preview */}
          <motion.div
            className="mt-12 p-6 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h4 className="font-semibold text-gray-800 mb-3">Nos saveurs populaires</h4>
            <div className="flex justify-center space-x-6">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-2xl mb-1">🍓</div>
                <span className="text-sm text-pink-600 font-medium">Fraise</span>
              </motion.div>
              
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-2xl mb-1">🫐</div>
                <span className="text-sm text-blue-600 font-medium">Myrtille</span>
              </motion.div>
              
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-2xl mb-1">🍏</div>
                <span className="text-sm text-green-600 font-medium">Pomme</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <blockquote className="text-sm text-gray-600 italic">
              "Des bonbons qui éveillent vraiment les sens ! 
              La qualité artisanale se ressent à chaque bouchée."
            </blockquote>
            <cite className="text-xs text-gray-500 mt-2 block">
              - Marie, cliente satisfaite ⭐⭐⭐⭐⭐
            </cite>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { EmptyCart }
