import React from 'react';
import { cn } from "@/lib/utils";
import { ColorVariant } from "@/lib/api";

interface ColorVariantSelectorProps {
  colorVariants: ColorVariant[];
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  disabled?: boolean;
}

const ColorVariantSelector: React.FC<ColorVariantSelectorProps> = ({
  colorVariants,
  selectedColor,
  onColorSelect,
  className = '',
  size = 'md',
  showLabels = false,
  disabled = false
}) => {
  if (!colorVariants || colorVariants.length <= 1) {
    return null; // Don't show selector if there's only one or no color variants
  }

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
    Grey: "#808080",
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-5 h-5';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  const handleColorClick = (color: string) => {
    if (!disabled && onColorSelect) {
      onColorSelect(color);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabels && (
        <div className="text-xs text-gray-600 font-medium">
          Available Colors
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        {colorVariants.map((variant) => {
          const hexColor = colorMap[variant.color] || "#CCCCCC";
          const isSelected = selectedColor === variant.color;

          return (
            <button
              key={variant.color}
              onClick={() => handleColorClick(variant.color)}
              disabled={disabled}
              className={cn(
                "relative transition-all duration-200 ease-in-out",
                getSizeClasses(),
                "rounded-full",
                disabled && "cursor-not-allowed opacity-60",
                // Enhanced styling for collection page context
                disabled && "hover:ring-gray-200", // Prevent hover effects when disabled
                // Add subtle shadow for better visual depth
                "shadow-sm",
                // Better hover effects when enabled
                !disabled && "hover:scale-110 hover:shadow-md",
                // Subtle hover effect without rings
                !disabled && "hover:border-gray-300"
              )}
              title={variant.color}
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
                    className={cn(
                      "text-white drop-shadow-sm",
                      size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
                    )}
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
  );
};

export default ColorVariantSelector;
