import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/lib/api';
import { cn } from "@/lib/utils";
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductGridProps {
  products?: Product[];
  loading?: boolean;
  error?: string | null;
  onProductClick?: (product: Product) => void;
  className?: string;
  columns?: number;
  onWishlistToggle?: (productId: string, isWishlisted: boolean) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products: propProducts,
  loading: propLoading,
  error: propError,
  onProductClick,
  className = '',
  columns = 4,
  onWishlistToggle
}) => {
  // Always call the hook, but only use it when no products are passed as props
  const { products: hookProducts, loading: hookLoading, error: hookError } = useProducts();
  const { isInWishlist } = useWishlist();
  
  const products = propProducts || hookProducts;
  const loading = propLoading !== undefined ? propLoading : hookLoading;
  const error = propError !== undefined ? propError : hookError;

  const getLayoutConfig = () => {
    switch (columns) {
      case 2:
        return { width: "w-[49.5%]", gap: "1%" }; // 2 columns with 2% gap
      case 3:
        return { width: "w-[32.5%]", gap: "1.25%" }; // 3 columns with 1.5% gap
      case 4:
        return { width: "w-[24.25%]", gap: "1%" }; // 4 columns with 1% gap
      default:
        return { width: "w-[24.25%]", gap: "1%" }; // Default to 4 columns
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-wrap w-full ${className}`} style={{ gap: getLayoutConfig().gap }}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className={cn(getLayoutConfig().width, "animate-pulse")}>
            <div className="bg-gray-200 aspect-[4/5] rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-500 text-lg mb-2">Error loading products</div>
        <div className="text-gray-600">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 text-lg">No products found</div>
        <div className="text-gray-400 text-sm">Check back later for new arrivals</div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div 
        className={cn(
          "flex flex-wrap w-full",
          "transition-all duration-1000 ease-in-out"
        )}
        style={{ gap: getLayoutConfig().gap }}
      >
        {products.map((product, index) => {
          console.log('Product in ProductGrid:', { 
            _id: product._id, 
            name: product.name, 
            category: product.category,
            isWishlisted: isInWishlist(product._id)
          });
          
          return (
            <div 
              key={product._id || index}
              className={cn(
                getLayoutConfig().width,
                "transition-all duration-1000 ease-in-out"
              )}
            >
              <ProductCard
                id={product._id}
                imageUrl={product.colorVariants?.[0]?.images?.[0] || "/placeholder.svg"}
                title={product.name}
                price={`₹${product.colorVariants?.[0]?.price || 0}`}
                category={product.category}
                alt={product.name}
                isWishlisted={isInWishlist(product._id)}
                onWishlistToggle={onWishlistToggle}
                className="h-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
