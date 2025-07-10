"use client";

import { fadeIn } from "@/lib/animations";
import { motion } from "framer-motion";

export default function LegalPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mentions Légales
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Informations légales et conditions d'utilisation du site Deltagum.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contenu légal */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="prose prose-lg max-w-none"
              initial={fadeIn.initial}
              whileInView={fadeIn.animate}
              viewport={{ once: true }}
            >
              {/* Avertissement produits Delta-9 THC */}
              <div className="mb-12 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-6">
                <h2 className="text-2xl font-bold text-red-800 mb-6">
                  ⚠️ Avertissement produits Delta-9 THC
                </h2>

                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-red-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      🔞 Objets de collection conformes à la législation
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Bienvenue dans la catégorie{" "}
                      <strong>Delta-9 THC de Deltagum</strong>, dédiée à une
                      gamme de produits exclusivement réservés à un{" "}
                      <strong>usage de collection</strong>. Tous les articles
                      proposés ici contiennent du{" "}
                      <strong>Delta-9 tétrahydrocannabinol</strong> dans une
                      concentration strictement{" "}
                      <strong>inférieure à 0,3 %</strong>, conformément à la
                      législation européenne en vigueur.
                    </p>
                    <p className="text-gray-700">
                      Qu'il s'agisse de <strong>gummies</strong>, de{" "}
                      <strong>liquides</strong> ou d'autres formats à venir, nos
                      produits sont <strong>non alimentaires</strong> et ne
                      doivent en aucun cas être utilisés à des fins de
                      consommation.
                    </p>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <h3 className="text-lg font-bold text-yellow-800 mb-4">
                      📋 Qu'est-ce que le Delta-9 THC ?
                    </h3>
                    <p className="text-yellow-700 mb-4">
                      Le <strong>Delta-9 THC</strong> est une molécule
                      naturellement présente dans la plante de chanvre. Bien
                      qu'elle soit reconnue pour son{" "}
                      <strong>caractère psychoactif</strong>, une teneur
                      inférieure à 0,3 % permet une commercialisation encadrée
                      en France et dans l'Union européenne, à condition que le
                      produit ne soit{" "}
                      <strong>
                        ni destiné ni présenté comme destiné à la consommation
                      </strong>
                      .
                    </p>
                    <p className="text-yellow-700">
                      Chez Deltagum, nous sélectionnons uniquement des produits
                      conformes, <strong>traçables</strong> et{" "}
                      <strong>stables</strong>, issus de laboratoires respectant
                      toutes les exigences réglementaires.
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <h3 className="text-lg font-bold text-orange-800 mb-4">
                      ⚠️ En cas d'utilisation non conforme
                    </h3>
                    <p className="text-orange-700 mb-4">
                      Si les produits Delta-9 THC de cette catégorie venaient à
                      être utilisés en dehors de leur destination de collection,
                      les <strong>effets secondaires suivants</strong>{" "}
                      pourraient être ressentis :
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700 mb-4">
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
                    <p className="text-orange-800 font-bold">
                      Une seule unité suffirait à provoquer ces effets.
                    </p>
                  </div>

                  <div className="bg-red-100 rounded-lg p-6 border border-red-300">
                    <h3 className="text-lg font-bold text-red-800 mb-4">
                      🚨 Précautions essentielles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-700">
                      <div>
                        <p>
                          <strong>🔞 Produit interdit aux mineurs</strong>
                        </p>
                        <p>
                          <strong>
                            🤱 Déconseillé aux femmes enceintes ou allaitantes
                          </strong>
                        </p>
                        <p>
                          <strong>
                            👶 À conserver hors de portée des enfants
                          </strong>
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>🚫 Ne pas consommer</strong>
                        </p>
                        <p>
                          <strong>🚫 Ne pas inhaler ni transformer</strong>
                        </p>
                        <p>
                          <strong>⚠️ Usage de collection uniquement</strong>
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-red-200 rounded-lg">
                      <p className="text-red-800 font-bold text-center">
                        ⚠️ Toute utilisation abusive engage la seule
                        responsabilité de l'utilisateur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Éditeur du site */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Éditeur du site
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p>
                    <strong>Raison sociale :</strong> Deltagum SAS
                  </p>
                  <p>
                    <strong>Siège social :</strong> [Adresse à compléter]
                  </p>
                  <p>
                    <strong>Capital social :</strong> [Montant à compléter]
                  </p>
                  <p>
                    <strong>RCS :</strong> [Numéro à compléter]
                  </p>
                  <p>
                    <strong>SIRET :</strong> [Numéro à compléter]
                  </p>
                  <p>
                    <strong>TVA intracommunautaire :</strong> [Numéro à
                    compléter]
                  </p>
                  <p>
                    <strong>Directeur de publication :</strong> [Nom à
                    compléter]
                  </p>
                </div>
              </div>

              {/* Hébergement */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Hébergement
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p>
                    <strong>Hébergeur :</strong> Vercel Inc.
                  </p>
                  <p>
                    <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA
                    91789, USA
                  </p>
                </div>
              </div>

              {/* Propriété intellectuelle */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Propriété intellectuelle
                </h2>
                <p className="text-gray-700 mb-4">
                  L'ensemble de ce site relève de la législation française et
                  internationale sur le droit d'auteur et la propriété
                  intellectuelle. Tous les droits de reproduction sont réservés,
                  y compris pour les documents téléchargeables et les
                  représentations iconographiques et photographiques.
                </p>
                <p className="text-gray-700">
                  La reproduction de tout ou partie de ce site sur un support
                  électronique quel qu'il soit est formellement interdite sauf
                  autorisation expresse du directeur de la publication.
                </p>
              </div>

              {/* Protection des données */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Protection des données personnelles
                </h2>
                <p className="text-gray-700 mb-4">
                  Conformément à la loi « Informatique et Libertés » du 6
                  janvier 1978 modifiée et au Règlement Général sur la
                  Protection des Données (RGPD), vous disposez d'un droit
                  d'accès, de rectification, de suppression et d'opposition aux
                  données personnelles vous concernant.
                </p>
                <p className="text-gray-700">
                  Pour exercer ces droits, vous pouvez nous contacter à
                  l'adresse : contact@deltagum.com
                </p>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Cookies
                </h2>
                <p className="text-gray-700 mb-4">
                  Ce site utilise des cookies pour améliorer l'expérience
                  utilisateur et analyser le trafic. En continuant à naviguer
                  sur ce site, vous acceptez l'utilisation de cookies.
                </p>
                <p className="text-gray-700">
                  Vous pouvez configurer votre navigateur pour refuser les
                  cookies, mais certaines fonctionnalités du site pourraient ne
                  plus être disponibles.
                </p>
              </div>

              {/* Responsabilité */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Limitation de responsabilité
                </h2>
                <p className="text-gray-700 mb-4">
                  Les informations contenues sur ce site sont aussi précises que
                  possible et le site remis à jour à différentes périodes de
                  l'année, mais peut toutefois contenir des inexactitudes ou des
                  omissions.
                </p>
                <p className="text-gray-700">
                  Si vous constatez une lacune, erreur ou ce qui parait être un
                  dysfonctionnement, merci de bien vouloir le signaler par
                  email, à l'adresse contact@deltagum.com, en décrivant le
                  problème de la façon la plus précise possible.
                </p>
              </div>

              {/* Avertissement Delta-9 THC */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Avertissement produits Delta-9 THC
                </h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <p className="text-gray-700 mb-4">
                    <strong>Réservé aux adultes :</strong> Nos produits
                    contenant du Delta-9 THC sont strictement réservés aux
                    personnes majeures (18 ans et plus).
                  </p>
                  <p className="text-gray-700 mb-4">
                    <strong>Usage :</strong> Ces produits ne sont pas destinés à
                    diagnostiquer, traiter, guérir ou prévenir une maladie.
                    Consultez votre médecin avant utilisation si vous êtes
                    enceinte, allaitez ou suivez un traitement médical.
                  </p>
                  <p className="text-gray-700">
                    <strong>Conformité :</strong> Tous nos produits respectent
                    la législation européenne en vigueur avec un taux de THC
                    inférieur à 0,3%.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Contact
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p>
                    <strong>Email :</strong> contact@deltagum.com
                  </p>
                  <p>
                    <strong>Téléphone :</strong> [Numéro à compléter]
                  </p>
                  <p>
                    <strong>Adresse :</strong> [Adresse à compléter]
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
