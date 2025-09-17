import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WishlistButton from "@/components/WishlistButton";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { showToast, toastMessages } from "@/config/toastConfig";
import { cn } from "@/lib/utils";
import { formatProductPrice } from '@/utils/priceUtils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "materials"
  >("description");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState<"inches" | "cm">("inches");
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [galleryApi, setGalleryApi] = useState<CarouselApi | null>(null);
  const [showSizePrompt, setShowSizePrompt] = useState(false);

  // Cart and wishlist hooks
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();


  // Fetch product details from API
  const {
    product,
    loading: isLoading,
    error: isError,
    refetch,
  } = useProduct(id || "");



  // Debug logging for product data
  useEffect(() => {
    if (product) {
      // console.log('Product loaded:', product);
      // console.log('Color variants:', product.colorVariants);
    }
  }, [product]);

  // Set default selected color when product loads
  useEffect(() => {
    if (product && product.colorVariants && product.colorVariants.length > 0) {
      // Check if product has only "None" color (single product)
      const hasOnlyNoneColor = product.colorVariants.length === 1 && 
                               product.colorVariants[0].color === "None";
      
      if (hasOnlyNoneColor) {
        // For single products, set "None" as selected but don't show color selector
        setSelectedColor("None");
      } else {
        // For multi-color products, set default color from first color variant
        setSelectedColor(product.colorVariants[0].color);
      }
      // Reset size selection to empty - user must choose
      setSelectedSize("");
    }
  }, [product]);

  // Reset image index when color changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  // Keep main carousel in sync when current image changes
  useEffect(() => {
    if (galleryApi) {
      galleryApi.scrollTo(currentImageIndex);
    }
  }, [currentImageIndex, galleryApi]);

  // Update current image when user scrolls main carousel
  useEffect(() => {
    if (!galleryApi) return;
    const onSelect = () =>
      setCurrentImageIndex(galleryApi.selectedScrollSnap());
    galleryApi.on("select", onSelect);
    return () => {
      galleryApi.off("select", onSelect);
    };
  }, [galleryApi]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-24">
          <div className="container mx-auto px-0 py-16">
            <Loading size="lg" text="Loading product..." className="py-16" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-24">
          <div className="container mx-auto px-0 py-16">
            <Error
              title={isError ? "Error Loading Product" : "Product not found"}
              message={
                isError
                  ? "Failed to load product. Please try again."
                  : "The product you're looking for doesn't exist."
              }
              onRetry={isError ? () => refetch() : undefined}
              retryText="Retry"
            />
            <div className="mt-6 text-center">
              <Button onClick={() => navigate("/collection")}>
                Back to Collection
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get current color variant data for pricing
  const getCurrentColorVariant = () => {
    if (
      !product ||
      !product.colorVariants ||
      product.colorVariants.length === 0
    ) {
      return null;
    }

    return product.colorVariants.find(
      (variant) => variant.color.toLowerCase() === selectedColor.toLowerCase()
    );
  };

  const currentColorVariant = product ? getCurrentColorVariant() : null;

  const handleWishlistToggle = (productId: string, isWishlisted: boolean) => {
    // Show simple toast message for wishlist actions
    if (isWishlisted) {
      // Product was added to wishlist
      showToast.success(
        toastMessages.wishlist.added
      );
    } else {
      // Product was removed from wishlist
      showToast.info(
        toastMessages.wishlist.removed
      );
    }
  };

  const handleColorSelection = (color: string) => {
    if (color === selectedColor) return; // Don't do anything if same color selected

    setSelectedColor(color);
    setCurrentImageIndex(0); // Reset to first image when color changes
    setSelectedSize(""); // Reset size selection when color changes
  };

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    setShowSizePrompt(false); // Hide prompt when size is selected
  };

  // Get available sizes and colors from color variants
  const getAvailableSizes = () => {
    if (!product || !product.colorVariants || !selectedColor) return [];

    // Find the color variant for the selected color
    const selectedColorVariant = product.colorVariants.find(
      variant => variant.color.toLowerCase() === selectedColor.toLowerCase()
    );

    // Return sizes only for the selected color variant
    return selectedColorVariant?.sizes || [];
  };

  const getAvailableColors = () => {
    if (!product || !product.colorVariants) return [];
    // Filter out "None" colors - they shouldn't be shown to customers
    return product.colorVariants
      .map((variant) => variant.color)
      .filter(color => color !== "None");
  };

  const sizes = getAvailableSizes();
  const colors = getAvailableColors();

  // Get images and videos for the selected color variant
  const getMediaForColor = (color: string) => {
    if (
      !product ||
      !product.colorVariants ||
      product.colorVariants.length === 0
    ) {
      return []; // Return empty array if no color variants
    }

    // Find color variant that matches the selected color
    const colorVariant = product.colorVariants.find(
      (variant) => variant.color.toLowerCase() === color.toLowerCase()
    );

    if (!colorVariant) return [];

    const media = [];
    
    // Add images
    if (colorVariant.images && colorVariant.images.length > 0) {
      media.push(...colorVariant.images.map(img => ({ type: 'image', url: img })));
    }
    
    // Add video if it exists
    if (colorVariant.video && colorVariant.video.trim() !== '') {
      media.push({ type: 'video', url: colorVariant.video });
    }

    return media;
  };

  // Get current media (images and videos) based on selected color
  const currentMedia = product ? getMediaForColor(selectedColor) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Product Gallery */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Main Media - Carousel */}
              <div className="relative overflow-hidden bg-transparent group">
                {currentMedia.length > 0 ? (
                  <>
                    <Carousel
                      setApi={setGalleryApi}
                      opts={{
                        loop: true,
                        align: "start",
                        containScroll: "trimSnaps",
                      }}
                      className=""
                    >
                      <CarouselContent className="ml-0">
                        {currentMedia.map((media, index) => (
                          <CarouselItem key={index} className="pl-0">
                            {media.type === 'video' ? (
                              <div className="relative">
                                <video
                                  src={media.url}
                                  controls
                                  muted
                                  loop
                                  className="w-full h-auto video-hover-controls"
                                  onContextMenu={(e) => e.preventDefault()}
                                  controlsList="nodownload nofullscreen noremoteplayback"
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <img
                                src={media.url}
                              alt={`${product.name} - ${selectedColor} view ${index + 1}`}
                              className="w-full h-auto"
                            />
                            )}
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {currentMedia.length > 1 && (
                        <>
                          <CarouselPrevious className="left-2 sm:left-4 right-auto top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 hover:bg-white hover:border-gray-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-200 pointer-events-auto focus:outline-none shadow-sm" />
                          <CarouselNext className="right-2 sm:right-4 left-auto top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 hover:bg-white hover:border-gray-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-200 pointer-events-auto focus:outline-none shadow-sm" />
                        </>
                      )}
                    </Carousel>

                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No media available
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Title and Price */}
              <div className="pb-4 sm:pb-6 border-b border-gray-200">
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <h1
                    className="text-black font-normal uppercase text-xl sm:text-2xl flex-1 min-w-0 leading-tight"
                    style={{
                      fontFamily: "Playfair Display, Georgia, serif",
                      fontWeight: 400,
                      lineHeight: "1.2",
                      color: "rgba(0,0,0,1)",
                    }}
                  >
                    {product.name}
                  </h1>
                  <WishlistButton
                    productId={product._id}
                    isWishlisted={isInWishlist(product._id)}
                    onToggle={handleWishlistToggle}
                    productData={{
                      name: product.name,
                      price: currentColorVariant?.price || 0,
                      imageUrl: currentMedia.find(m => m.type === 'image')?.url || "",
                      category: product.category,
                    }}
                    className="bg-white/80 backdrop-blur-sm p-1.5 sm:p-1 rounded-full hover:bg-white/90 shrink-0 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6"
                    aria-label={
                      isInWishlist(product._id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  />
                </div>

                <div className="flex items-center gap-3">
                  <p
                    className="text-black font-normal text-lg sm:text-xl"
                    style={{
                      fontFamily:
                        "Jost, -apple-system, Roboto, Jost, sans-serif",
                      fontWeight: 400,
                      color: "rgba(0,0,0,1)",
                    }}
                  >
                    {formatProductPrice(currentColorVariant?.price || 0)}
                  </p>
                </div>
              </div>

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-medium">Size</h3>
                    <button
                      onClick={() => setIsSizeChartOpen(true)}
                      className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-gray-600 hover:text-black transition-colors duration-200 py-1"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path d="M608 128H32c-17.67 0-32 14.33-32 32v192c0 17.67 14.33 32 32 32h576c17.67 0 32-14.33 32-32V160c0-17.67-14.33-32-32-32zm0 224H32V160h80v56c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-56h64v56c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-56h64v56c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-56h64v56c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-56h80v192z"></path>
                      </svg>
                      <span className="hidden sm:inline">Size Chart</span>
                      <span className="sm:hidden">Size Chart</span>
                    </button>
                  </div>
                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    {sizes.map((size) => {
                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeSelection(size)}
                          className={cn(
                            "w-10 h-10 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ease-in-out text-sm font-medium flex items-center justify-center touch-manipulation",
                            selectedSize === size
                              ? "border-black bg-black text-white"
                              : "border-gray-300 hover:border-gray-400 text-gray-700 active:scale-95"
                          )}
                          title={size}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                    
                    {/* Size Prompt Message */}
                    {showSizePrompt && (
                      <p className="mt-3 text-red-600 text-sm">
                        Please select a size
                      </p>
                    )}
                </div>
              )}

              {/* Color Selection */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-sm sm:text-base font-medium mb-3">
                    Color
                    {selectedColor && (
                      <>
                        :{" "}
                        <span className="font-normal text-gray-600">
                          {selectedColor}
                        </span>
                      </>
                    )}
                  </h3>
                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    {colors.map((color) => {
                      // Map color names to actual hex values
                      const colorMap: { [key: string]: string } = {
                        Black: "#000000",
                        White: "#FFFFFF",
                        Navy: "#000080",
                        Red: "#FF0000",
                        Blue: "#0000FF",
                        Green: "#008000",
                        Yellow: "#FFFF00",
                        Pink: "#FFC0CB",
                        Purple: "#800080",
                        Orange: "#FFA500",
                        Brown: "#A52A2A",
                        Gray: "#808080",
                      };

                      const hexColor = colorMap[color] || "#CCCCCC"; // Default gray if color not found

                      const isSelected = selectedColor === color;

                      return (
                        <button
                          key={color}
                          onClick={() => handleColorSelection(color)}
                          className={cn(
                            "w-8 h-8 sm:w-7 sm:h-7 rounded-full transition-all duration-200 ease-in-out relative touch-manipulation",
                            "ring-1 ring-gray-200 hover:ring-gray-400 active:scale-95"
                          )}
                          title={color}
                        >
                          <div
                            className="w-full h-full rounded-full"
                            style={{
                              backgroundColor: hexColor,
                            }}
                          />
                          {/* Checkmark for selected color */}
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white drop-shadow-sm"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  className="w-full text-sm sm:text-sm font-normal bg-black text-white hover:bg-gray-800 h-12 sm:h-10 touch-manipulation"
                  disabled={!selectedColor}
                  onClick={() => {
                    if (!selectedSize) {
                      setShowSizePrompt(true);
                      return;
                    }
                    
                    if (product && selectedSize && selectedColor) {
                      addToCart({
                        productId: product._id,
                        name: product.name,
                        price: currentColorVariant?.price || 0,
                        size: selectedSize,
                        color: selectedColor,
                        quantity: quantity,
                        imageUrl: currentMedia.find(m => m.type === 'image')?.url || "",
                      });

                      // Show success feedback
                      showToast.success(
                        toastMessages.cart.added
                      );
                    }
                  }}
                >
                  ADD TO CART
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm sm:text-sm font-normal border-2 border-black text-black hover:bg-gray-50 h-12 sm:h-10 touch-manipulation"
                >
                  ENQUIRE
                </Button>
              </div>

              {/* Product Details Tabs */}
              <div className="mt-6 sm:mt-8">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-4 sm:mb-6 gap-4 sm:gap-8 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={cn(
                      "py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap touch-manipulation",
                      activeTab === "description"
                        ? "text-black border-b-2 border-black"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    className={cn(
                      "py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap touch-manipulation",
                      activeTab === "details"
                        ? "text-black border-b-2 border-black"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab("materials")}
                    className={cn(
                      "py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap touch-manipulation",
                      activeTab === "materials"
                        ? "text-black border-b-2 border-black"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <span className="hidden sm:inline">Materials & Care</span>
                    <span className="sm:hidden">Care</span>
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === "description" && (
                  <div>
                    <p
                      className="text-gray-700 text-sm sm:text-base leading-relaxed"
                      style={{
                        fontFamily:
                          "Jost, -apple-system, Roboto, Jost, sans-serif",
                      }}
                    >
                      {product.description || "No description available."}
                    </p>
                  </div>
                )}

                {activeTab === "details" && (
                  <div>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="text-gray-700 text-sm sm:text-sm leading-relaxed">
                        <strong>Category:</strong> {product.category}
                      </li>
                      <li className="text-gray-700 text-sm sm:text-sm leading-relaxed">
                        <strong>Subcategory:</strong> {product.subCategory}
                      </li>
                      <li className="text-gray-700 text-sm sm:text-sm leading-relaxed">
                        <strong>Available Colors:</strong> {colors.length > 0 ? colors.join(", ") : "Single color product"}
                      </li>
                      <li className="text-gray-700 text-sm sm:text-sm leading-relaxed">
                        <strong>Available Sizes:</strong> {sizes.join(", ")}
                      </li>
                      {product.bestseller && (
                        <li className="text-gray-700 text-sm sm:text-sm leading-relaxed">
                          <strong>Bestseller:</strong> Yes
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {activeTab === "materials" && (
                  <div>
                    <p className="text-gray-700 text-sm sm:text-sm leading-relaxed">
                      Product material and care information will be displayed
                      here. This information is typically provided by the
                      manufacturer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/20 transition-opacity duration-300"
            onClick={() => setIsSizeChartOpen(false)}
          />

          {/* Size Chart Panel */}
          <div
            className={cn(
              "flex flex-col fixed top-0 right-0 w-full sm:min-w-[25%] sm:max-w-[50%] h-screen z-50 transition-transform duration-300 bg-white shadow-2xl",
              isSizeChartOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between py-4 sm:py-6 px-4 sm:px-8 lg:px-16 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold">SIZE GUIDE</h2>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Size Chart Content */}
            <div className="py-4 sm:py-6 px-4 sm:px-8 lg:px-16 flex-1 flex flex-col justify-center overflow-y-auto">
              {/* Body Measurements Header */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg text-center font-medium mb-4 sm:mb-6">
                  BODY MEASUREMENTS (
                  {selectedUnit === "inches" ? "INCHES" : "CM"})
                </h3>

                {/* Unit Toggle */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-xs sm:text-sm text-gray-600">Units:</span>
                  <div className="flex border border-gray-300 overflow-hidden">
                    <button
                      onClick={() => setSelectedUnit("inches")}
                      className={cn(
                        "px-2 sm:px-3 py-1 text-xs sm:text-sm transition-colors touch-manipulation",
                        selectedUnit === "inches"
                          ? "bg-black text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      INCHES
                    </button>
                    <button
                      onClick={() => setSelectedUnit("cm")}
                      className={cn(
                        "px-2 sm:px-3 py-1 text-xs sm:text-sm transition-colors border-l border-gray-300 touch-manipulation",
                        selectedUnit === "cm"
                          ? "bg-black text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      CM
                    </button>
                  </div>
                </div>
              </div>

              {/* Size Table */}
              <div className="mb-4 sm:mb-6">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full text-xs sm:text-sm border border-gray-300 min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-300 bg-[#f2f2f2]">
                        <th className="text-left py-3 px-4 font-medium border-r border-gray-300">
                          SINGLE SIZE
                        </th>
                        <th className="text-center py-3 px-2 font-medium border-r border-gray-300">
                          XS
                        </th>
                        <th className="text-center py-3 px-2 font-medium border-r border-gray-300">
                          S
                        </th>
                        <th className="text-center py-3 px-2 font-medium border-r border-gray-300">
                          M
                        </th>
                        <th className="text-center py-3 px-2 font-medium border-r border-gray-300">
                          L
                        </th>
                        <th className="text-center py-3 px-2 font-medium border-r border-gray-300">
                          XL
                        </th>
                        <th className="text-center py-3 px-2 font-medium border-r border-gray-300">
                          XXL
                        </th>
                        <th className="text-center py-3 px-2 font-medium">
                          XXXL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-300">
                        <td className="py-3 px-4 font-medium border-r border-gray-300 bg-[#f2f2f2]">
                          BUST
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "32" : "81"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "34" : "86"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "36" : "91.5"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "38" : "96.5"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "40" : "102"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "43" : "109"}
                        </td>
                        <td
                          className="py-3 px-2 text-center"
                        >
                          {selectedUnit === "inches" ? "45" : "114"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="py-3 px-4 font-medium border-r border-gray-300 bg-[#f2f2f2]">
                          WAIST
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "23.5" : "60"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "26" : "66"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "28" : "71"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "29.5" : "75"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "32" : "81"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "34.5" : "87.5"}
                        </td>
                        <td
                          className="py-3 px-2 text-center"
                        >
                          {selectedUnit === "inches" ? "38.5" : "98"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="py-3 px-4 font-medium border-r border-gray-300 bg-[#f2f2f2]">
                          HIPS
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "34.75" : "88"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "36.75" : "93"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "38" : "96.5"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "40.5" : "103"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "42.5" : "108"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "44.5" : "113"}
                        </td>
                        <td
                          className="py-3 px-2 text-center"
                        >
                          {selectedUnit === "inches" ? "48.5" : "123"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="py-3 px-4 font-medium border-r border-gray-300 bg-[#f2f2f2]">
                          SHOULDER
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "14.5" : "37"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "15" : "38"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "15.5" : "39"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "16" : "40.5"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "16.5" : "42"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "17.25" : "44"}
                        </td>
                        <td
                          className="py-3 px-2 text-center"
                        >
                          {selectedUnit === "inches" ? "17.75" : "45"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium border-r border-gray-300 bg-[#f2f2f2]">
                          ARM HOLE
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "15" : "38"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "15.5" : "39"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "16" : "40.5"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "16.5" : "42"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "17.5" : "44.5"}
                        </td>
                        <td
                          className="py-3 px-2 text-center border-r border-gray-300"
                        >
                          {selectedUnit === "inches" ? "18.5" : "47"}
                        </td>
                        <td
                          className="py-3 px-2 text-center"
                        >
                          {selectedUnit === "inches" ? "19" : "48.5"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custom Text */}
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-700 mb-2">
                  Here's the size guide video!{" "}
                  <button
                    onClick={() => setIsCustomSizeOpen(true)}
                    className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer touch-manipulation"
                  >
                    Click here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom Size Video Modal */}
      {isCustomSizeOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/20 transition-opacity duration-300"
            onClick={() => setIsCustomSizeOpen(false)}
          />

          {/* Custom Size Panel */}
          <div
            className={cn(
              "flex flex-col fixed top-0 right-0 w-full sm:min-w-[25%] sm:max-w-[50%] h-screen z-50 transition-transform duration-300 bg-white shadow-2xl",
              isCustomSizeOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold">Size Guide Video</h2>
              <button
                onClick={() => setIsCustomSizeOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Video Content */}
            <div className="px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
              <div className="flex justify-center">
                <iframe
                  src="https://www.youtube.com/embed/03b56tc7sAE?autoplay=1"
                  title="Size Guide Video"
                  className="w-full max-w-2xl aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
