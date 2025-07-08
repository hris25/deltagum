import {
  CartSection,
  CheckoutSection,
  ContactSection,
  FAQSection,
  HeroSection,
  ProductSection,
  TestimonialsSection,
} from "@/components/sections";

export default function Home() {
  return (
    <main>
      {/* Section d'accueil avec hero */}
      <HeroSection />

      {/* Section des produits */}
      <ProductSection />

      {/* Section du panier */}
      <CartSection />

      {/* Section de commande/checkout */}
      <CheckoutSection />

      {/* Section des témoignages */}
      <TestimonialsSection />

      {/* Section FAQ */}
      <FAQSection />

      {/* Section de contact */}
      <ContactSection />
    </main>
  );
}
