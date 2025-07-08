"use client";

// Animations removed - using inline animations
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  rounded?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      rounded = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      "inline-flex items-center justify-center font-medium transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "relative overflow-hidden",
    ];

    const variantClasses = {
      primary: [
        "bg-gradient-to-r from-pink-500 to-orange-400",
        "hover:from-pink-600 hover:to-orange-500",
        "text-white shadow-lg hover:shadow-xl",
        "focus:ring-pink-500",
      ],
      secondary: [
        "bg-gradient-to-r from-purple-500 to-blue-500",
        "hover:from-purple-600 hover:to-blue-600",
        "text-white shadow-lg hover:shadow-xl",
        "focus:ring-purple-500",
      ],
      outline: [
        "border-2 border-pink-500 text-pink-500",
        "hover:bg-pink-500 hover:text-white",
        "focus:ring-pink-500",
      ],
      ghost: [
        "text-gray-700 hover:text-pink-500",
        "hover:bg-pink-50",
        "focus:ring-pink-500",
      ],
      danger: [
        "bg-red-500 hover:bg-red-600",
        "text-white shadow-lg hover:shadow-xl",
        "focus:ring-red-500",
      ],
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
      xl: "px-8 py-4 text-xl",
    };

    const roundedClasses = {
      sm: rounded ? "rounded-full" : "rounded-md",
      md: rounded ? "rounded-full" : "rounded-lg",
      lg: rounded ? "rounded-full" : "rounded-xl",
      xl: rounded ? "rounded-full" : "rounded-2xl",
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses[size],
      fullWidth && "w-full",
      className
    );

    const iconSize = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-7 h-7",
    };

    const LoadingSpinner = () => (
      <motion.div
        className={cn(
          "border-2 border-current border-t-transparent rounded-full",
          iconSize[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );

    const renderContent = () => {
      if (loading) {
        return (
          <>
            <LoadingSpinner />
            {children && <span className="ml-2">Chargement...</span>}
          </>
        );
      }

      if (icon && iconPosition === "left") {
        return (
          <>
            <span className={cn(iconSize[size], children && "mr-2")}>
              {icon}
            </span>
            {children}
          </>
        );
      }

      if (icon && iconPosition === "right") {
        return (
          <>
            {children}
            <span className={cn(iconSize[size], children && "ml-2")}>
              {icon}
            </span>
          </>
        );
      }

      return children;
    };

    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      ...buttonProps
    } = props;

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        {...buttonProps}
      >
        {renderContent()}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
