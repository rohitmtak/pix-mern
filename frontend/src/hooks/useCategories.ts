import { useState, useEffect } from 'react';
import { categoriesApi, CategoriesResponse, SubCategoriesResponse } from '@/lib/api';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesApi.getCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refetch = () => {
    fetchCategories();
  };

  return { categories, loading, error, refetch };
};

export const useSubCategories = () => {
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesApi.getSubCategories();
      if (response.success) {
        setSubCategories(response.data);
      } else {
        setError('Failed to fetch subcategories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const refetch = () => {
    fetchSubCategories();
  };

  return { subCategories, loading, error, refetch };
};
