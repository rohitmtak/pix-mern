import { cn } from "@/lib/utils";
import { useState } from "react";

interface WishlistButtonProps {
  className?: string;
  productId?: string;
  isWishlisted?: boolean;
  onToggle?: (productId: string, isWishlisted: boolean) => void;
}

const WishlistButton = ({ 
  className, 
  productId = "",
  isWishlisted = false,
  onToggle 
}: WishlistButtonProps) => {
  const [isLiked, setIsLiked] = useState(isWishlisted);

  const handleClick = () => {
    const newState = !isLiked;
    setIsLiked(newState);
    onToggle?.(productId, newState);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center transition-all duration-200 hover:scale-110",
        className
      )}
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLiked ? (
        // Filled heart when wishlisted
        <svg
          width="20"
          height="25"
          viewBox="0 0 100 125"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path d="M88.13,63.62c5.04-4.8,7.87-11.28,7.87-18.21,0-13.81-11.19-25-25-25-6.94,0-13.41,2.83-18.1,7.76l-2.9,3.04-2.9-3.04c-4.69-4.92-11.17-7.76-18.1-7.76-13.81,0-25,11.19-25,25,0,6.94,2.83,13.41,7.76,18.1l38.26,39.35,38.11-39.24Z"/>
        </svg>
      ) : (
        // Outline heart when not wishlisted
        <svg
          width="20"
          height="25"
          viewBox="0 0 100 125"
          fill="none"
          stroke="black"
          strokeWidth="6"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path d="M9,66.4C3.46,61.12,0,53.67,0,45.4c0-16.02,12.98-29,29-29,8.26,0,15.72,3.46,21,9,5.28-5.54,12.74-9,21-9,16.02,0,29,12.98,29,29,0,8.26-3.46,15.72-9,21l-40.98,42.19L9,66.4Z"/>
        </svg>
      )}
    </button>
  );
};

export default WishlistButton;
