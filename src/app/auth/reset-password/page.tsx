"use client";

import { Button, Input } from "@/components/ui";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/auth");
    }
  }, [token, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push("/auth");
        }, 3000);
      } else {
        setErrors({ general: data.error });
      }
    } catch (error) {
      setErrors({ general: "Une erreur est survenue" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // Ou un loader
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Mot de passe réinitialisé !
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Votre mot de passe a été mis à jour avec succès.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirection vers la page de connexion...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Nouveau mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Nouveau mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 h-12 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                  placeholder="Votre nouveau mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirmer le mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 h-12 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Erreur générale */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm text-center">
              {errors.general}
            </div>
          )}

          {/* Conseils de sécurité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm font-medium mb-2">Conseils pour un mot de passe sécurisé :</p>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>• Au moins 6 caractères</li>
              <li>• Mélangez lettres, chiffres et symboles</li>
              <li>• Évitez les informations personnelles</li>
            </ul>
          </div>

          {/* Bouton de soumission */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-12 text-lg font-semibold bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>

          {/* Retour à la connexion */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/auth")}
              className="text-sm text-pink-600 hover:text-pink-500 font-medium"
            >
              Retour à la connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
