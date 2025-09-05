// Product Categories and Subcategories Constants
export const PRODUCT_CATEGORIES = {
  SIGNATURE: "Signature Collection",
  BRIDAL: "Bridal Couture", 
  CONTEMPORARY: "Contemporary Drapes",
  LUXURY: "Luxury Fusion Lounge"
};

export const PRODUCT_SUBCATEGORIES = {
  // No subcategories defined yet - keeping functionality optional
};

// Validation function to check if a category is valid
export const isValidCategory = (category) => {
  return Object.values(PRODUCT_CATEGORIES).includes(category);
};

// Validation function to check if a subcategory is valid
export const isValidSubcategory = (subcategory) => {
  // Allow empty string since subcategory is optional
  if (!subcategory || subcategory.trim() === '') {
    return true;
  }
  return Object.values(PRODUCT_SUBCATEGORIES).includes(subcategory);
};

// Get all categories as an array
export const getAllCategories = () => Object.values(PRODUCT_CATEGORIES);

// Get all subcategories as an array
export const getAllSubcategories = () => Object.values(PRODUCT_SUBCATEGORIES);
