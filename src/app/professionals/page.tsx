"use client";

import { Button } from "@/components/ui";
import { fadeIn } from "@/lib/animations";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ProfessionalsPage() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du formulaire
    console.log("Formulaire soumis:", formData);
    alert("Votre demande a été envoyée ! Nous vous recontacterons sous 48h.");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Professionnels &{" "}
              <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                Revendeurs
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-2 sm:px-0">
              Prospection <strong>B2B</strong> : boutiques CBD, vapes, etc.
              Bénéficiez de <strong>tarifs spéciaux</strong> pour les
              détaillants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tarifs spéciaux pour détaillants */}
      {/*<section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              💰 Tarifs spéciaux pour les détaillants
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bénéficiez de conditions préférentielles pour développer votre
              activité.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              className="bg-blue-50 rounded-xl p-6 text-center border-2 border-blue-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Boutiques CBD
              </h3>
              <p className="text-gray-600 mb-4">
                Tarifs préférentiels pour les boutiques spécialisées
              </p>
              <div className="text-2xl font-bold text-blue-600">-20%</div>
            </motion.div>

            <motion.div
              className="bg-purple-50 rounded-xl p-6 text-center border-2 border-purple-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl mb-4">💨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Vape Shops
              </h3>
              <p className="text-gray-600 mb-4">
                Conditions spéciales pour les magasins de vape
              </p>
              <div className="text-2xl font-bold text-purple-600">-25%</div>
            </motion.div>

            <motion.div
              className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Achat en gros
              </h3>
              <p className="text-gray-600 mb-4">
                Remises dégressives selon les volumes
              </p>
              <div className="text-2xl font-bold text-green-600">
                Jusqu'à -30%
              </div>
            </motion.div>
          </div>
        </div>
      </section>*/}

      {/* Formulaire de contact pour achat en gros */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                📋 Formulaire de contact pour achat en gros
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0">
                Contactez-nous pour obtenir vos tarifs préférentiels et
                développer votre activité.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                    >
                      Nom de l'entreprise *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="Votre entreprise"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                    >
                      Nom et prénom *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-gray-900 placeholder-gray-400"
                      placeholder="contact@entreprise.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-gray-900 placeholder-gray-400"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Type d'activité *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    required
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-gray-900"
                  >
                    <option value="">Sélectionnez votre activité</option>
                    <option value="boutique-cbd">Boutique CBD</option>
                    <option value="vape-shop">Vape Shop</option>
                    <option value="grossiste">Grossiste</option>
                    <option value="pharmacie">Pharmacie</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message / Besoins spécifiques
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-gray-900 placeholder-gray-400"
                    placeholder="Décrivez vos besoins, volumes souhaités, questions..."
                  />
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base"
                  >
                    📧 Envoyer ma demande
                  </Button>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                    Nous vous recontacterons sous 48h avec une offre
                    personnalisée
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
