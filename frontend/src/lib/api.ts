import { config } from '@/config/env';

// Use the configured API base URL (handles dev/prod and HTTPS automatically)
const API_BASE_URL = config.api.baseUrl;

export interface ColorVariant {
  color: string;
  price: number;
  stock: number;
  sizes: string[];
  images: string[];
  video?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  bestseller: boolean;
  colorVariants: ColorVariant[];
  date: number;
}

export interface Category {
  name: string;
  value: string;
}

export interface SubCategory {
  name: string;
  value: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface CategoriesResponse {
  success: boolean;
  data: string[];
}

export interface SubCategoriesResponse {
  success: boolean;
  data: string[];
}

// Generic API call function with CORS handling
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'include', // Include credentials for CORS
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    
    // If it's a CORS error, provide a helpful message
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('CORS error: Unable to connect to the API. Please check if the backend server is running and CORS is properly configured.');
    }
    
    throw error;
  }
}

// Products API
export const productsApi = {
  // Get all products
  getProducts: async (): Promise<ProductsResponse> => {
    return apiCall<ProductsResponse>('/product/list');
  },

  // Get single product by ID
  getProduct: async (productId: string): Promise<ProductResponse> => {
    const response = await fetch(`${API_BASE_URL}/product/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    const products = await apiCall<ProductsResponse>('/product/list');
    if (products.success) {
      const filteredProducts = {
        ...products,
        data: products.data.filter(product => product.category === category)
      };
      return filteredProducts;
    }
    return products;
  },

  // Get products by subcategory
  getProductsBySubCategory: async (subCategory: string): Promise<ProductsResponse> => {
    const products = await apiCall<ProductsResponse>('/product/list');
    if (products.success) {
      const filteredProducts = {
        ...products,
        data: products.data.filter(product => product.subCategory === subCategory)
      };
      return filteredProducts;
    }
    return products;
  },

  // Get bestseller products
  getBestsellerProducts: async (): Promise<ProductsResponse> => {
    const products = await apiCall<ProductsResponse>('/product/list');
    if (products.success) {
      const bestsellerProducts = {
        ...products,
        data: products.data.filter(product => product.bestseller)
      };
      return bestsellerProducts;
    }
    return products;
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getCategories: async (): Promise<CategoriesResponse> => {
    return apiCall<CategoriesResponse>('/product/categories');
  },

  // Get all subcategories
  getSubCategories: async (): Promise<SubCategoriesResponse> => {
    return apiCall<SubCategoriesResponse>('/product/subcategories');
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  return apiCall<{ status: string; message: string }>('/');
};
