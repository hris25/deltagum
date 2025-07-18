"use client";

import React from "react";

const Footer: React.FC = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const footerLinks = {
    navigation: [
      { label: "Accueil", href: "/" },
      { label: "À propos & Légal", href: "/about" },
      { label: "Professionnels & Revendeurs", href: "/professionals" },
    ],
    legal: [
      { label: "Mentions légales", href: "/legal" },
      { label: "Politique de confidentialité", href: "/privacy" },
      { label: "Conditions générales", href: "/terms" },
      { label: "Vérification d'âge", href: "/age-verification" },
      { label: "Cookies", href: "/cookies" },
    ],
    social: [
      {
        label: "Facebook",
        href: "https://facebook.com/deltagum",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        ),
      },
      {
        label: "Instagram",
        href: "https://instagram.com/deltagum",
        icon: (
          <svg
            fill="currentColor"
            width="20px"
            height="20px"
            viewBox="-0.075 -0.075 0.9 0.9"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMin"
            className="jam jam-instagram"
          >
            <path d="M0.526 0h-0.303A0.223 0.223 0 0 0 0 0.223v0.303a0.223 0.223 0 0 0 0.223 0.223h0.303a0.223 0.223 0 0 0 0.223 -0.223v-0.303A0.223 0.223 0 0 0 0.526 0m0.148 0.526a0.148 0.148 0 0 1 -0.148 0.148h-0.303a0.148 0.148 0 0 1 -0.148 -0.148v-0.303a0.148 0.148 0 0 1 0.148 -0.148h0.303a0.148 0.148 0 0 1 0.148 0.148v0.303z" />
            <path d="M0.374 0.181A0.194 0.194 0 0 0 0.181 0.374a0.194 0.194 0 0 0 0.194 0.194 0.194 0.194 0 0 0 0.194 -0.194A0.194 0.194 0 0 0 0.374 0.181zm0 0.312a0.118 0.118 0 1 1 0 -0.237 0.118 0.118 0 0 1 0 0.237" />
            <path
              cx="15.156"
              cy="4.858"
              r="1.237"
              d="M0.615 0.182A0.046 0.046 0 0 1 0.568 0.229A0.046 0.046 0 0 1 0.522 0.182A0.046 0.046 0 0 1 0.615 0.182z"
            />
          </svg>
        ),
      },
      {
        label: "Twitter",
        href: "https://twitter.com/deltagum",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        ),
      },
      {
        label: "TikTok",
        href: "https://tiktok.com/@deltagum",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Section principale */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Logo et description */}
          <div className="lg:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <img
                  src="/img/logo.jpg"
                  alt="Deltagum Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">
                Deltagum
              </span>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Des bonbons artisanaux aux saveurs uniques qui éveillent vos sens.
              Découvrez nos créations gourmandes aux parfums de fraise, myrtille
              et pomme.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center sm:text-left">
            <h3
              className="font-bold text-white sm:text-lg mb-3 sm:mb-4"
              style={{ color: "#ffffff" }}
            >
              Navigation
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-pink-300 transition-colors duration-200 text-sm sm:text-base"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations légales */}
          {/*<div className="text-center sm:text-left">
            <h3
              className="font-bold text-white sm:text-lg mb-3 sm:mb-4"
              style={{ color: "#ffffff" }}
            >
              Informations
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-pink-300 transition-colors duration-200 text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>*/}

          {/* Contact et réseaux sociaux */}
          <div className="text-center sm:text-left">
            <h3
              className="font-bold text-white sm:text-lg mb-3 sm:mb-4"
              style={{ color: "#ffffff" }}
            >
              Contact
            </h3>
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <p className="text-gray-300 flex items-center justify-center sm:justify-start text-sm sm:text-base">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Gumdelta@gmail.com
              </p>
              <p className="text-gray-300 flex items-center justify-center sm:justify-start text-sm sm:text-base">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +33 07 88 64 69 83
              </p>
            </div>

            <h4 className="font-semibold mb-2 sm:mb-3 text-pink-300 text-sm sm:text-base">
              Suivez-nous
            </h4>
            <div className="flex justify-center sm:justify-start space-x-2 sm:space-x-3">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 bg-gray-800 rounded-lg text-gray-300 hover:text-pink-300 hover:bg-gray-700 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-gray-700 py-4 sm:py-6">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          {/* Avertissement Delta-9 THC */}
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="text-center">
              <p className="text-yellow-300 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                🌿 AVERTISSEMENT IMPORTANT - PRODUITS DELTA-9 THC
              </p>
              <p className="text-yellow-200 text-xs leading-relaxed">
                Nos produits sont strictement réservés aux personnes majeures
                (18 ans et plus).
                <br />
                Ne pas conduire ou utiliser de machines après consommation.
                Déconseillé aux femmes enceintes ou allaitantes.
                <br />
                Tenir hors de portée des enfants. Consommer avec modération.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 Deltagum . Tous droits réservés. Fait avec ❤️ en France.
            </p>
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-400">
              <span>🌿 Détente naturelle avec style ! ✨</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
