"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

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
              {/* Éditeur du site */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Éditeur du site
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p><strong>Raison sociale :</strong> Deltagum SAS</p>
                  <p><strong>Siège social :</strong> [Adresse à compléter]</p>
                  <p><strong>Capital social :</strong> [Montant à compléter]</p>
                  <p><strong>RCS :</strong> [Numéro à compléter]</p>
                  <p><strong>SIRET :</strong> [Numéro à compléter]</p>
                  <p><strong>TVA intracommunautaire :</strong> [Numéro à compléter]</p>
                  <p><strong>Directeur de publication :</strong> [Nom à compléter]</p>
                </div>
              </div>

              {/* Hébergement */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Hébergement
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                  <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                </div>
              </div>

              {/* Propriété intellectuelle */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Propriété intellectuelle
                </h2>
                <p className="text-gray-700 mb-4">
                  L'ensemble de ce site relève de la législation française et internationale 
                  sur le droit d'auteur et la propriété intellectuelle. Tous les droits de 
                  reproduction sont réservés, y compris pour les documents téléchargeables 
                  et les représentations iconographiques et photographiques.
                </p>
                <p className="text-gray-700">
                  La reproduction de tout ou partie de ce site sur un support électronique 
                  quel qu'il soit est formellement interdite sauf autorisation expresse 
                  du directeur de la publication.
                </p>
              </div>

              {/* Protection des données */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Protection des données personnelles
                </h2>
                <p className="text-gray-700 mb-4">
                  Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 
                  modifiée et au Règlement Général sur la Protection des Données (RGPD), 
                  vous disposez d'un droit d'accès, de rectification, de suppression et 
                  d'opposition aux données personnelles vous concernant.
                </p>
                <p className="text-gray-700">
                  Pour exercer ces droits, vous pouvez nous contacter à l'adresse : 
                  contact@deltagum.com
                </p>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Cookies
                </h2>
                <p className="text-gray-700 mb-4">
                  Ce site utilise des cookies pour améliorer l'expérience utilisateur 
                  et analyser le trafic. En continuant à naviguer sur ce site, vous 
                  acceptez l'utilisation de cookies.
                </p>
                <p className="text-gray-700">
                  Vous pouvez configurer votre navigateur pour refuser les cookies, 
                  mais certaines fonctionnalités du site pourraient ne plus être disponibles.
                </p>
              </div>

              {/* Responsabilité */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Limitation de responsabilité
                </h2>
                <p className="text-gray-700 mb-4">
                  Les informations contenues sur ce site sont aussi précises que possible 
                  et le site remis à jour à différentes périodes de l'année, mais peut 
                  toutefois contenir des inexactitudes ou des omissions.
                </p>
                <p className="text-gray-700">
                  Si vous constatez une lacune, erreur ou ce qui parait être un 
                  dysfonctionnement, merci de bien vouloir le signaler par email, 
                  à l'adresse contact@deltagum.com, en décrivant le problème de la 
                  façon la plus précise possible.
                </p>
              </div>

              {/* Avertissement CBD */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Avertissement produits CBD
                </h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <p className="text-gray-700 mb-4">
                    <strong>Réservé aux adultes :</strong> Nos produits CBD sont strictement 
                    réservés aux personnes majeures (18 ans et plus).
                  </p>
                  <p className="text-gray-700 mb-4">
                    <strong>Usage :</strong> Ces produits ne sont pas destinés à diagnostiquer, 
                    traiter, guérir ou prévenir une maladie. Consultez votre médecin avant 
                    utilisation si vous êtes enceinte, allaitez ou suivez un traitement médical.
                  </p>
                  <p className="text-gray-700">
                    <strong>Conformité :</strong> Tous nos produits respectent la législation 
                    européenne en vigueur avec un taux de THC inférieur à 0,3%.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Contact
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p><strong>Email :</strong> contact@deltagum.com</p>
                  <p><strong>Téléphone :</strong> [Numéro à compléter]</p>
                  <p><strong>Adresse :</strong> [Adresse à compléter]</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
