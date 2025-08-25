// Product Categories Constants - Shared with backend
export const PRODUCT_CATEGORIES = {
  SIGNATURE: "Signature Collection",
  BRIDAL: "Bridal Couture", 
  CONTEMPORARY: "Contemporary Drapes",
  LUXURY: "Luxury Fusion Lounge"
} as const;

// Category slugs for URLs
export const CATEGORY_SLUGS = {
  "Signature Collection": "signature",
  "Bridal Couture": "bridal",
  "Contemporary Drapes": "contemporary",
  "Luxury Fusion Lounge": "luxury"
} as const;

// Reverse mapping from slugs to full names
export const SLUG_TO_CATEGORY = {
  signature: "Signature Collection",
  bridal: "Bridal Couture",
  contemporary: "Contemporary Drapes",
  luxury: "Luxury Fusion Lounge"
} as const;

// Type definitions
export type CategorySlug = keyof typeof SLUG_TO_CATEGORY;
export type CategoryName = typeof PRODUCT_CATEGORIES[keyof typeof PRODUCT_CATEGORIES];

// Utility functions
export const getCategoryBySlug = (slug: string): CategoryName | undefined => {
  return SLUG_TO_CATEGORY[slug as CategorySlug];
};

export const getSlugByCategory = (category: CategoryName): CategorySlug | undefined => {
  return CATEGORY_SLUGS[category];
};

export const isValidCategorySlug = (slug: string): slug is CategorySlug => {
  return slug in SLUG_TO_CATEGORY;
};
