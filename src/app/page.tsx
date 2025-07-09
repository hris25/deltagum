import {
  ContactSection,
  FAQSection,
  HeroSection,
  TestimonialsSection,
} from "@/components/sections";
import ProductOverview from "@/components/sections/ProductOverview";

export default function Home() {
  return (
    <main>
      {/* Section d'accueil avec hero */}
      <HeroSection />

      {/* Section des produits */}
      <ProductOverview />

      {/* Section des témoignages */}
      <TestimonialsSection />

      {/* Section FAQ */}
      <FAQSection />

      {/* Section de contact */}
      <ContactSection />
    </main>
  );
}
