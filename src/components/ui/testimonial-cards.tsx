"use client";

import { motion } from "framer-motion";
import * as React from "react";

// Photos Unsplash réelles de personnes pour les témoignages
const getAvatarUrl = (id: number): string => {
  const avatars = [
    "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=128&h=128&fit=crop&crop=face", // Femme souriante
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face", // Homme barbu
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face", // Femme brune
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face", // Homme en costume
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=face", // Femme blonde
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face", // Homme souriant
  ];
  return avatars[(id - 1) % avatars.length];
};

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: "front" | "middle" | "back";
  id: number;
  author: string;
}

export function TestimonialCard({
  handleShuffle,
  testimonial,
  position,
  id,
  author,
}: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0",
      }}
      animate={{
        rotate:
          position === "front"
            ? "-6deg"
            : position === "middle"
            ? "0deg"
            : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%",
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onDragStart={(e) => {
        const clientX =
          "clientX" in e ? e.clientX : e.touches?.[0]?.clientX || 0;
        dragRef.current = clientX;
      }}
      onDragEnd={(e) => {
        const clientX =
          "clientX" in e ? e.clientX : e.changedTouches?.[0]?.clientX || 0;
        if (dragRef.current - clientX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[380px] w-[280px] sm:h-[450px] sm:w-[350px] select-none place-content-center space-y-4 sm:space-y-6 rounded-xl sm:rounded-2xl border-2 border-pink-200 bg-white/90 p-4 sm:p-6 shadow-xl backdrop-blur-md ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <img
        src={getAvatarUrl(id)}
        alt={`Avatar de ${author}`}
        className="pointer-events-none mx-auto h-20 w-20 sm:h-32 sm:w-32 rounded-full border-2 border-pink-200 bg-pink-50 object-cover"
        onError={(e) => {
          // Fallback to a default avatar if Unsplash fails
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            author.split(" ")[0]
          )}&size=128&background=fbbf24&color=fff`;
        }}
      />
      <span className="text-center text-sm sm:text-base lg:text-lg italic text-gray-700 leading-relaxed">
        "{testimonial}"
      </span>
      <span className="text-center text-xs sm:text-sm font-medium text-pink-600">
        {author}
      </span>
    </motion.div>
  );
}
