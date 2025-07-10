"use client";

import { fadeIn, slideUp } from "@/lib/animations";
import { motion } from "framer-motion";

export default function AboutPage() {
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
              À propos de{" "}
              <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                Deltagum
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-2 sm:px-0">
              Découvrez l'histoire et les valeurs qui font de Deltagum une
              marque de confiance dans l'univers des produits premium à base de
              Delta-9 THC.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={slideUp.initial}
              whileInView={slideUp.animate}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Produits Delta-9 THC – Objets de collection conformes à la
                législation
              </h2>

              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                  <p className="text-gray-700 leading-relaxed">
                    Bienvenue dans la catégorie{" "}
                    <strong>Delta-9 THC de Deltagum</strong>, dédiée à une gamme
                    de produits exclusivement réservés à un{" "}
                    <strong>usage de collection</strong>. Tous les articles
                    proposés ici contiennent du{" "}
                    <strong>Delta-9 tétrahydrocannabinol</strong> dans une
                    concentration strictement{" "}
                    <strong>inférieure à 0,3 %</strong>, conformément à la
                    législation européenne en vigueur.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    Qu'il s'agisse de <strong>gummies</strong>, de{" "}
                    <strong>liquides</strong> ou d'autres formats à venir, nos
                    produits sont <strong>non alimentaires</strong> et ne
                    doivent en aucun cas être utilisés à des fins de
                    consommation.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-yellow-800 mb-4">
                    Qu'est-ce que le Delta-9 THC ?
                  </h3>
                  <p className="text-yellow-700 leading-relaxed mb-4">
                    Le <strong>Delta-9 THC</strong> est une molécule
                    naturellement présente dans la plante de chanvre. Bien
                    qu'elle soit reconnue pour son{" "}
                    <strong>caractère psychoactif</strong>, une teneur
                    inférieure à 0,3 % permet une commercialisation encadrée en
                    France et dans l'Union européenne, à condition que le
                    produit ne soit{" "}
                    <strong>
                      ni destiné ni présenté comme destiné à la consommation
                    </strong>
                    .
                  </p>
                  <p className="text-yellow-700 leading-relaxed">
                    Chez Deltagum, nous sélectionnons uniquement des produits
                    conformes, <strong>traçables</strong> et{" "}
                    <strong>stables</strong>, issus de laboratoires respectant
                    toutes les exigences réglementaires.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Nos Valeurs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0">
              Les principes qui guident chacune de nos actions et décisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: "🔬",
                title: "Qualité Premium",
                description:
                  "Tous nos produits sont rigoureusement testés en laboratoire pour garantir pureté et efficacité.",
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
                className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement qualité */}
      <section className="py-12 sm:py-16 bg-green-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={fadeIn.initial}
              whileInView={fadeIn.animate}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                🔬 Un engagement qualité sur chaque produit
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    ✅ Produits testés en laboratoire
                  </h3>
                  <p className="text-gray-600 text-sm">
                    <strong>THC &lt; 0,3 %</strong> - Conformité européenne
                    garantie
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    🔒 Traçabilité complète
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Suivi rigoureux de la production à la livraison
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    🌡️ Conditionnements sécurisés
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Stockage et transport dans des conditions optimales
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    🏆 Objets de collection uniquement
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Présentés comme objets de collection exclusivement
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-xl">
                <h3 className="text-lg font-bold text-orange-800 mb-4">
                  ⚠️ En cas d'utilisation non conforme
                </h3>
                <p className="text-orange-700 text-sm mb-4">
                  Si les produits Delta-9 THC de cette catégorie venaient à être
                  utilisés en dehors de leur destination de collection, les{" "}
                  <strong>effets secondaires suivants</strong> pourraient être
                  ressentis :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700">
                  <div>
                    <p>• Sensation de relâchement physique ou mental</p>
                    <p>• Somnolence ou fatigue intense</p>
                    <p>• Rougeur des yeux</p>
                  </div>
                  <div>
                    <p>• Sécheresse buccale</p>
                    <p>• Trouble de l'attention ou ralentissement moteur</p>
                    <p>• Épisodes de nausée ou vertiges</p>
                  </div>
                </div>
                <p className="text-orange-800 font-medium mt-4 text-sm">
                  Une seule unité suffirait à provoquer ces effets.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Précautions essentielles */}
      <section className="py-12 sm:py-16 bg-red-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={fadeIn.initial}
              whileInView={fadeIn.animate}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                🚨 Précautions essentielles
              </h2>

              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-red-800 mb-4">
                      🔞 Produit interdit aux mineurs
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Strictement réservé aux personnes majeures (18 ans et
                      plus)
                    </p>

                    <h3 className="text-lg font-bold text-red-800 mb-4">
                      🤱 Déconseillé aux femmes enceintes ou allaitantes
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Usage fortement déconseillé pendant la grossesse et
                      l'allaitement
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-red-800 mb-4">
                      👶 À conserver hors de portée des enfants
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Stockage sécurisé obligatoire, loin des enfants
                    </p>

                    <h3 className="text-lg font-bold text-red-800 mb-4">
                      🚫 Ne pas consommer
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Produits destinés exclusivement à la collection
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-red-500 text-xl">🚫</span>
                      <span className="text-sm text-gray-700">
                        Ne pas inhaler ni transformer
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-red-500 text-xl">⚠️</span>
                      <span className="text-sm text-gray-700">
                        Usage de collection uniquement
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                <p className="text-yellow-800 font-bold text-center">
                  ⚠️ Toute utilisation abusive engage la seule responsabilité de
                  l'utilisateur.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section complète Delta-9 THC */}
    </main>
  );
}
