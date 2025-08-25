import React from 'react';
import { cn } from "@/lib/utils";
import WishlistButton from "./WishlistButton";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  category?: string;
  alt?: string;
  className?: string;
  showWishlist?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: (productId: string, isWishlisted: boolean) => void;
}

const ProductCard = ({
  id,
  imageUrl,
  title,
  price,
  category,
  alt = "",
  className,
  showWishlist = true,
  isWishlisted = false,
  onWishlistToggle
}: ProductCardProps) => {
  console.log('ProductCard rendered with props:', { id, title, price, category, isWishlisted });
  
  return (
    <div className={cn("flex flex-col w-full gap-2", className)}>
      {/* Product Image Container */}
      <div className="relative w-full group">
        <Link to={`/product/${id}`} className="block w-full">
          <div className="relative w-full aspect-[4/5] overflow-hidden">
            <img
              src={imageUrl}
              alt={alt || title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start pb-8 px-1.5">
        {/* Left side - Product details */}
        <div className="flex-1">
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
                price: parseFloat(price.replace('₹', '')) || 0,
                imageUrl: imageUrl,
                category: category || ''
              }}
              className="bg-white/80 backdrop-blur-sm rounded-full hover:bg-white/90"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
