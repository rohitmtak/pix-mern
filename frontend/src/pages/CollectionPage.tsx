import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import GridLayoutToggle from "@/components/GridLayoutToggle";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

const CollectionPage = () => {
  const [gridLayout, setGridLayout] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from API
  const {
    products,
    loading: isLoading,
    error,
    refetch
  } = useProducts();

  // Fetch categories for filtering
  const { categories } = useCategories();

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const productsPerPage = 20;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleWishlistToggle = (productId: string, isWishlisted: boolean) => {
    // The WishlistButton component now handles the context operations directly
    // This function is kept for any additional logic that might be needed
    console.log(`Product ${productId} wishlist toggled to ${isWishlisted}`);
  };

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            className="text-black text-center font-normal uppercase"
            style={{
              width: '635px',
              fontSize: '25px',
              fontWeight: 400,
              color: 'rgba(0,0,0,1)'
            }}
          >
            <span>SIGNATURE Collection</span>
          </h1>
        </div>

        {/* Search and Filter Controls */}
        <div className="px-16 pb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory || ""}
                onChange={(e) => handleCategoryChange(e.target.value || undefined)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

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
                {searchQuery || selectedCategory 
                  ? "No products found matching your criteria." 
                  : "No products available at the moment."}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(undefined);
                  }}
                  className="mt-4 px-6 py-2 text-black border border-black rounded hover:bg-black hover:text-white transition-colors"
                >
                  Clear Filters
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
