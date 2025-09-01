/**
 * Utility functions for consistent price formatting across the application
 */

/**
 * Formats a price value with proper comma separators and currency symbol
 * @param price - The price value (number or string)
 * @param currency - The currency symbol (default: '₹')
 * @param locale - The locale for number formatting (default: 'en-IN' for Indian format)
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number | string,
  currency: string = '₹',
  locale: string = 'en-IN'
): string => {
  // Convert string to number if needed
  let numericPrice: number;
  
  if (typeof price === 'string') {
    // Remove any existing currency symbols and non-numeric characters except decimal
    const cleanedPrice = price.replace(/[^0-9.]/g, '');
    numericPrice = parseFloat(cleanedPrice) || 0;
  } else {
    numericPrice = price;
  }

  // Format with proper comma separators
  const formattedNumber = numericPrice.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return `${currency}${formattedNumber}`;
};

/**
 * Formats a price for display in product cards and lists
 * @param price - The price value
 * @returns Formatted price string
 */
export const formatProductPrice = (price: number | string): string => {
  return formatPrice(price, '₹');
};

/**
 * Formats a price for display in cart and checkout
 * @param price - The price value
 * @returns Formatted price string
 */
export const formatCartPrice = (price: number | string): string => {
  return formatPrice(price, '₹');
};

/**
 * Formats a price for display in order summaries
 * @param price - The price value
 * @returns Formatted price string
 */
export const formatOrderPrice = (price: number | string): string => {
  return formatPrice(price, '₹');
};

/**
 * Extracts numeric value from a formatted price string
 * @param formattedPrice - The formatted price string
 * @returns Numeric value
 */
export const extractNumericPrice = (formattedPrice: string): number => {
  const cleanedPrice = formattedPrice.replace(/[^0-9.]/g, '');
  return parseFloat(cleanedPrice) || 0;
};

/**
 * Formats a range of prices (for products with multiple variants)
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string
 */
export const formatPriceRange = (
  minPrice: number | string,
  maxPrice: number | string
): string => {
  const min = typeof minPrice === 'string' ? extractNumericPrice(minPrice) : minPrice;
  const max = typeof maxPrice === 'string' ? extractNumericPrice(maxPrice) : maxPrice;
  
  if (min === max) {
    return formatProductPrice(min);
  }
  
  return `${formatProductPrice(min)} - ${formatProductPrice(max)}`;
};
