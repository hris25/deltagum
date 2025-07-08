"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui";
import { FAQFloatingCandies } from "@/components/animations";
import {
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "shipping" | "products" | "payment";
  icon: string;
}

const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<string | null>("1");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "Quels sont les ingrédients utilisés dans vos bonbons ?",
      answer:
        "Nos bonbons sont fabriqués avec des ingrédients naturels de première qualité : sucre de canne, sirop de glucose, arômes naturels de fruits (fraise, myrtille, pomme), colorants naturels, et gélatine. Nous n'utilisons aucun conservateur artificiel ni additif chimique.",
      category: "products",
      icon: "🌱",
    },
    {
      id: "2",
      question: "Combien de temps prend la livraison ?",
      answer:
        "Nous proposons deux options de livraison : standard (gratuite, 3-5 jours ouvrés) et express (4,99€, 24-48h). Toutes les commandes passées avant 14h sont expédiées le jour même. Vous recevrez un email de suivi avec le numéro de tracking.",
      category: "shipping",
      icon: "🚚",
    },
    {
      id: "3",
      question: "Vos bonbons conviennent-ils aux végétariens ?",
      answer:
        "Nos bonbons contiennent de la gélatine d'origine animale et ne conviennent donc pas aux végétariens. Nous travaillons actuellement sur une gamme végane avec de la pectine de fruits qui sera disponible prochainement.",
      category: "products",
      icon: "🥕",
    },
  ];

  const categories = [
    { id: "all", name: "Toutes", icon: "📋" },
    { id: "general", name: "Général", icon: "❓" },
    { id: "products", name: "Produits", icon: "🍭" },
    { id: "shipping", name: "Livraison", icon: "📦" },
    { id: "payment", name: "Paiement", icon: "💰" },
  ];

  const filteredFAQs =
    selectedCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === selectedCategory);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <FAQFloatingCandies />

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
              Questions
            </span>
            <br />
            <span className="text-gray-800">Fréquentes</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Trouvez rapidement les réponses à vos questions sur nos produits, la
            livraison, et nos services.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-6 py-3 rounded-full font-medium transition-all duration-300
                ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <AnimatePresence>
              {filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  variants={staggerItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <motion.button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-inset"
                      whileHover={{
                        backgroundColor: "rgba(249, 250, 251, 0.5)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">{faq.icon}</span>
                          <h3 className="text-lg font-semibold text-gray-800 pr-4">
                            {faq.question}
                          </h3>
                        </div>

                        <motion.div
                          animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <CardContent className="px-6 pb-6 pt-0">
                            <div className="pl-12">
                              <motion.p
                                className="text-gray-600 leading-relaxed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                {faq.answer}
                              </motion.p>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Contact Support */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="text-gray-600 mb-6">
              Notre équipe support est là pour vous aider ! Contactez-nous et
              nous vous répondrons dans les plus brefs délais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  contactSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">💬</span>
                Nous contacter
              </motion.button>

              <motion.a
                href="mailto:support@deltagum.com"
                className="border-2 border-pink-500 text-pink-500 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">📧</span>
                support@deltagum.com
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { FAQSection };
