"use client";

import { CheckoutModal } from "@/components/modals/CheckoutModal";
import { useCheckoutModal } from "@/stores";
import React from "react";

const CheckoutModalProvider: React.FC = () => {
  const { isOpen, closeModal } = useCheckoutModal();

  return <CheckoutModal isOpen={isOpen} onClose={closeModal} />;
};

export { CheckoutModalProvider };
