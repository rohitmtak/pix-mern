import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock wishlist data
const mockWishlistProducts = [
  {
    id: "3",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/bdbf39600435e40a6f9b6e8648985bdc886f117b?width=841",
    title: "MARGOT",
    price: "120000/-",
    category: "Signature Collection",
    alt: "Signature Collection Product 3",
    isWishlisted: true
  },
  {
    id: "4",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/70502f0f5e1eb5199d05b1e35468e1ad7c937629?width=841",
    title: "AMETHYST",
    price: "120000/-",
    category: "Signature Collection",
    alt: "Signature Collection Product 4",
    isWishlisted: true
  }
];

const WishlistPage = () => {
  const [wishlistProducts, setWishlistProducts] = useState(mockWishlistProducts);

  const handleWishlistToggle = (productId: string, isWishlisted: boolean) => {
    if (!isWishlisted) {
      // Remove from wishlist
      setWishlistProducts(prev => prev.filter(product => product.id !== productId));
    } else {
      // Update wishlist status
      setWishlistProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, isWishlisted }
            : product
        )
      );
    }
  };

  const handleClearWishlist = () => {
    setWishlistProducts([]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-36">
        <div className="container mx-auto px-16 py-16">
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 
              className="text-black font-normal uppercase mb-8"
              style={{
                fontSize: '50px',
                fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                fontWeight: 400,
                lineHeight: '60px',
                color: 'rgba(0,0,0,1)'
              }}
            >
              Your Wishlist
            </h1>
            
            {wishlistProducts.length > 0 && (
              <div className="flex justify-center gap-4">
                <p 
                  className="text-gray-600"
                  style={{
                    fontSize: '18px',
                    fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif'
                  }}
                >
                  {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearWishlist}
                  className="text-sm border-gray-300 hover:bg-gray-50"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Wishlist Content */}
          {wishlistProducts.length === 0 ? (
            // Empty State
            <div className="text-center py-24">
              <div className="mb-8">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto text-gray-300"
                >
                  <path
                    d="M1.52148 7.14813C1.52167 14.7411 7.59578 18.5377 12.1515 21.9545C16.3276 18.5377 22.4019 14.741 22.4019 7.14823C22.4019 -0.444532 12.1515 0.518484 12.1515 6.389C12.1515 0.138746 1.5213 -0.444835 1.52148 7.14813Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              
              <h2 
                className="text-black font-normal mb-4"
                style={{
                  fontSize: '32px',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 400
                }}
              >
                Your wishlist is empty
              </h2>
              
              <p 
                className="text-gray-600 mb-8 max-w-md mx-auto"
                style={{
                  fontSize: '16px',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  lineHeight: '24px'
                }}
              >
                Save items you love by clicking the heart icon on any product. They'll appear here for easy shopping later.
              </p>
              
              <Button 
                onClick={() => window.location.href = '/collection'}
                className="bg-black text-white hover:bg-gray-800 px-8 py-3"
              >
                EXPLORE COLLECTION
              </Button>
            </div>
          ) : (
            // Products Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlistProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  imageUrl={product.imageUrl}
                  title={product.title}
                  price={product.price}
                  category={product.category}
                  alt={product.alt}
                  isWishlisted={product.isWishlisted}
                  onWishlistToggle={handleWishlistToggle}
                  className="h-full"
                />
              ))}
            </div>
          )}

          {/* Recommended Products Section */}
          {wishlistProducts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-gray-200">
              <div className="text-center mb-12">
                <h2 
                  className="text-black font-normal uppercase"
                  style={{
                    fontSize: '32px',
                    fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                    fontWeight: 400,
                    color: 'rgba(0,0,0,1)'
                  }}
                >
                  You might also like
                </h2>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => window.location.href = '/collection'}
                  variant="outline"
                  className="border-black text-black hover:bg-gray-50 px-8 py-3"
                >
                  VIEW MORE PRODUCTS
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WishlistPage;
