import React from 'react';
import { cn } from "@/lib/utils";
import WishlistButton from "./WishlistButton";
import { Link } from "react-router-dom";

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
  contentWrapperClassName
}: ProductCardProps) => {
  console.log('ProductCard rendered with props:', { id, title, price, category, isWishlisted });
  
  return (
    <div className={cn("flex flex-col w-full", compact ? "gap-0" : "gap-2", className)}>
      {/* Product Image Container */}
      <div className="relative w-full group">
        <Link to={`/product/${id}`} className="block w-full">
          <div className="relative w-full aspect-[4/5] overflow-hidden">
            {/* Base image */}
            <img
              src={imageUrl}
              alt={alt || title}
              className={cn(
                "w-full h-full object-cover transition-transform duration-300",
                hoverImageUrl && "group-hover:scale-105"
              )}
            />

            {/* Hover image (crossfade) */}
            {hoverImageUrl && (
              <img
                src={hoverImageUrl}
                alt={(alt || title) + ' hover'}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className={cn(contentWrapperClassName)}>
        <div className={cn(
          showWishlist ? "flex justify-between items-start" : "block",
          compact ? 'pb-2' : 'pb-8',
          'px-1.5',
          centered && !showWishlist && 'text-center'
        )}>
          {/* Left side - Product details */}
          <div className={cn('flex-1')}> 
            {/* Title */}
            <h3 className="text-black text-sm">
              {title}
            </h3>
            
            {/* Price */}
            <p className="text-black font-normal text-sm">
              {price}
            </p>
          </div>

          {/* Right side - Wishlist button */}
          {showWishlist && (
            <div className="ml-4 flex-shrink-0">
              <WishlistButton
                productId={id}
                isWishlisted={isWishlisted}
                onToggle={onWishlistToggle}
                productData={{
                  name: title,
                  price: (() => {
                    // Remove all non-numeric characters except decimal points
                    // But handle the case where Rs. might leave a leading decimal point
                    let cleanedPrice = price.replace(/[^0-9.]/g, '');
                    
                    // If the cleaned price starts with a decimal point, remove it
                    if (cleanedPrice.startsWith('.')) {
                      cleanedPrice = cleanedPrice.substring(1);
                    }
                    
                    return parseFloat(cleanedPrice) || 0;
                  })(),
                  imageUrl: imageUrl,
                  category: category || ''
                }}
                className="bg-white/80 backdrop-blur-sm rounded-full hover:bg-white/90"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
