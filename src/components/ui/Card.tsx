"use client";

import { scaleIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "glass";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  hover?: boolean;
  clickable?: boolean;
  gradient?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      rounded = "lg",
      hover = false,
      clickable = false,
      gradient = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      "relative overflow-hidden transition-all duration-300",
    ];

    const variantClasses = {
      default: ["bg-white border border-gray-200", "shadow-sm"],
      elevated: ["bg-white", "shadow-lg hover:shadow-xl"],
      outlined: ["bg-white border-2 border-gray-300", "hover:border-pink-300"],
      glass: [
        "bg-white/80 backdrop-blur-sm",
        "border border-white/20",
        "shadow-lg",
      ],
    };

    const paddingClasses = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    };

    const roundedClasses = {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    };

    const hoverClasses = hover
      ? ["hover:shadow-lg hover:-translate-y-1", "hover:scale-105"]
      : [];

    const clickableClasses = clickable
      ? [
          "cursor-pointer",
          "hover:shadow-lg hover:-translate-y-1",
          "active:scale-95",
        ]
      : [];

    const gradientClasses = gradient
      ? [
          "bg-gradient-to-br from-pink-50 to-orange-50",
          "border-gradient-to-r from-pink-200 to-orange-200",
        ]
      : [];

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      roundedClasses[rounded],
      hoverClasses,
      clickableClasses,
      gradientClasses,
      className
    );

    const MotionCard = motion.div;

    return (
      <MotionCard
        ref={ref}
        className={classes}
        initial={false}
        animate={scaleIn.animate}
        whileHover={hover || clickable ? { y: -4, scale: 1.02 } : undefined}
        whileTap={clickable ? { scale: 0.98 } : undefined}
        {...(({
          onAnimationStart,
          onAnimationEnd,
          onAnimationIteration,
          onDrag,
          onDragStart,
          onDragEnd,
          ...rest
        }) => rest)(props)}
      >
        {children}
      </MotionCard>
    );
  }
);

Card.displayName = "Card";

// Composants auxiliaires pour la structure de la carte
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-600", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
