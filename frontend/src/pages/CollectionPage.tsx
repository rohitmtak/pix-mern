import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import GridLayoutToggle from "@/components/GridLayoutToggle";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import { getCategoryBySlug, isValidCategorySlug, PRODUCT_CATEGORIES } from "@/constants/categories";

import { showToast, toastMessages } from "@/config/toastConfig";

const CollectionPage = () => {
  const [gridLayout, setGridLayout] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const { category: categorySlug } = useParams<{ category: string }>();
  
  // Get category from URL parameter
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  // Fetch products from API
  const {
    products,
    loading: isLoading,
    error,
    refetch
  } = useProducts();

  // Filter products based on category
  const filteredProducts = products.filter(product => {
    const matchesCategory = !category || product.category === category;
    return matchesCategory;
  });

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // Pagination logic
  const productsPerPage = 20;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleWishlistToggle = (productId: string, isWishlisted: boolean) => {
    // Show simple toast message for wishlist actions
    if (isWishlisted) {
      // Product was added to wishlist
      showToast.success(
        toastMessages.wishlist.added("Item")
      );
    } else {
      // Product was removed from wishlist
      showToast.info(
        toastMessages.wishlist.removed("Item")
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get category display name
  const getCategoryDisplayName = (category: string | undefined) => {
    if (!category) return "All Collection";
    return category.toUpperCase();
  };

  // Redirect to 404 if invalid category slug
  if (categorySlug && !isValidCategorySlug(categorySlug)) {
    return <Navigate to="/404" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-24">
          <div className="container mx-auto px-16 py-16">
            <Error
              title="Error Loading Products"
              message={error || "Failed to load products. Please try again."}
              onRetry={() => refetch()}
              retryText="Retry"
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-24">
        {/* Page Title */}
        <div className="flex justify-center pt-8 pb-6">
          <h1
            className="text-black text-center font-normal uppercase text-2xl"
          >
            <span>{getCategoryDisplayName(category)}</span>
          </h1>
        </div>

        {/* Filter Controls */}
        <div className="px-16 pb-8">
          <div className="flex justify-end">
            {/* Grid Layout Toggle */}
            <GridLayoutToggle
              currentLayout={gridLayout}
              onLayoutChange={setGridLayout}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="px-16 pb-16">
            <Loading size="lg" text="Loading products..." className="py-16" />
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && currentProducts.length > 0 && (
          <div className="px-16 pb-16">
            <ProductGrid
              products={currentProducts}
              columns={gridLayout}
              onWishlistToggle={handleWishlistToggle}
            />
          </div>
        )}

        {/* No Products Found */}
        {!isLoading && currentProducts.length === 0 && (
          <div className="px-16 pb-16">
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                {category 
                  ? `No products found in ${getCategoryDisplayName(category)}.` 
                  : "No products available at the moment."}
              </p>
              {category && (
                <button
                  onClick={() => window.location.href = "/collection"}
                  className="mt-4 px-6 py-2 text-black border border-black rounded hover:bg-black hover:text-white transition-colors"
                >
                  View All Products
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-16 pb-16">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  "px-4 py-2 rounded border transition-colors",
                  currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
                )}
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        "px-3 py-2 rounded border transition-colors",
                        currentPage === pageNum
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  "px-4 py-2 rounded border transition-colors",
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
                )}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CollectionPage;
