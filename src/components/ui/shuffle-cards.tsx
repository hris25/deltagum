"use client";

import { TestimonialCard } from "@/components/ui/testimonial-cards";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    testimonial:
      "Personnel très sympa les produits sont de qualité et les prix raisonnable je vous conseille de venir.",
    author: "Maxence Martins",
  },
  {
    id: 2,
    testimonial:
      "Accueil au top. De très bons vendeurs qui prennent bien en compte nos besoins afin de nous proposer les meilleurs produits !! Je recommande fortement, jamais été déçu",
    author: "Clémentine Chandellier",
  },
  {
    id: 3,
    testimonial:
      "Super boutique ! Large choix de produits de qualité, avec de très bons conseils de la part de l’équipe. L’accueil est toujours chaleureux et professionnel. Je recommande vivement à tous ceux qui recherchent du CBD de qualité !",
    author: "Dylan Lesueur",
  },
  {
    id: 4,
    testimonial:
      "Je suis passée dans cette boutique cet après midi , j ai été très bien accueillie par 2 petits jeunes très sympathiques. Beaucoup de produits très variés. De bons conseils. Je recommande.",
    author: "Dominique JEHANNO",
  },
  {
    id: 5,
    testimonial:
      "J’ai été très bien conseillé, l’équipe est à l’écoute et a pris le temps de répondre à mes questions. Les produits sont de très bonne qualité, je suis vraiment satisfaite. Je reviendrai sans hésiter !",
    author: "Chloé Simon",
  },
  {
    id: 6,
    testimonial:
      "Je suis passée à la boutique aujourd’hui par curiosité, le vendeur est adorable et professionnel, il a pris le temps de tout m’expliquer, super expérience !",
    author: "Camille zelazko",
  },
];

function ShuffleCards() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleShuffle = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Afficher seulement 3 témoignages à la fois
  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];
  const positions = ["front", "middle", "back"];

  return (
    <div className="flex justify-center items-center px-4 sm:px-8 py-8 sm:py-12 min-h-[480px] sm:min-h-[600px] w-full overflow-visible">
      <div className="relative h-[380px] w-[280px] sm:h-[450px] sm:w-[350px] mx-auto">
        {visibleTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            {...testimonial}
            handleShuffle={handleShuffle}
            position={positions[index] as "front" | "middle" | "back"}
          />
        ))}
      </div>
    </div>
  );
}

export { ShuffleCards };
