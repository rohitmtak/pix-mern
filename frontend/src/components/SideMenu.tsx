import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    // Navigate to the specified path
    navigate(path);
    // Close the menu
    onClose();
  };

  const toggleCollection = () => {
    setIsCollectionOpen(!isCollectionOpen);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Side Menu */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen z-50 transition-transform duration-300",
          "bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-[20px]",
          "border-r border-white/20 shadow-2xl",
          // Responsive width: full width on mobile, 80% on tablet, 960px on desktop
          "w-full sm:w-4/5 md:w-[600px] lg:w-[800px] xl:w-[960px]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 sm:p-8 md:p-12 border-b border-white/10">
          <button
            onClick={onClose}
            className="group flex items-center justify-center p-3 rounded-full hover:bg-black/5 transition-all duration-300 ease-out hover:scale-110 active:scale-95"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 stroke-black stroke-2 group-hover:stroke-gray-600 transition-colors duration-200"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:rotate-90 transition-transform duration-300 ease-out"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="flex-1 px-6 sm:px-8 md:px-12 pb-12 overflow-y-auto">
          <nav className="flex flex-col space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 pt-8">
            {/* Home */}
            <div className="group relative overflow-hidden">
              <button
                onClick={() => handleNavigation("/")}
                className="relative text-black font-jost text-xl sm:text-2xl md:text-3xl font-normal leading-normal uppercase transition-all duration-300 ease-out hover:translate-x-3 hover:text-gray-700 block text-left py-2 px-3 rounded-lg hover:bg-black/5"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              </button>
            </div>

            {/* Collection - with submenu */}
            <div className="group relative overflow-hidden">
              <button
                onClick={toggleCollection}
                className="relative text-black font-jost text-xl sm:text-2xl md:text-3xl font-normal leading-normal uppercase transition-all duration-300 ease-out hover:translate-x-3 hover:text-gray-700 flex items-center justify-between w-full text-left py-2 px-3 rounded-lg hover:bg-black/5"
              >
                <span className="relative z-10">Collection</span>
                <svg
                  className={cn(
                    "w-5 h-5 transition-all duration-500 ease-out relative z-10",
                    isCollectionOpen ? "rotate-180 text-gray-600" : "rotate-0 text-black"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              </button>
              
              {/* Collection Submenu */}
              <div className={cn(
                "overflow-hidden transition-all duration-500 ease-out",
                isCollectionOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
              )}>
                <div className="space-y-2 pl-4 border-l-2 border-black/10">
                  <div className={cn(
                    "transform transition-all duration-300 ease-out",
                    isCollectionOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  )} style={{ transitionDelay: isCollectionOpen ? "100ms" : "0ms" }}>
                    <button
                      onClick={() => handleNavigation("/collection/signature")}
                      className="group/sub relative text-gray-700 font-jost text-lg sm:text-xl md:text-2xl font-normal leading-normal hover:text-black transition-all duration-300 ease-out hover:translate-x-2 block text-left py-2 px-3 rounded-lg hover:bg-black/5 w-full"
                    >
                      <span className="relative z-10">Signature Collection</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/sub:translate-x-full transition-transform duration-500 ease-out"></div>
                    </button>
                  </div>
                  <div className={cn(
                    "transform transition-all duration-300 ease-out",
                    isCollectionOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  )} style={{ transitionDelay: isCollectionOpen ? "150ms" : "0ms" }}>
                    <button
                      onClick={() => handleNavigation("/collection/bridal")}
                      className="group/sub relative text-gray-700 font-jost text-lg sm:text-xl md:text-2xl font-normal leading-normal hover:text-black transition-all duration-300 ease-out hover:translate-x-2 block text-left py-2 px-3 rounded-lg hover:bg-black/5 w-full"
                    >
                      <span className="relative z-10">Bridal Couture</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/sub:translate-x-full transition-transform duration-500 ease-out"></div>
                    </button>
                  </div>
                  <div className={cn(
                    "transform transition-all duration-300 ease-out",
                    isCollectionOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  )} style={{ transitionDelay: isCollectionOpen ? "200ms" : "0ms" }}>
                    <button
                      onClick={() => handleNavigation("/collection/contemporary")}
                      className="group/sub relative text-gray-700 font-jost text-lg sm:text-xl md:text-2xl font-normal leading-normal hover:text-black transition-all duration-300 ease-out hover:translate-x-2 block text-left py-2 px-3 rounded-lg hover:bg-black/5 w-full"
                    >
                      <span className="relative z-10">Contemporary Drapes</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/sub:translate-x-full transition-transform duration-500 ease-out"></div>
                    </button>
                  </div>
                  <div className={cn(
                    "transform transition-all duration-300 ease-out",
                    isCollectionOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  )} style={{ transitionDelay: isCollectionOpen ? "250ms" : "0ms" }}>
                    <button
                      onClick={() => handleNavigation("/collection/luxury")}
                      className="group/sub relative text-gray-700 font-jost text-lg sm:text-xl md:text-2xl font-normal leading-normal hover:text-black transition-all duration-300 ease-out hover:translate-x-2 block text-left py-2 px-3 rounded-lg hover:bg-black/5 w-full"
                    >
                      <span className="relative z-10">Luxury Fusion Lounge</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/sub:translate-x-full transition-transform duration-500 ease-out"></div>
                    </button>
                  </div>
                  <div className={cn(
                    "transform transition-all duration-300 ease-out",
                    isCollectionOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  )} style={{ transitionDelay: isCollectionOpen ? "300ms" : "0ms" }}>
                    <div className="border-t border-gray-200 my-3"></div>
                    <button
                      onClick={() => handleNavigation("/collection")}
                      className="group/sub relative text-gray-600 font-jost text-base sm:text-lg md:text-xl font-medium leading-normal hover:text-black transition-all duration-300 ease-out hover:translate-x-2 block text-left py-2 px-3 rounded-lg hover:bg-black/5 w-full"
                    >
                      <span className="relative z-10">VIEW ALL</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/sub:translate-x-full transition-transform duration-500 ease-out"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="group relative overflow-hidden">
              <button
                onClick={() => handleNavigation("/about")}
                className="relative text-black font-jost text-xl sm:text-2xl md:text-3xl font-normal leading-normal uppercase transition-all duration-300 ease-out hover:translate-x-3 hover:text-gray-700 block text-left py-2 px-3 rounded-lg hover:bg-black/5"
              >
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              </button>
            </div>

            {/* Contact */}
            <div className="group relative overflow-hidden">
              <button
                onClick={() => handleNavigation("/contact")}
                className="relative text-black font-jost text-xl sm:text-2xl md:text-3xl font-normal leading-normal uppercase transition-all duration-300 ease-out hover:translate-x-3 hover:text-gray-700 block text-left py-2 px-3 rounded-lg hover:bg-black/5"
              >
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
