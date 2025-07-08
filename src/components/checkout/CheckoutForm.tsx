"use client";

import { Button, Input, Select, Textarea } from "@/components/ui";
import { useCheckoutModal, useCustomer, useNotifications } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const shippingSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  address: z.string().min(5, "Adresse trop courte"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  country: z.string().min(2, "Pays requis"),
  deliveryInstructions: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface CheckoutFormProps {
  onNext: () => void;
  isProcessing: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onNext,
  isProcessing,
}) => {
  const { customer, updateCustomer } = useCustomer();
  const { addNotification } = useNotifications();
  const { closeModal } = useCheckoutModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      deliveryInstructions: "",
    },
  });

  const onSubmit = async (data: ShippingFormData) => {
    try {
      // Sauvegarder les informations client de base
      updateCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      });

      addNotification({
        type: "success",
        title: "Livraison",
        message: "Informations de livraison sauvegardées",
      });

      onNext();
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors de la sauvegarde",
      });
    }
  };

  const fillDemoData = () => {
    setValue("firstName", "Marie");
    setValue("lastName", "Dupont");
    setValue("email", "marie.dupont@example.com");
    setValue("phone", "0123456789");
    setValue("address", "123 Rue de la Paix");
    setValue("city", "Paris");
    setValue("postalCode", "75001");
    setValue("country", "France");
    setValue("deliveryInstructions", "Laisser devant la porte si absent");
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Demo Data Button */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-800">Mode démonstration</h4>
            <p className="text-sm text-blue-600">
              Remplir avec des données de test
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillDemoData}
            className="border-blue-300 text-blue-600 hover:bg-blue-100"
          >
            Remplir automatiquement
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom *
          </label>
          <Input
            {...register("firstName")}
            placeholder="Votre prénom"
            error={errors.firstName?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <Input
            {...register("lastName")}
            placeholder="Votre nom"
            error={errors.lastName?.message}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder="votre@email.com"
            error={errors.email?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone *
          </label>
          <Input
            {...register("phone")}
            type="tel"
            placeholder="01 23 45 67 89"
            error={errors.phone?.message}
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adresse *
        </label>
        <Input
          {...register("address")}
          placeholder="123 Rue de la Paix"
          error={errors.address?.message}
        />
      </div>

      {/* City and Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville *
          </label>
          <Input
            {...register("city")}
            placeholder="Paris"
            error={errors.city?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code postal *
          </label>
          <Input
            {...register("postalCode")}
            placeholder="75001"
            error={errors.postalCode?.message}
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pays *
        </label>
        <Select {...register("country")} error={errors.country?.message}>
          <option value="France">France</option>
          <option value="Belgique">Belgique</option>
          <option value="Suisse">Suisse</option>
          <option value="Luxembourg">Luxembourg</option>
          <option value="Monaco">Monaco</option>
        </Select>
      </div>

      {/* Delivery Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instructions de livraison (optionnel)
        </label>
        <Textarea
          {...register("deliveryInstructions")}
          placeholder="Laisser devant la porte, sonner chez le voisin, etc."
          rows={3}
        />
      </div>

      {/* Delivery Options */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">Options de livraison</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="deliveryOption"
              value="standard"
              defaultChecked
              className="text-pink-500 focus:ring-pink-500"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  Livraison standard
                </span>
                <span className="text-green-600 font-medium">Gratuite</span>
              </div>
              <p className="text-sm text-gray-600">3-5 jours ouvrés</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="deliveryOption"
              value="express"
              className="text-pink-500 focus:ring-pink-500"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  Livraison express
                </span>
                <span className="text-gray-800 font-medium">4,99 €</span>
              </div>
              <p className="text-sm text-gray-600">24-48h</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-between items-center pt-6">
        <button
          type="button"
          onClick={closeModal}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Retour au panier
        </button>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isValid || isProcessing}
          className="min-w-[200px]"
        >
          {isProcessing ? (
            <span className="flex items-center">
              <motion.span
                className="mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                🍭
              </motion.span>
              Traitement...
            </span>
          ) : (
            <span className="flex items-center">
              <span className="mr-2">💳</span>
              Continuer vers le paiement
            </span>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export { CheckoutForm };
