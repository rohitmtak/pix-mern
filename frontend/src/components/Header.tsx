import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SideMenu from "./SideMenu";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isCollectionHovered, setIsCollectionHovered] = useState(false);
  const collectionCloseTimeoutRef = useRef<number | null>(null);
  const openCollectionMenu = () => {
    if (collectionCloseTimeoutRef.current) {
      window.clearTimeout(collectionCloseTimeoutRef.current);
      collectionCloseTimeoutRef.current = null;
    }
    setIsCollectionHovered(true);
  };
  const scheduleCloseCollectionMenu = () => {
    if (collectionCloseTimeoutRef.current) {
      window.clearTimeout(collectionCloseTimeoutRef.current);
    }
    collectionCloseTimeoutRef.current = window.setTimeout(() => {
      setIsCollectionHovered(false);
    }, 150);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const { state: cartState } = useCart();
  const { isAuthenticated } = useAuth();

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    navigate(path);
  };

  const handleProfileNavigation = async () => {
    // Always navigate to profile first - let the ProfilePage component handle authentication
    // This prevents race conditions and ensures consistent behavior
    handleNavigation('/profile');
  };

  // Determine header background based on page
  const getHeaderBackground = () => {
    if (isHomePage) {
      return 'bg-transparent hover:bg-white border-b border-b-[1px] border-b-transparent hover:border-b-[#dddddd]';
    } else {
      return 'bg-white border-b border-b-[1px] border-b-[#dddddd]';
    }
  };

  return (
    <>
      {/* Mobile Header - shown on mobile and tablets (up to 1366px) */}
      <header 
        className={`desktop:hidden fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${getHeaderBackground()}`}
      >
        <div className="px-4 md:px-8 lg:px-12 py-4 md:py-6">
          <div className="flex items-center justify-between">
            {/* Left Side - Hamburger Menu with responsive width */}
            <div className="w-16 md:w-20 lg:w-24 flex justify-start">
              <button
                onClick={toggleSideMenu}
                className="flex items-center justify-center"
                aria-label="Open menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 fill-black"
                >
                  <path
                    d="M3 12H21M3 6H21M3 18H21"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Center Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/">
                <img
                  src="/images/pix-black-logo.png"
                  alt="Highstreet Pix Logo"
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                />
              </Link>
            </div>

            {/* Right Side - Icons with responsive width */}
            <div className="w-16 md:w-20 lg:w-24 flex justify-end">
              <div className="flex items-center space-x-4 md:space-x-5 lg:space-x-6">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="flex items-center justify-center"
                aria-label="Wishlist"
              >
                <svg
                  width="20"
                  height="25"
                  viewBox="0 0 100 125"
                  fill="none"
                  stroke="black"
                  strokeWidth="9"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                >
                  <path d="M9,66.4C3.46,61.12,0,53.67,0,45.4c0-16.02,12.98-29,29-29,8.26,0,15.72,3.46,21,9,5.28-5.54,12.74-9,21-9,16.02,0,29,12.98,29,29,0,8.26-3.46,15.72-9,21l-40.98,42.19L9,66.4Z" />
                </svg>
              </Link>

              {/* Account */}
              <button
                className="flex items-center justify-center"
                aria-label="Account"
                onClick={handleProfileNavigation}
              >
                <svg
                  width="31"
                  height="31"
                  viewBox="0 0 31 31"
                  className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 fill-black"
                >
                  <path
                    d="M21.2558 16.5994C22.7829 15.4046 23.8976 13.766 24.4447 11.9118C24.9918 10.0575 24.9442 8.07977 24.3085 6.25369C23.6727 4.4276 22.4805 2.84399 20.8976 1.72315C19.3148 0.602316 17.42 0 15.4769 0C13.5338 0 11.639 0.602316 10.0562 1.72315C8.47329 2.84399 7.28106 4.4276 6.64533 6.25369C6.0096 8.07977 5.96199 10.0575 6.50911 11.9118C7.05624 13.766 8.17089 15.4046 9.698 16.5994C7.08126 17.6421 4.79807 19.3713 3.09182 21.6029C1.38558 23.8345 0.320246 26.4848 0.00939552 29.2711C-0.0131054 29.4746 0.00490408 29.6804 0.0623953 29.8769C0.119887 30.0734 0.215734 30.2568 0.344465 30.4164C0.604449 30.7389 0.982592 30.9455 1.39571 30.9906C1.80882 31.0358 2.22307 30.916 2.54732 30.6574C2.87157 30.3989 3.07926 30.0228 3.1247 29.6119C3.46674 26.5837 4.91863 23.787 7.20298 21.7561C9.48733 19.7252 12.444 18.6025 15.5081 18.6025C18.5721 18.6025 21.5288 19.7252 23.8131 21.7561C26.0975 23.787 27.5494 26.5837 27.8914 29.6119C27.9337 29.9926 28.1164 30.3441 28.404 30.5987C28.6917 30.8534 29.064 30.993 29.449 30.9906H29.6204C30.0287 30.9439 30.4019 30.7386 30.6587 30.4194C30.9154 30.1002 31.0349 29.6931 30.9911 29.2866C30.6788 26.4924 29.6077 23.8353 27.8927 21.6003C26.1777 19.3653 23.8834 17.6365 21.2558 16.5994ZM15.4769 15.4996C14.2446 15.4996 13.04 15.1362 12.0154 14.4553C10.9907 13.7744 10.1921 12.8067 9.72056 11.6744C9.24898 10.5422 9.12559 9.29628 9.366 8.09429C9.60641 6.8923 10.1998 5.7882 11.0712 4.92162C11.9426 4.05503 13.0527 3.46488 14.2614 3.22579C15.47 2.9867 16.7228 3.10941 17.8612 3.5784C18.9997 4.0474 19.9728 4.84161 20.6575 5.8606C21.3421 6.8796 21.7075 8.07762 21.7075 9.30315C21.7075 10.9465 21.0511 12.5226 19.8826 13.6847C18.7141 14.8467 17.1294 15.4996 15.4769 15.4996Z"
                    fill="black"
                  />
                </svg>
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center justify-center relative"
                aria-label="Shopping cart"
              >
                <svg 
                  width="20" 
                  height="17" 
                  viewBox="0 0 19 23" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 fill-black"
                  role="presentation"
                >
                  <path d="M0 22.985V5.995L2 6v.03l17-.014v16.968H0zm17-15H2v13h15v-13zm-5-2.882c0-2.04-.493-3.203-2.5-3.203-2 0-2.5 1.164-2.5 3.203v.912H5V4.647C5 1.19 7.274 0 9.5 0 11.517 0 14 1.354 14 4.647v1.368h-2v-.912z" fill="currentColor"></path>
                </svg>
                {cartState.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 md:-top-1.5 md:-right-1.5 lg:-top-1 lg:-right-1 bg-black text-white text-xs md:text-sm rounded-full w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex items-center justify-center font-medium">
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </span>
                )}
              </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header - shown only on desktop (1367px+) */}
      <header 
        className={`hidden desktop:block fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${getHeaderBackground()}`}
      >
        {/* Main Navbar */}
        <div className={`px-4 desktop:px-16 py-4 desktop:py-10 relative`}>
          <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
            {/* Left - Navigation Links */}
            <div className="flex items-center space-x-12">
              {/* Home */}
              <Link
                to="/"
                className="text-black font-jost text-base uppercase tracking-tightness hover:opacity-70 transition-opacity"
              >
                Home
              </Link>

              {/* Our Collection - with Dropdown */}
              <div>
                <button 
                  onMouseEnter={openCollectionMenu}
                  onMouseLeave={scheduleCloseCollectionMenu}
                  className="text-black font-jost text-base uppercase tracking-tightness hover:opacity-70 transition-opacity relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:w-full after:h-10 after:bg-transparent after:hidden group-hover:after:block"
                >
                  Collection
                </button>

                {/* Category Cards Row - Full width with images */}
                <div
                  onMouseEnter={openCollectionMenu}
                  onMouseLeave={scheduleCloseCollectionMenu}
                  className={`absolute top-full left-1/2 -translate-x-1/2 w-screen bg-white border-t border-gray-100 shadow-2xl py-12 z-[70] transition-all duration-300 transform ${
                    isCollectionHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="max-w-screen-2xl mx-auto px-16">
                    <div className="flex">
                      {/* Left Side - Category Names */}
                      <div className="w-2/5">
                        <div className="space-y-6">
                          {/* Bridal Couture */}
                          <div className={`transition-all duration-1000 ease-out ${
                            isCollectionHovered 
                              ? 'opacity-100 translate-y-0 delay-0' 
                              : 'opacity-0 -translate-y-8 delay-0'
                          }`}>
                            <button
                              onClick={() => { setIsCollectionHovered(false); handleNavigation("/collection/bridal"); }}
                              className="text-left group/item"
                            >
                              <div className="text-xl text-black group-hover/item:text-gray-700 transition-colors duration-300">
                                Bridal Couture
                              </div>
                            </button>
                          </div>

                          {/* Signature Collection */}
                          <div className={`transition-all duration-1000 ease-out ${
                            isCollectionHovered 
                              ? 'opacity-100 translate-y-0 delay-100' 
                              : 'opacity-0 -translate-y-8 delay-0'
                          }`}>
                            <button
                              onClick={() => { setIsCollectionHovered(false); handleNavigation("/collection/signature"); }}
                              className="text-left group/item"
                            >
                              <div className="text-xl text-black group-hover/item:text-gray-700 transition-colors duration-300">
                                Signature Collection
                              </div>
                            </button>
                          </div>

                          {/* Contemporary Drapes */}
                          <div className={`transition-all duration-1000 ease-out ${
                            isCollectionHovered 
                              ? 'opacity-100 translate-y-0 delay-200' 
                              : 'opacity-0 -translate-y-8 delay-0'
                          }`}>
                            <button
                              onClick={() => { setIsCollectionHovered(false); handleNavigation("/collection/contemporary"); }}
                              className="text-left group/item"
                            >
                              <div className="text-xl text-black group-hover/item:text-gray-700 transition-colors duration-300">
                                Contemporary Drapes
                              </div>
                            </button>
                          </div>

                          {/* Luxury Fusion Lounge */}
                          <div className={`transition-all duration-1000 ease-out ${
                            isCollectionHovered 
                              ? 'opacity-100 translate-y-0 delay-300' 
                              : 'opacity-0 -translate-y-8 delay-0'
                          }`}>
                            <button
                              onClick={() => { setIsCollectionHovered(false); handleNavigation("/collection/luxury"); }}
                              className="text-left group/item"
                            >
                              <div className="text-xl text-black group-hover/item:text-gray-700 transition-colors duration-300">
                                Luxury Fusion Lounge
                              </div>
                            </button>
                          </div>

                          {/* VIEW ALL - Separator and View All option */}
                          <div className={`transition-all duration-1000 ease-out ${
                            isCollectionHovered 
                              ? 'opacity-100 translate-y-0 delay-400' 
                              : 'opacity-0 -translate-y-8 delay-0'
                          }`}>
                            <div className="border-t border-gray-200 my-4 mr-32"></div>
                            <button
                              onClick={() => { setIsCollectionHovered(false); handleNavigation("/collection"); }}
                              className="text-left group/item"
                            >
                              <div className="text-md text-gray-600 group-hover/item:text-black transition-colors duration-300 font-medium">
                                VIEW ALL
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Category Images */}
                      <div className="w-3/5">
                        <div className="grid grid-cols-4 gap-4">
                          {/* Bridal Couture Image */}
                          <div>
                            <button
                              onClick={() => { setIsCollectionHovered(false); handleNavigation("/collection/bridal"); }}
                              className="w-full"
                            >
                              <div className="aspect-[4/5] overflow-hidden">
                                <img 
                                  src="/images/img7.1.jpg" 
                                  alt="Bridal Couture"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='128' viewBox='0 0 192 128'%3E%3Crect width='192' height='128' fill='%23faf5ff'/%3E%3Ctext x='96' y='64' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%237c3aed'%3EBridal%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                            </button>
                          </div>

                          {/* Signature Collection Image */}
                          <div>
                            <button
                              onClick={() => { setIsCollectionHovered(false); handleNavigation("/collection/signature"); }}
                              className="w-full"
                            >
                              <div className="aspect-[4/5] overflow-hidden">
                                <img 
                                  src="/images/img9.1.jpg" 
                                  alt="Signature Collection"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='128' viewBox='0 0 192 128'%3E%3Crect width='192' height='128' fill='%23fdf2f8'/%3E%3Ctext x='96' y='64' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%23be185d'%3ESignature%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                            </button>
                          </div>

                          {/* Contemporary Drapes Image */}
                          <div>
                            <button
                              onClick={() => { setIsCollectionHovered(false); handleNavigation("/collection/contemporary"); }}
                              className="w-full"
                            >
                              <div className="aspect-[4/5] overflow-hidden">
                                <img 
                                  src="/images/img5.webp" 
                                  alt="Contemporary Drapes"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='128' viewBox='0 0 192 128'%3E%3Crect width='192' height='128' fill='%23eff6ff'/%3E%3Ctext x='96' y='64' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%232563eb'%3EContemporary%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                            </button>
                          </div>

                          {/* Luxury Fusion Lounge Image */}
                          <div>
                            <button
                              onClick={() => { setIsCollectionHovered(false); handleNavigation("/collection/luxury"); }}
                              className="w-full"
                            >
                              <div className="aspect-[4/5] overflow-hidden">
                                <img 
                                  src="/images/img8.1.jpg" 
                                  alt="Luxury Fusion Lounge"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='128' viewBox='0 0 192 128'%3E%3Crect width='192' height='128' fill='%23fffbeb'/%3E%3Ctext x='96' y='64' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%23d97706'%3ELuxury%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About - with Dropdown */}
              <div className="group">
                <Link
                  to="/about"
                  className="text-black font-jost text-base uppercase tracking-tightness hover:opacity-70 transition-opacity relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:w-full after:h-10 after:bg-transparent after:hidden group-hover:after:block"
                >
                  About
                </Link>

                {/* About Dropdown - Company Description */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen bg-white border-t border-gray-100 shadow-2xl py-12 z-[70] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto transform">
                  <div className="max-w-screen-2xl mx-auto px-16">
                    <div className="flex">
                      {/* Left Side - Company Description */}
                      <div className="w-2/3 pr-16">
                        <div className="space-y-6">
                          {/* Title */}
                          <div className="group/item opacity-0 -translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-1000 ease-out group-hover:delay-0">
                            <h3 className="text-2xl font-medium text-black mb-6 font-jost uppercase tracking-wide">
                              About High Street PIX
                            </h3>
                          </div>

                          {/* First Paragraph */}
                          <div className="group/item opacity-0 -translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-1000 ease-out group-hover:delay-100">
                            <p className="text-gray-700 leading-relaxed text-lg mb-6">
                              High Street PIX is a premium fashion brand that celebrates the artistry of traditional Indian drapes with contemporary elegance. We specialize in creating exquisite garments that blend timeless craftsmanship with modern design sensibilities.
                            </p>
                          </div>

                          {/* Second Paragraph */}
                          <div className="group/item opacity-0 -translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-1000 ease-out group-hover:delay-200">
                            <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                              Our collections feature signature pieces, bridal couture, contemporary drapes, and luxury fusion lounge wear, each designed to tell a unique story and celebrate the rich heritage of Indian fashion.
                            </p>
                          </div>

                          {/* Learn More Button */}
                          <div className="group/item opacity-0 -translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-1000 ease-out group-hover:delay-300">
                            <Link
                              to="/about"
                              className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors duration-200 font-jost uppercase tracking-wide text-sm"
                            >
                              Learn More
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Founder and Shop Images */}
                      <div className="w-1/3">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Founder Image */}
                          <div className="group/item">
                            <div className="aspect-[4/5] overflow-hidden">
                              <img 
                                src="/images/founder.jpg" 
                                alt="Founder"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='240' viewBox='0 0 192 240'%3E%3Crect width='192' height='240' fill='%23f3f4f6'/%3E%3Ctext x='96' y='120' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%236b7280'%3EFounder%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                          </div>

                          {/* Shop Image */}
                          <div className="group/item">
                            <div className="aspect-[4/5] overflow-hidden">
                              <img 
                                src="/images/shop.jpg" 
                                alt="Store"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='240' viewBox='0 0 192 240'%3E%3Crect width='192' height='240' fill='%23f3f4f6'/%3E%3Ctext x='96' y='120' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%236b7280'%3EStore%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <Link
                to="/contact"
                className="text-black font-jost text-base uppercase tracking-tightness hover:opacity-70 transition-opacity"
              >
                Contact
              </Link>
            </div>

            {/* Right - Navigation Icons */}
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="flex items-center justify-center"
                aria-label="Wishlist"
              >
                <svg
                  width="20"
                  height="25"
                  viewBox="0 0 100 125"
                  fill="none"
                  stroke="black"
                  strokeWidth="9"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path d="M9,66.4C3.46,61.12,0,53.67,0,45.4c0-16.02,12.98-29,29-29,8.26,0,15.72,3.46,21,9,5.28-5.54,12.74-9,21-9,16.02,0,29,12.98,29,29,0,8.26-3.46,15.72-9,21l-40.98,42.19L9,66.4Z" />
                </svg>
              </Link>

              {/* Account */}
              <button
                className="flex items-center justify-center"
                aria-label="Account"
                onClick={handleProfileNavigation}
              >
                <svg
                  width="31"
                  height="31"
                  viewBox="0 0 31 31"
                  className="w-4 h-4 fill-black"
                >
                  <path
                    d="M21.2558 16.5994C22.7829 15.4046 23.8976 13.766 24.4447 11.9118C24.9918 10.0575 24.9442 8.07977 24.3085 6.25369C23.6727 4.4276 22.4805 2.84399 20.8976 1.72315C19.3148 0.602316 17.42 0 15.4769 0C13.5338 0 11.639 0.602316 10.0562 1.72315C8.47329 2.84399 7.28106 4.4276 6.64533 6.25369C6.0096 8.07977 5.96199 10.0575 6.50911 11.9118C7.05624 13.766 8.17089 15.4046 9.698 16.5994C7.08126 17.6421 4.79807 19.3713 3.09182 21.6029C1.38558 23.8345 0.320246 26.4848 0.00939552 29.2711C-0.0131054 29.4746 0.00490408 29.6804 0.0623953 29.8769C0.119887 30.0734 0.215734 30.2568 0.344465 30.4164C0.604449 30.7389 0.982592 30.9455 1.39571 30.9906C1.80882 31.0358 2.22307 30.916 2.54732 30.6574C2.87157 30.3989 3.07926 30.0228 3.1247 29.6119C3.46674 26.5837 4.91863 23.787 7.20298 21.7561C9.48733 19.7252 12.444 18.6025 15.5081 18.6025C18.5721 18.6025 21.5288 19.7252 23.8131 21.7561C26.0975 23.787 27.5494 26.5837 27.8914 29.6119C27.9337 29.9926 28.1164 30.3441 28.404 30.5987C28.6917 30.8534 29.064 30.993 29.449 30.9906H29.6204C30.0287 30.9439 30.4019 30.7386 30.6587 30.4194C30.9154 30.1002 31.0349 29.6931 30.9911 29.2866C30.6788 26.4924 29.6077 23.8353 27.8927 21.6003C26.1777 19.3653 23.8834 17.6365 21.2558 16.5994ZM15.4769 15.4996C14.2446 15.4996 13.04 15.1362 12.0154 14.4553C10.9907 13.7744 10.1921 12.8067 9.72056 11.6744C9.24898 10.5422 9.12559 9.29628 9.366 8.09429C9.60641 6.8923 10.1998 5.7882 11.0712 4.92162C11.9426 4.05503 13.0527 3.46488 14.2614 3.22579C15.47 2.9867 16.7228 3.10941 17.8612 3.5784C18.9997 4.0474 19.9728 4.84161 20.6575 5.8606C21.3421 6.8796 21.7075 8.07762 21.7075 9.30315C21.7075 10.9465 21.0511 12.5226 19.8826 13.6847C18.7141 14.8467 17.1294 15.4996 15.4769 15.4996Z"
                    fill="black"
                  />
                </svg>
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center justify-center relative"
                aria-label="Shopping cart"
              >
                <svg 
                  width="20" 
                  height="17" 
                  viewBox="0 0 19 23" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-black"
                  role="presentation"
                >
                  <path d="M0 22.985V5.995L2 6v.03l17-.014v16.968H0zm17-15H2v13h15v-13zm-5-2.882c0-2.04-.493-3.203-2.5-3.203-2 0-2.5 1.164-2.5 3.203v.912H5V4.647C5 1.19 7.274 0 9.5 0 11.517 0 14 1.354 14 4.647v1.368h-2v-.912z" fill="currentColor"></path>
                </svg>
                {cartState.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Center - Logo (Absolutely positioned for perfect centering) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="pointer-events-auto">
              <Link to="/">
                <img
                  src="/images/pix-black-logo.png"
                  alt="Highstreet Pix Logo"
                  className="w-16 h-16 object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu */}
      <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />
    </>
  );
};

export default Header;
