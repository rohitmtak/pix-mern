import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/WishlistContext";

const WishlistPage = () => {
  const { state: wishlistState, clearWishlist } = useWishlist();
  const wishlistProducts = wishlistState.items;

  const handleWishlistToggle = (productId: string, isWishlisted: boolean) => {
    // This function is now handled by the WishlistButton component
    // No need to manage local state here
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-36">
        <div className="container mx-auto px-16 py-16">
          
          {/* Page Header */}
          <div className="text-center mb-8">
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
             Wishlist
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
            <div className="text-center py-10">           
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
                  id={product.productId}
                  imageUrl={product.imageUrl}
                  title={product.name}
                  price={`₹${product.price}`}
                  category={product.category}
                  alt={product.name}
                  isWishlisted={true}
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
