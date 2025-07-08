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
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Professionnels &{" "}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                Revendeurs
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Prospection <strong>B2B</strong> : boutiques CBD, vapes, etc.
              Bénéficiez de <strong>tarifs spéciaux</strong> pour les
              détaillants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tarifs spéciaux pour détaillants */}
      <section className="py-16 bg-white">
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
      </section>

      {/* Formulaire de contact pour achat en gros */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                📋 Formulaire de contact pour achat en gros
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Contactez-nous pour obtenir vos tarifs préférentiels et
                développer votre activité.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre entreprise"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez vos besoins, volumes souhaités, questions..."
                  />
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="px-8"
                  >
                    📧 Envoyer ma demande
                  </Button>
                  <p className="text-sm text-gray-500 mt-3">
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
