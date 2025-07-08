"use client";

import { motion } from "framer-motion";
import React from "react";
export type CheckoutStep = "shipping" | "payment" | "confirmation";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const steps = [
    {
      id: "shipping" as CheckoutStep,
      name: "Livraison",
      icon: "📦",
      description: "Adresse de livraison",
    },
    {
      id: "payment" as CheckoutStep,
      name: "Paiement",
      icon: "💳",
      description: "Méthode de paiement",
    },
    {
      id: "confirmation" as CheckoutStep,
      name: "Confirmation",
      icon: "✅",
      description: "Commande confirmée",
    },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2" />

        {/* Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full transform -translate-y-1/2"
          initial={{ width: "0%" }}
          animate={{
            width:
              currentStepIndex === 0
                ? "0%"
                : currentStepIndex === 1
                ? "50%"
                : "100%",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Step Circle */}
                <motion.div
                  className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
                    ${
                      isCompleted
                        ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                        : isCurrent
                        ? "bg-white border-2 border-pink-500 text-pink-500 shadow-lg"
                        : "bg-gray-200 text-gray-400"
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  animate={
                    isCurrent
                      ? {
                          boxShadow: [
                            "0 0 0 0 rgba(236, 72, 153, 0.4)",
                            "0 0 0 10px rgba(236, 72, 153, 0)",
                            "0 0 0 0 rgba(236, 72, 153, 0)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity },
                    scale: { duration: 0.2 },
                  }}
                >
                  {isCompleted ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      ✓
                    </motion.span>
                  ) : (
                    <motion.span
                      animate={
                        isCurrent
                          ? {
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, -5, 0],
                            }
                          : {}
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {step.icon}
                    </motion.span>
                  )}

                  {/* Current Step Indicator */}
                  {isCurrent && (
                    <motion.div
                      className="absolute -inset-1 rounded-full border-2 border-pink-300"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Step Info */}
                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <h4
                    className={`
                    text-sm font-semibold
                    ${
                      isCompleted || isCurrent
                        ? "text-gray-800"
                        : "text-gray-400"
                    }
                  `}
                  >
                    {step.name}
                  </h4>
                  <p
                    className={`
                    text-xs mt-1
                    ${
                      isCompleted || isCurrent
                        ? "text-gray-600"
                        : "text-gray-400"
                    }
                  `}
                  >
                    {step.description}
                  </p>
                </motion.div>

                {/* Step Number for Mobile */}
                <div className="md:hidden mt-1">
                  <span
                    className={`
                    text-xs px-2 py-1 rounded-full
                    ${
                      isCompleted
                        ? "bg-green-100 text-green-600"
                        : isCurrent
                        ? "bg-pink-100 text-pink-600"
                        : "bg-gray-100 text-gray-400"
                    }
                  `}
                  >
                    {index + 1}/3
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Text */}
      <motion.div
        className="md:hidden mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-1">
            Étape {currentStepIndex + 1} sur {steps.length}
          </h3>
          <p className="text-sm text-gray-600">
            {steps[currentStepIndex].description}
          </p>

          {/* Progress Percentage */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progression</span>
              <span>
                {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estimated Time */}
      <motion.div
        className="hidden md:block mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-gray-500">
          ⏱️ Temps estimé restant :{" "}
          {currentStep === "shipping"
            ? "2-3 minutes"
            : currentStep === "payment"
            ? "1-2 minutes"
            : "Terminé !"}
        </p>
      </motion.div>
    </div>
  );
};

export { CheckoutProgress };
