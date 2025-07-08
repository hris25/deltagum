"use client";

import { TestimonialFloatingCandies } from "@/components/animations";
import { Badge, Card, CardContent } from "@/components/ui";
import {
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
  verified: boolean;
  favoriteProduct: string;
}

const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Marie Dubois",
      location: "Paris",
      rating: 5,
      comment:
        "Deltagum m'aide énormément à gérer mon stress quotidien. La saveur fraise est délicieuse et l'effet relaxant se fait sentir rapidement. Parfait après une journée difficile !",
      avatar: "👩‍🦰",
      date: "2024-01-15",
      verified: true,
      favoriteProduct: "Fraise",
    },
    {
      id: "2",
      name: "Pierre Martin",
      location: "Lyon",
      rating: 5,
      comment:
        "J'ai découvert Deltagum CBD pour mes problèmes de sommeil. Les délices à la myrtille m'aident à me détendre le soir. Qualité exceptionnelle et effet naturel.",
      avatar: "👨‍💼",
      date: "2024-01-12",
      verified: true,
      favoriteProduct: "Myrtille",
    },
    {
      id: "3",
      name: "Sophie Leroy",
      location: "Marseille",
      rating: 5,
      comment:
        "Excellente alternative naturelle pour la relaxation ! Les délices CBD saveur pomme sont parfaits pour décompresser. Goût authentique et effet apaisant garanti.",
      avatar: "👩‍🎨",
      date: "2024-01-10",
      verified: true,
      favoriteProduct: "Pomme",
    },
    {
      id: "4",
      name: "Thomas Rousseau",
      location: "Toulouse",
      rating: 5,
      comment:
        "En tant que professionnel du bien-être, je recommande Deltagum. Produit CBD de qualité premium, dosage parfait et saveurs naturelles remarquables.",
      avatar: "👨‍🍳",
      date: "2024-01-08",
      verified: true,
      favoriteProduct: "Fraise",
    },
    {
      id: "5",
      name: "Emma Moreau",
      location: "Bordeaux",
      rating: 5,
      comment:
        "Service client très professionnel ! Ils m'ont bien expliqué les effets du CBD et conseillé le bon dosage. Produit efficace pour la détente et le bien-être.",
      avatar: "👩‍💻",
      date: "2024-01-05",
      verified: true,
      favoriteProduct: "Myrtille",
    },
  ];

  // Auto-rotation des témoignages
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        ⭐
      </motion.span>
    ));
  };

  const flavorEmojis = {
    Fraise: "🍓",
    Myrtille: "🫐",
    Pomme: "🍏",
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-pink-50 to-orange-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <TestimonialFloatingCandies />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
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
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Découvrez ce que pensent nos clients de nos créations artisanales.
            Chaque avis compte et nous motive à toujours mieux faire !
          </motion.p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-8 md:p-12 text-center">
                  {/* Avatar */}
                  <motion.div
                    className="text-6xl mb-6"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {testimonials[currentTestimonial].avatar}
                  </motion.div>

                  {/* Rating */}
                  <div className="flex justify-center mb-6">
                    {renderStars(testimonials[currentTestimonial].rating)}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-lg md:text-xl text-gray-700 mb-8 italic leading-relaxed">
                    "{testimonials[currentTestimonial].comment}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
                    <div className="text-center md:text-left">
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <p className="text-gray-600">
                        {testimonials[currentTestimonial].location}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {testimonials[currentTestimonial].verified && (
                        <Badge variant="success" size="sm">
                          ✓ Vérifié
                        </Badge>
                      )}
                      <Badge variant="secondary" size="sm">
                        {
                          flavorEmojis[
                            testimonials[currentTestimonial]
                              .favoriteProduct as keyof typeof flavorEmojis
                          ]
                        }
                        {testimonials[currentTestimonial].favoriteProduct}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-3 mb-12">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentTestimonial(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? "bg-pink-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Statistics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
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

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Rejoignez nos clients satisfaits !
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez pourquoi tant de personnes choisissent Deltagum pour leurs
            moments gourmands.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => {
                const productsSection = document.getElementById("products");
                productsSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">🌿</span>
              Découvrir nos délices CBD
            </motion.button>

            <motion.button
              onClick={() => {
                const contactSection = document.getElementById("contact");
                contactSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">💬</span>
              Nous contacter
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { TestimonialsSection };
