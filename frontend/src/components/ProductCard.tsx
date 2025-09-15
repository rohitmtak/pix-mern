import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import WishlistButton from "./WishlistButton";
import ColorVariantSelector from "./ColorVariantSelector";
import { Link } from "react-router-dom";
import { Product } from "@/lib/api";
import { formatProductPrice, extractNumericPrice } from '@/utils/priceUtils';

interface ProductCardProps {
  id: string;
  imageUrl: string;
  hoverImageUrl?: string;
  title: string;
  price: string;
  category?: string;
  alt?: string;
  className?: string;
  showWishlist?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: (productId: string, isWishlisted: boolean) => void;
  compact?: boolean;
  centered?: boolean;
  contentWrapperClassName?: string;
  product?: Product; // Add product prop to access color variants
}

const ProductCard = ({
  id,
  imageUrl,
  hoverImageUrl,
  title,
  price,
  category,
  alt = "",
  className,
  showWishlist = true,
  isWishlisted = false,
  onWishlistToggle,
  compact = false,
  centered = false,
  contentWrapperClassName,
  product
}: ProductCardProps) => {
  // State for managing selected color
  const [selectedColor, setSelectedColor] = useState<string>("");
  // State for managing current image based on selected color
  const [currentImage, setCurrentImage] = useState<string>(imageUrl);
  // State for tracking preloaded images
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  // Preload hover image when component mounts
  useEffect(() => {
    if (hoverImageUrl && !preloadedImages.has(hoverImageUrl)) {
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, hoverImageUrl]));
      };
      img.src = hoverImageUrl;
    }
  }, [hoverImageUrl, preloadedImages]);

  // Set initial selected color when product loads
  useEffect(() => {
    if (product && product.colorVariants && product.colorVariants.length > 0) {
      setSelectedColor(product.colorVariants[0].color);
      // Set initial image from first color variant
      const firstVariant = product.colorVariants[0];
      if (firstVariant.images && firstVariant.images.length > 0) {
        setCurrentImage(firstVariant.images[0]);
      }
    }
  }, [product, imageUrl]);

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);

    // Update image when color changes
    if (product) {
      const selectedVariant = product.colorVariants.find(
        variant => variant.color === color
      );
      if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
        setCurrentImage(selectedVariant.images[0]);
        
        // Preload hover image for the selected color variant
        if (selectedVariant.images.length > 1 && !preloadedImages.has(selectedVariant.images[1])) {
          const img = new Image();
          img.onload = () => {
            setPreloadedImages(prev => new Set([...prev, selectedVariant.images[1]]));
          };
          img.src = selectedVariant.images[1];
        }
      }
    }
  };

  return (
    <div className={cn("flex flex-col w-full", compact ? "gap-2" : "gap-2", className)}>
      {/* Product Image Container */}
      <div className="relative w-full group">
        <Link to={`/product/${id}`} className="block w-full">
          <div className="relative w-full aspect-[4/5] overflow-hidden">
            {/* Base image - now uses currentImage state */}
            <img
              src={currentImage}
              alt={alt || title}
              className={cn(
                "w-full h-full object-cover transition-all duration-300 ease-in-out",
                hoverImageUrl && "group-hover:scale-105"
              )}
              loading="lazy"
              decoding="async"
            />

            {/* Hover image (crossfade) */}
            {hoverImageUrl && (
              <img
                src={hoverImageUrl}
                alt={(alt || title) + ' hover'}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className={cn(contentWrapperClassName)}>
        <div className={cn(
          showWishlist ? "flex flex-col justify-between items-start" : "block",
          compact ? 'pb-1' : 'pb-2', // Reduced bottom padding to minimize gap
          'px-1.5',
          centered && !showWishlist && 'text-center'
        )}>
          {/* Left side - Product details */}
          <div className={cn(
            'flex w-full',
            !showWishlist && centered ? 'justify-center' : 'justify-between'
          )}>
            {/* Title */}
            <h3 className="text-black text-sm md:text-base">
              {title}
            </h3>

            {/* Right side - Wishlist button */}
            {showWishlist && (
              <div className="ml-auto flex-shrink-0">
                <WishlistButton
                  productId={id}
                  isWishlisted={isWishlisted}
                  onToggle={onWishlistToggle}
                  productData={{
                    name: title,
                    price: extractNumericPrice(price),
                    imageUrl: imageUrl,
                    category: category || ''
                  }}
                  className="bg-white/80 backdrop-blur-sm rounded-full hover:bg-white/90"
                />
              </div>
            )}
          </div>

          <div className={cn(
            'flex w-full',
            !showWishlist && centered ? 'justify-center' : 'justify-between'
          )}>
            {/* Price */}
            <p className="text-gray-500 font-normal text-xs md:text-sm">
              {price}
            </p>

            {/* Color Variants - Positioned below product info for consistent alignment */}
            <div className="">
              {product && product.colorVariants && product.colorVariants.length > 1 && (
                <div className="pb-4">
                  <ColorVariantSelector
                    colorVariants={product.colorVariants}
                    selectedColor={selectedColor}
                    onColorSelect={handleColorSelect}
                    size="xs"
                    showLabels={false}
                    disabled={false} // Enable interaction on collection page
                    className="justify-start" // Align to start instead of center
                  />
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ProductCard;
