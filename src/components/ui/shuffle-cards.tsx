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
      "J'ai découvert Deltagum CBD pour mes problèmes de sommeil. Les délices à la myrtille m'aident à me détendre le soir. Qualité exceptionnelle.",
    author: "Pierre Martin - Lyon",
  },
  {
    id: 3,
    testimonial:
      "Excellente alternative naturelle pour la relaxation ! Les délices CBD saveur pomme sont parfaits pour décompresser.",
    author: "Sophie Leroy - Marseille",
  },
  {
    id: 4,
    testimonial:
      "En tant que professionnel du bien-être, je recommande Deltagum. Produit CBD de qualité premium, dosage parfait et saveurs naturelles remarquables.",
    author: "Thomas Rousseau - Toulouse",
  },
  {
    id: 5,
    testimonial:
      "Service client très professionnel ! Ils m'ont bien expliqué les effets du CBD et conseillé le bon dosage. Produit efficace pour la détente.",
    author: "Emma Moreau - Bordeaux",
  },
  {
    id: 6,
    testimonial:
      "Livraison rapide et discrète. Les délices CBD Deltagum sont devenus indispensables dans ma routine bien-être quotidienne.",
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
    <div className="grid place-content-center overflow-hidden px-8 py-12 text-slate-50 min-h-[600px] h-full w-full">
      <div className="relative -ml-[100px] h-[450px] w-[350px] md:-ml-[175px]">
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
