// Traduction des saveurs
export const flavorTranslations = {
  STRAWBERRY: "Fraise",
  BLUEBERRY: "Myrtille",
  APPLE: "Pomme",
} as const;

export type FlavorType = keyof typeof flavorTranslations;

export function translateFlavor(flavor: string): string {
  return flavorTranslations[flavor as FlavorType] || flavor;
}

// Descriptions des saveurs
export const flavorDescriptions = {
  STRAWBERRY:
    "Saveur fraise naturelle, douce et fruitée pour une expérience gustative délicieuse.",
  BLUEBERRY:
    "Saveur myrtille authentique, légèrement acidulée avec des notes sucrées.",
  APPLE:
    "Saveur pomme fraîche et croquante, parfaitement équilibrée entre douceur et fraîcheur.",
} as const;

export function getFlavorDescription(flavor: string): string {
  return (
    flavorDescriptions[flavor as FlavorType] ||
    "Délicieux délice Deltagum aux saveurs naturelles."
  );
}
