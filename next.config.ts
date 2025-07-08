import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclure les fichiers de seed du build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "prisma/seed": "commonjs prisma/seed",
      });
    }
    return config;
  },

  // Configuration pour Vercel
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
