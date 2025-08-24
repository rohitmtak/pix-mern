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
  const layouts = [
    { id: 2, squares: 2 },
    { id: 3, squares: 3 },
    { id: 4, squares: 4 }
  ];

  const renderLayoutIcon = (layout: { id: number; squares: number }) => {
    const isActive = currentLayout === layout.id;
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
                  ? "border-2 border-black bg-black"
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
      {layouts.map(renderLayoutIcon)}
    </div>
  );
};

export default GridLayoutToggle;
