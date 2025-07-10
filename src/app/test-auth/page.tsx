"use client";

import { Button } from "@/components/ui";
import { useState } from "react";

export default function TestAuth() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuthAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const data = await response.json();
      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: "admin@deltagum.com",
          password: "admin123",
        }),
      });

      const data = await response.json();
      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const checkCookies = () => {
    setResult({
      cookies: document.cookie,
      localStorage: localStorage.getItem("auth-storage"),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test d'Authentification
        </h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex space-x-4">
            <Button onClick={testLogin} disabled={loading}>
              Test Login Admin
            </Button>
            <Button onClick={testAuthAPI} disabled={loading}>
              Test API /auth/me
            </Button>
            <Button onClick={checkCookies} disabled={loading}>
              Vérifier Cookies
            </Button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Résultat :</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8">
          <a
            href="/admin/dashboard"
            className="text-pink-600 hover:text-pink-700 underline"
          >
            → Aller au Dashboard Admin
          </a>
        </div>
      </div>
    </div>
  );
}
