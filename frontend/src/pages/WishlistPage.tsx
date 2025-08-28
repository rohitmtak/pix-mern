import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/hooks/useProducts";
import { showToast, toastMessages } from "@/config/toastConfig";
import { isAuthenticated } from "@/utils/auth";

const WishlistPage = () => {
  const { state: wishlistState, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistProducts = wishlistState.items;
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const { product: modalProduct } = useProduct(selectedProductId);

  const availableSizes = useMemo(() => {
    const sizesSet = new Set<string>();
    if (modalProduct?.colorVariants) {
      modalProduct.colorVariants.forEach(variant => {
        if (variant.sizes) {
          variant.sizes.forEach((s: string) => sizesSet.add(s));
        }
      });
    }
    return Array.from(sizesSet);
  }, [modalProduct]);

  const firstVariant = modalProduct?.colorVariants?.[0];

  const openSizeModal = (productId: string) => {
    setSelectedProductId(productId);
    setSelectedSize("");
    setIsSizeModalOpen(true);
  };

  const handleConfirmMove = () => {
    if (!modalProduct || !selectedSize) return;
    addToCart({
      productId: modalProduct._id,
      name: modalProduct.name,
      price: firstVariant?.price || 0,
      size: selectedSize,
      color: firstVariant?.color || "",
      quantity: 1,
      imageUrl: firstVariant?.images?.[0] || "",
    });
    removeFromWishlist(modalProduct._id);
    setIsSizeModalOpen(false);
    showToast.success(
      toastMessages.wishlist.movedToCart(modalProduct.name, selectedSize)
    );
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-24">
        <div className="container mx-auto px-16 py-16">
          
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-black font-normal uppercase mb-8 text-2xl"
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
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'}
                </p>
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
            <>
              {/* Login Message for Guest Users */}
              {!isAuthenticated() && (
                <div className="text-center py-6 mb-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-lg mb-2">
                    Wishlist is not saved permanently yet. Please{" "}
                    <button 
                      onClick={() => window.location.href = '/login'}
                      className="text-blue-600 underline hover:text-blue-800 font-medium"
                    >
                      log in
                    </button>
                    {" "}or{" "}
                    <button 
                      onClick={() => window.location.href = '/login'}
                      className="text-blue-600 underline hover:text-blue-800 font-medium"
                    >
                      Create Account
                    </button>
                    {" "}to save it.
                  </p>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="relative flex flex-col gap-0">
                    {/* Remove icon overlay */}
                    <button
                      aria-label="Remove from wishlist"
                                              onClick={() => {
                          removeFromWishlist(product.productId);
                          showToast.success(
                            toastMessages.wishlist.removed(product.name)
                          );
                        }}
                      className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 border border-gray-300 text-gray-500 hover:text-black shadow-sm flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                      </svg>
                    </button>

                    <ProductCard
                      id={product.productId}
                      imageUrl={product.imageUrl}
                      title={product.name}
                      price={`Rs.${product.price}`}
                      category={product.category}
                      alt={product.name}
                      isWishlisted={true}
                      showWishlist={false}
                      compact
                      centered
                      contentWrapperClassName="border-x border-gray-200"
                      className="h-full"
                    />

                    {/* Minimal move action */}
                    <div className="border-x border-t border-b border-gray-200">
                      <button
                        onClick={() => openSizeModal(product.productId)}
                        className="w-full text-center uppercase text-xs tracking-wide text-gray-700 hover:text-black font-medium py-2"
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
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
          <Dialog open={isSizeModalOpen} onOpenChange={setIsSizeModalOpen}>
            <DialogContent className="sm:max-w-[520px] rounded-none sm:rounded-none">
              <DialogHeader>
                <DialogTitle className="text-base">Select Size</DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div className="flex items-center gap-4 pb-4 mb-2 border-b border-gray-200">
                  {firstVariant?.images?.[0] && (
                    <img src={firstVariant.images[0]} alt={modalProduct?.name || ''} className="w-16 h-16 object-cover" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-black">{modalProduct?.name}</div>
                    <div className="text-sm text-black">Rs.{firstVariant?.price ?? ''}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-3">Select Size</div>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded-full border text-sm flex items-center justify-center transition-colors ${
                          selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full text-sm font-normal bg-black text-white hover:bg-gray-800"
                  disabled={!selectedSize}
                  onClick={handleConfirmMove}
                >
                  Done
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WishlistPage;
