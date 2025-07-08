"use client";

import { ShuffleCards } from "@/components/ui/shuffle-cards";
import {
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";
import { motion } from "framer-motion";
import React from "react";

const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="testimonials"
      className="py-8 bg-gradient-to-br from-pink-50 to-orange-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial={fadeIn.initial}
          whileInView={fadeIn.animate}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Nos Clients
            </span>
            <br />
            <span className="text-gray-800">Nous Font Confiance</span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Découvrez les témoignages authentiques de nos clients satisfaits
          </motion.p>
        </motion.div>

        {/* Interactive Testimonial Cards */}
        <div className="flex justify-center mb-8">
          <ShuffleCards />
        </div>

        {/* Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div variants={staggerItem} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
              4.9/5
            </div>
            <p className="text-gray-600">Note moyenne</p>
          </motion.div>

          <motion.div variants={staggerItem} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
              500+
            </div>
            <p className="text-gray-600">Avis clients</p>
          </motion.div>

          <motion.div variants={staggerItem} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
              98%
            </div>
            <p className="text-gray-600">Clients satisfaits</p>
          </motion.div>

          <motion.div variants={staggerItem} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
              24h
            </div>
            <p className="text-gray-600">Livraison moyenne</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export { TestimonialsSection };
