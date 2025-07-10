import { useAuth } from "@/stores";
import { useEffect } from "react";

export function useAuthInit() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Vérifier l'authentification au démarrage de l'application
    checkAuth();
  }, [checkAuth]);
}
