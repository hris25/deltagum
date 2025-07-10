"use client";

import { TestimonialCard } from "@/components/ui/testimonial-cards";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    testimonial:
      "Deltagum m'aide énormément à gérer mon stress quotidien. La saveur fraise est délicieuse et l'effet relaxant se fait sentir rapidement.",
    author: "Marie Dubois - Paris",
  },
  {
    id: 2,
    testimonial:
      "J'ai découvert Deltagum pour mes problèmes de sommeil. Les délices à la myrtille m'aident à me détendre le soir. Qualité exceptionnelle.",
    author: "Pierre Martin - Lyon",
  },
  {
    id: 3,
    testimonial:
      "Excellente alternative naturelle pour la relaxation ! Les délices Deltagum saveur pomme sont parfaits pour décompresser.",
    author: "Sophie Leroy - Marseille",
  },
  {
    id: 4,
    testimonial:
      "En tant que professionnel du bien-être, je recommande Deltagum. Produit de qualité premium, dosage parfait et saveurs naturelles remarquables.",
    author: "Thomas Rousseau - Toulouse",
  },
  {
    id: 5,
    testimonial:
      "Service client très professionnel ! Ils m'ont bien expliqué les effets et conseillé le bon dosage. Produit efficace pour la détente.",
    author: "Emma Moreau - Bordeaux",
  },
  {
    id: 6,
    testimonial:
      "Livraison rapide et discrète. Les délices Deltagum sont devenus indispensables dans ma routine bien-être quotidienne.",
    author: "Lucas Petit - Nice",
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
