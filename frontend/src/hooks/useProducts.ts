import { useState, useEffect } from 'react';
import { productsApi, ProductsResponse, Product } from '@/lib/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refetch = () => {
    fetchProducts();
  };

  return { products, loading, error, refetch };
};

export const useProductsByCategory = (category: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getProductsByCategory(category);
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [category]);

  const refetch = () => {
    fetchProducts();
  };

  return { products, loading, error, refetch };
};

export const useProductsBySubCategory = (subCategory: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getProductsBySubCategory(subCategory);
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subCategory) {
      fetchProducts();
    }
  }, [subCategory]);

  const refetch = () => {
    fetchProducts();
  };

  return { products, loading, error, refetch };
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getProduct(productId);
      
      if (response.success) {
        setProduct(response.data);
      } else {
        setError('Failed to fetch product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const refetch = () => {
    fetchProduct();
  };

  return { product, loading, error, refetch };
};

export const useBestsellerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getBestsellerProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to fetch bestseller products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refetch = () => {
    fetchProducts();
  };

  return { products, loading, error, refetch };
};
