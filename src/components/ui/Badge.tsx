"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
// Animations removed - using inline animations

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  outline?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      rounded = false,
      outline = false,
      icon,
      iconPosition = "left",
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      "inline-flex items-center font-medium transition-all duration-200",
      "whitespace-nowrap",
    ];

    const variantClasses = {
      default: outline
        ? "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200",
      primary: outline
        ? "border border-pink-300 text-pink-700 bg-transparent hover:bg-pink-50"
        : "bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:from-pink-600 hover:to-orange-500",
      secondary: outline
        ? "border border-purple-300 text-purple-700 bg-transparent hover:bg-purple-50"
        : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600",
      success: outline
        ? "border border-green-300 text-green-700 bg-transparent hover:bg-green-50"
        : "bg-green-100 text-green-800 hover:bg-green-200",
      warning: outline
        ? "border border-yellow-300 text-yellow-700 bg-transparent hover:bg-yellow-50"
        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      danger: outline
        ? "border border-red-300 text-red-700 bg-transparent hover:bg-red-50"
        : "bg-red-100 text-red-800 hover:bg-red-200",
      info: outline
        ? "border border-blue-300 text-blue-700 bg-transparent hover:bg-blue-50"
        : "bg-blue-100 text-blue-800 hover:bg-blue-200",
    };

    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base",
    };

    const roundedClasses = {
      sm: rounded ? "rounded-full" : "rounded",
      md: rounded ? "rounded-full" : "rounded-md",
      lg: rounded ? "rounded-full" : "rounded-lg",
    };

    const iconSize = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses[size],
      className
    );

    const renderIcon = (position: "left" | "right") => {
      if (!icon || iconPosition !== position) return null;

      return (
        <span
          className={cn(
            iconSize[size],
            position === "left" && children && "mr-1",
            position === "right" && children && "ml-1"
          )}
        >
          {icon}
        </span>
      );
    };

    const renderRemoveButton = () => {
      if (!removable) return null;

      return (
        <button
          onClick={onRemove}
          className={cn(
            "ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors",
            iconSize[size]
          )}
          aria-label="Supprimer"
        >
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      );
    };

    const {
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      onDrag,
      onDragStart,
      onDragEnd,
      ...divProps
    } = props;

    return (
      <motion.div
        ref={ref}
        className={classes}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...divProps}
      >
        {renderIcon("left")}
        {children}
        {renderIcon("right")}
        {renderRemoveButton()}
      </motion.div>
    );
  }
);

Badge.displayName = "Badge";

// Badge spécialisé pour les statuts de commande
export interface OrderStatusBadgeProps {
  status:
    | "PENDING"
    | "PROCESSING"
    | "PAID"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "FAILED";
  size?: "sm" | "md" | "lg";
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const statusConfig = {
    PENDING: {
      variant: "warning" as const,
      label: "En attente",
      icon: "⏳",
    },
    PROCESSING: {
      variant: "info" as const,
      label: "En cours",
      icon: "⚙️",
    },
    PAID: {
      variant: "success" as const,
      label: "Payé",
      icon: "✅",
    },
    SHIPPED: {
      variant: "primary" as const,
      label: "Expédié",
      icon: "📦",
    },
    DELIVERED: {
      variant: "success" as const,
      label: "Livré",
      icon: "🎉",
    },
    CANCELLED: {
      variant: "danger" as const,
      label: "Annulé",
      icon: "❌",
    },
    FAILED: {
      variant: "danger" as const,
      label: "Échoué",
      icon: "⚠️",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      icon={<span>{config.icon}</span>}
      rounded
    >
      {config.label}
    </Badge>
  );
};

// Badge spécialisé pour les niveaux de fidélité
export interface LoyaltyBadgeProps {
  level: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  size?: "sm" | "md" | "lg";
}

const LoyaltyBadge: React.FC<LoyaltyBadgeProps> = ({ level, size = "md" }) => {
  const levelConfig = {
    BRONZE: {
      variant: "warning" as const,
      label: "Bronze",
      icon: "🥉",
    },
    SILVER: {
      variant: "default" as const,
      label: "Argent",
      icon: "🥈",
    },
    GOLD: {
      variant: "warning" as const,
      label: "Or",
      icon: "🥇",
    },
    PLATINUM: {
      variant: "primary" as const,
      label: "Platine",
      icon: "💎",
    },
  };

  const config = levelConfig[level];

  return (
    <Badge
      variant={config.variant}
      size={size}
      icon={<span>{config.icon}</span>}
      rounded
    >
      {config.label}
    </Badge>
  );
};

export { Badge, LoyaltyBadge, OrderStatusBadge };
