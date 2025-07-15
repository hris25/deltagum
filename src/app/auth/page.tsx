"use client";

import { Button, Input } from "@/components/ui";
import { useAuth } from "@/stores";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const { login, register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      if (isForgotPassword) {
        // Gérer la demande de réinitialisation
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await response.json();

        if (data.success) {
          setSuccessMessage(data.message);
        } else {
          setErrors({ general: data.error });
        }
      } else if (isLogin) {
        await login(formData.email, formData.password);
        router.push("/");
      } else {
        await register(formData);
        router.push("/");
      }
    } catch (error: any) {
      setErrors({ general: error.message || "Une erreur est survenue" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <Link href="/" className="flex justify-center">
            <img
              className="h-12 w-auto"
              src="/img/logo.png"
              alt="Deltagum"
              onError={(e) => {
                e.currentTarget.src = "/img/placeholder.svg";
              }}
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
            {isForgotPassword
              ? "Mot de passe oublié"
              : isLogin
              ? "Connexion"
              : "Créer un compte"}
          </h2>
          <p className="mt-2 text-center text-sm text-black">
            {isForgotPassword ? (
              <>
                Vous vous souvenez de votre mot de passe ?{" "}
                <button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsLogin(true);
                    setSuccessMessage("");
                    setErrors({});
                  }}
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  Se connecter
                </button>
              </>
            ) : isLogin ? (
              <>
                Pas encore de compte ?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  S'inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>

        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Email */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-3"
              >
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5 z-10" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-pink-500 focus:ring-2 transition-all duration-200"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Champs supplémentaires pour l'inscription */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-black mb-2"
                    >
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full pl-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-pink-500 focus:ring-2 transition-all duration-200"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-black mb-2"
                    >
                      Nom
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full h-14 text-base border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-pink-500 focus:ring-2 transition-all duration-200"
                      placeholder="Votre nom"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-black mb-3"
                  >
                    Téléphone (optionnel)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full h-14 text-base border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-pink-500 focus:ring-2 transition-all duration-200"
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-black mb-3"
                  >
                    Adresse (optionnel)
                  </label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    className="w-full h-14 text-base border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-pink-500 focus:ring-2 transition-all duration-200"
                    placeholder="123 rue de la Paix"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-black mb-2"
                    >
                      Code postal
                    </label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      className="w-full h-14 text-base border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-pink-500 focus:ring-2 transition-all duration-200"
                      placeholder="75001"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-black mb-2"
                    >
                      Ville
                    </label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      className="w-full h-14 text-base border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-pink-500 focus:ring-2 transition-all duration-200"
                      placeholder="Paris"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Mot de passe - masqué en mode "mot de passe oublié" */}
            {!isForgotPassword && (
              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black mb-3"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5 z-10" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-12 pr-14 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-pink-500 focus:ring-2 transition-all duration-200"
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-black transition-colors z-10 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="mt-1 text-xs text-black">
                    Minimum 6 caractères
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm text-center">
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm text-center">
              {successMessage}
            </div>
          )}

          {/* Bouton de soumission */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full h-16 text-lg font-semibold bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 focus:ring-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading
                ? "Chargement..."
                : isForgotPassword
                ? "Envoyer le lien de réinitialisation"
                : isLogin
                ? "Se connecter"
                : "Créer mon compte"}
            </Button>
          </div>

          {/* Lien "Mot de passe oublié" en mode connexion */}
          {isLogin && !isForgotPassword && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setIsLogin(false);
                  setErrors({});
                  setSuccessMessage("");
                }}
                className="text-sm text-pink-600 hover:text-pink-500 font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          {/* Avertissement 18+ */}
          <div className="text-center pt-4 border-t border-gray-100">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800">
              <p className="text-sm font-medium">
                🔞 Réservé aux personnes majeures (18+)
              </p>
              <p className="text-xs mt-1">
                En vous inscrivant, vous confirmez avoir 18 ans ou plus
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;
