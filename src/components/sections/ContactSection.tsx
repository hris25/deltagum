"use client";

// import { ContactFloatingCandies } from "@/components/animations";
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        addNotification({
          type: "success",
          title: "Succès",
          message:
            "Message envoyé avec succès ! Nous vous répondrons sous 24h.",
        });
        reset();
      } else {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Error sending contact message:", error);
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
      value: "Bonplanpro76@gmail.com",
      description: "Réponse sous 24h",
    },
    {
      icon: "📞",
      title: "Téléphone",
      value: "07 88 64 69 83",
      description: "Lun-Ven 9h-18h",
    },
    {
      icon: "📍",
      title: "Adresse",
      value: "7 Rue Saint-Gervais",
      description: "76000 Rouen",
    },
    {
      icon: "⏰",
      title: "Horaires",
      value: "Lun-Dim : 11h00 – 21h00 ",
      description: "Peut varier les jours fériés",
    },
  ];

  return (
    <section
      id="contact"
      className="py-8 bg-gradient-to-br from-gray-50 to-pink-50 relative overflow-hidden"
    >
      {/* Background Elements - Removed for cleaner design */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
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
              <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="text-4xl mb-4">💬</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Envoyez-nous un message
                    </h3>
                    <p className="text-gray-600">
                      Nous vous répondrons dans les plus brefs délais
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Nom complet *
                        </label>
                        <Input
                          {...register("name")}
                          placeholder="Votre nom complet"
                          error={errors.name?.message}
                          variant="filled"
                          inputSize="lg"
                          fullWidth
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Email *
                        </label>
                        <Input
                          {...register("email")}
                          type="email"
                          placeholder="votre@email.com"
                          error={errors.email?.message}
                          variant="filled"
                          inputSize="lg"
                          fullWidth
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Sujet *
                      </label>
                      <Input
                        {...register("subject")}
                        placeholder="Objet de votre message"
                        error={errors.subject?.message}
                        variant="filled"
                        inputSize="lg"
                        fullWidth
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Message *
                      </label>
                      <Textarea
                        {...register("message")}
                        placeholder="Décrivez votre demande en détail..."
                        rows={6}
                        error={errors.message?.message}
                        variant="filled"
                        inputSize="lg"
                        fullWidth
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                        fullWidth
                        className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <motion.span
                              className="mr-3 text-xl"
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
                          <span className="flex items-center justify-center">
                            <span className="mr-3 text-xl">📨</span>
                            Envoyer le message
                          </span>
                        )}
                      </Button>
                    </motion.div>
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
