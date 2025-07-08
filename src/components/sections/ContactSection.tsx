"use client";

import { ContactFloatingCandies } from "@/components/animations";
import { Button, Card, CardContent, Input, Textarea } from "@/components/ui";
import {
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";
import { useNotifications } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection: React.FC = () => {
  const { addNotification } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulation d'envoi d'email
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Contact form submitted:", data);

      addNotification({
        type: "success",
        title: "Succès",
        message: "Message envoyé avec succès ! Nous vous répondrons sous 24h.",
      });

      reset();
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
      });
    }
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      value: "contact@deltagum.com",
      description: "Réponse sous 24h",
    },
    {
      icon: "📞",
      title: "Téléphone",
      value: "+33 1 23 45 67 89",
      description: "Lun-Ven 9h-18h",
    },
    {
      icon: "📍",
      title: "Adresse",
      value: "123 Rue de la Gourmandise",
      description: "75001 Paris, France",
    },
    {
      icon: "⏰",
      title: "Horaires",
      value: "Lun-Ven 9h-18h",
      description: "Sam 10h-16h",
    },
  ];

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-gray-50 to-pink-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <ContactFloatingCandies />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={fadeIn.initial}
          whileInView={fadeIn.animate}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Contactez
            </span>
            <br />
            <span className="text-gray-800">Notre Équipe</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Une question, une suggestion, ou simplement envie de nous dire
            bonjour ? Nous sommes là pour vous écouter !
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Envoyez-nous un message
                  </h3>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <Input
                          {...register("name")}
                          placeholder="Votre nom"
                          error={errors.name?.message}
                        />
                      </div>

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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <Input
                        {...register("subject")}
                        placeholder="Objet de votre message"
                        error={errors.subject?.message}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        {...register("message")}
                        placeholder="Votre message..."
                        rows={6}
                        error={errors.message?.message}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      fullWidth
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <motion.span
                            className="mr-2"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            📧
                          </motion.span>
                          Envoi en cours...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <span className="mr-2">📨</span>
                          Envoyer le message
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Nos coordonnées
                </h3>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="text-2xl">{info.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {info.title}
                        </h4>
                        <p className="text-gray-700 font-medium">
                          {info.value}
                        </p>
                        <p className="text-sm text-gray-500">
                          {info.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Suivez-nous
                </h4>
                <div className="flex space-x-4">
                  {[
                    {
                      icon: "📘",
                      name: "Facebook",
                      color: "hover:text-blue-600",
                    },
                    {
                      icon: "📷",
                      name: "Instagram",
                      color: "hover:text-pink-600",
                    },
                    {
                      icon: "🐦",
                      name: "Twitter",
                      color: "hover:text-blue-400",
                    },
                    {
                      icon: "📺",
                      name: "YouTube",
                      color: "hover:text-red-600",
                    },
                  ].map((social, index) => (
                    <motion.button
                      key={index}
                      className={`text-2xl text-gray-400 ${social.color} transition-colors duration-300`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      title={social.name}
                    >
                      {social.icon}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Response Promise */}
              <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">⚡</span>
                  <h4 className="font-semibold text-gray-800">
                    Réponse rapide garantie
                  </h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Nous nous engageons à répondre à tous les messages dans les 24
                  heures. Pour les urgences, n'hésitez pas à nous appeler
                  directement.
                </p>
              </div>

              {/* FAQ Link */}
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Avant de nous contacter, consultez notre FAQ
                </p>
                <motion.button
                  onClick={() => {
                    const faqSection = document.getElementById("faq");
                    faqSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium underline"
                  whileHover={{ scale: 1.05 }}
                >
                  Voir les questions fréquentes →
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ContactSection };
