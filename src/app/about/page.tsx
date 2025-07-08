"use client";

import { fadeIn, slideUp } from "@/lib/animations";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              À propos de{" "}
              <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                Deltagum
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Découvrez l'histoire et les valeurs qui font de Deltagum une
              marque de confiance dans l'univers du CBD de qualité premium.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={slideUp.initial}
              whileInView={slideUp.animate}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Deltagum est née de la passion pour le bien-être naturel et
                  l'innovation. Fondée par une équipe d'experts en
                  phytothérapie, notre marque s'est donnée pour mission de
                  démocratiser l'accès aux bienfaits du CBD.
                </p>
                <p>
                  Depuis nos débuts, nous nous engageons à proposer des produits
                  CBD de la plus haute qualité, rigoureusement testés et
                  certifiés, pour offrir à nos clients une expérience de
                  bien-être exceptionnelle.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                <span className="text-6xl">🌿</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident chacune de nos actions et décisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔬",
                title: "Qualité Premium",
                description:
                  "Tous nos produits sont rigoureusement testés en laboratoire pour garantir pureté et efficacité.",
              },
              {
                icon: "🌱",
                title: "Naturel & Bio",
                description:
                  "Nous privilégions les ingrédients naturels et biologiques pour respecter votre santé et l'environnement.",
              },
              {
                icon: "🤝",
                title: "Transparence",
                description:
                  "Nous croyons en la transparence totale sur nos processus, ingrédients et méthodes de production.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Composition mise en avant */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={fadeIn.initial}
              whileInView={fadeIn.animate}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                🌿 Composition mise en avant
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-bold mb-4">
                    ✅ Conformité <strong>légale européenne</strong>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    THC &lt; 0,3%
                  </p>
                  <p className="text-gray-600 mt-2">
                    Nos produits respectent strictement la réglementation
                    européenne
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recommandations importantes */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={fadeIn.initial}
              whileInView={fadeIn.animate}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                ⚠️ Recommandations importantes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200 text-center">
                  <div className="text-4xl mb-4">🚫</div>
                  <h3 className="text-xl font-bold text-red-800 mb-3">
                    Interdit sous <strong>traitement médical</strong>
                  </h3>
                  <p className="text-gray-600">
                    Ne pas consommer si vous suivez un traitement médical.
                    Consultez votre médecin.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200 text-center">
                  <div className="text-4xl mb-4">🔞</div>
                  <h3 className="text-xl font-bold text-red-800 mb-3">
                    Réservé aux <strong>adultes</strong>
                  </h3>
                  <p className="text-gray-600">
                    Produit strictement réservé aux personnes majeures (18 ans
                    et plus).
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200 text-center">
                  <div className="text-4xl mb-4">🚗</div>
                  <h3 className="text-xl font-bold text-red-800 mb-3">
                    Ne pas <strong>conduire</strong> après usage
                  </h3>
                  <p className="text-gray-600">
                    Évitez de conduire ou d'utiliser des machines après
                    consommation.
                  </p>
                </div>
              </div>
              <div className="mt-8 bg-yellow-100 border border-yellow-300 rounded-lg p-6 text-center">
                <p className="text-yellow-800 font-medium">
                  <strong>Important :</strong> Ces recommandations sont
                  essentielles pour votre sécurité et celle d'autrui.
                  Respectez-les scrupuleusement.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Engagement Qualité */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={fadeIn.initial}
              whileInView={fadeIn.animate}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Notre Engagement Qualité
              </h2>
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Chaque produit Deltagum passe par un processus de contrôle
                  qualité rigoureux. Nos laboratoires partenaires certifiés
                  analysent systématiquement nos produits pour vérifier leur
                  teneur, l'absence de contaminants et leur conformité aux
                  normes européennes les plus strictes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ✓ Tests en laboratoire
                    </h4>
                    <p className="text-gray-600">
                      Analyses complètes par des laboratoires indépendants
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ✓ Traçabilité complète
                    </h4>
                    <p className="text-gray-600">
                      Suivi de la graine au produit fini
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ✓ Conformité légale européenne
                    </h4>
                    <p className="text-gray-600">
                      THC &lt; 0,3% - Respect strict de la réglementation
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ✓ Qualité premium
                    </h4>
                    <p className="text-gray-600">
                      Ingrédients sélectionnés avec le plus grand soin
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
