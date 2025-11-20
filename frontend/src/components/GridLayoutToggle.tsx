import { cn } from "@/lib/utils";

interface GridLayoutToggleProps {
  currentLayout: number;
  onLayoutChange: (layout: number) => void;
  className?: string;
}

const GridLayoutToggle = ({ 
  currentLayout, 
  onLayoutChange, 
  className 
}: GridLayoutToggleProps) => {
  // Desktop layouts (2, 3, 4 columns)
  const desktopLayouts = [
    { id: 2, squares: 2 },
    { id: 3, squares: 3 },
    { id: 4, squares: 4 }
  ];

  // Mobile layouts (2, 1 columns) - shown on mobile screens
  const mobileLayouts = [
    { id: 2, squares: 2 },
    { id: 1, squares: 1 }
  ];

  const renderLayoutIcon = (layout: { id: number; squares: number }, isMobile = false) => {
    // For mobile, if currentLayout is not available (like 4), show the closest equivalent as active
    let isActive = currentLayout === layout.id;
    if (isMobile && !isActive) {
      // If on mobile and currentLayout is 4, treat 2 as active
      // If on mobile and currentLayout is 3, treat 2 as active  
      if (currentLayout >= 3 && layout.id === 2) {
        isActive = true;
      }
    }
    const squares = Array.from({ length: layout.squares }, (_, i) => i);

    return (
      <button
        key={layout.id}
        onClick={() => onLayoutChange(layout.id)}
        className={cn(
          "flex items-center justify-center transition-all duration-200",
          "hover:scale-105"
        )}
        aria-label={`${layout.squares} column grid layout`}
      >
        <div 
          className="flex items-center gap-1"
          // style={{ 
          //   width: layout.squares === 2 ? '34.5px' : layout.squares === 3 ? '55px' : '73.5px',
          //   height: '15px'
          // }}
        >
          {squares.map((index) => (
            <div
              key={index}
              className={cn(
                "w-[10px] h-[10px] flex-shrink-0",
                isActive
                  ? "bg-black border border-black"
                  : "border border-black bg-transparent"
              )}
              style={{ aspectRatio: '1/1' }}
            />
          ))}
        </div>
      </button>
    );
  };

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {/* Desktop layouts - hidden on mobile and tablets */}
      <div className="hidden desktop:flex items-center gap-6">
        {desktopLayouts.map(layout => renderLayoutIcon(layout, false))}
      </div>
      
      {/* Mobile layouts - shown on mobile and tablets (up to 1366px) */}
      <div className="flex desktop:hidden items-center gap-6">
        {mobileLayouts.map(layout => renderLayoutIcon(layout, true))}
      </div>
    </div>
  );
};

export default GridLayoutToggle;
