"use client";

import { useClickOutside } from "@/hooks";
// Animations removed - using inline animations
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  className,
  overlayClassName,
}) => {
  // Fermer avec Escape
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Fermer en cliquant à l'extérieur
  const modalRef = useClickOutside<HTMLDivElement>(() => {
    if (closeOnOverlayClick && isOpen) {
      onClose();
    }
  });

  // Bloquer le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const overlayClasses = cn(
    "fixed inset-0 z-50 flex items-center justify-center p-4",
    "bg-black/50 backdrop-blur-sm",
    overlayClassName
  );

  const contentClasses = cn(
    "relative w-full bg-white rounded-xl shadow-2xl",
    "max-h-[90vh] overflow-y-auto",
    sizeClasses[size],
    className
  );

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={overlayClasses}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className={contentClasses}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  {title && (
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Fermer"
                  >
                    <svg
                      className="w-5 h-5"
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
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Utiliser un portal pour rendre la modal au niveau du body
  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

// Composants auxiliaires pour la structure de la modal
const ModalHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("p-6 border-b border-gray-200", className)}>
    {children}
  </div>
);

const ModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("p-6", className)}>{children}</div>
);

const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 p-6 border-t border-gray-200",
      className
    )}
  >
    {children}
  </div>
);

export { Modal, ModalBody, ModalFooter, ModalHeader };
