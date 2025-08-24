import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SideMenu from "./SideMenu";

const Header = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isCollectionHovered, setIsCollectionHovered] = useState(false);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled past 100px for background change
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Show navigation when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past initial 100px
        setIsNavigationVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsNavigationVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

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

  // Determine header background based on page and state
  const getHeaderBackground = () => {
    if (isHomePage) {
      // On home page: transparent by default, white on hover only
      if (isHeaderHovered) {
        return 'bg-white shadow';
      }
      return 'bg-transparent';
    } else {
      // On other pages: always white
      return 'bg-white shadow';
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${getHeaderBackground()}`}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        {/* Main Navbar */}
        <div className={`px-16 py-8 relative`}>
          <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
            {/* Left - Navigation Links */}
            <div className="flex items-center space-x-12">
              {/* Home */}
              <Link
                to="/"
                className="text-black font-jost text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              >
                Home
              </Link>

              {/* Our Collection - with Dropdown */}
              <div
                className="group"
                onMouseEnter={() => setIsCollectionHovered(true)}
                onMouseLeave={() => setIsCollectionHovered(false)}
              >
                <button className="text-black font-jost text-sm uppercase tracking-wide hover:opacity-70 transition-opacity relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:w-32 after:h-10 after:bg-transparent after:hidden group-hover:after:block">
                  Collection
                </button>

                {/* Category Cards Row - Full width with images */}
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-screen bg-white border-t border-gray-100 shadow-2xl py-12 z-[70] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto transform translate-y-2 group-hover:translate-y-0"
                >
                  <div className="max-w-screen-2xl mx-auto px-16">
                    <div className="flex">
                      {/* Left Side - Category Names */}
                      <div className="w-2/5">
                        <div className="space-y-6">
                          {/* Signature Collection */}
                          <div className="group/item opacity-0 -translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-1000 ease-out group-hover:delay-0">
                            <button
                              onClick={() => handleNavigation("/collection?category=signature")}
                              className="text-left"
                            >
                              <div className="text-xl text-black group-hover/item:text-gray-700 transition-colors duration-300">
                                Signature Collection
                              </div>
                            </button>
                          </div>

                          {/* Bridal Couture */}
                          <div className="group/item opacity-0 -translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-1000 ease-out group-hover:delay-100">
                            <button
                              onClick={() => handleNavigation("/collection?category=bridal")}
                              className="text-left"
                            >
                              <div className="text-xl text-black group-hover/item:text-gray-700 transition-colors duration-300">
                                Bridal Couture
                              </div>
                            </button>
                          </div>

                          {/* Contemporary Drapes */}
                          <div className="group/item opacity-0 -translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-1000 ease-out group-hover:delay-200">
                            <button
                              onClick={() => handleNavigation("/collection?category=contemporary")}
                              className="text-left"
                            >
                              <div className="text-xl text-black group-hover/item:text-gray-700 transition-colors duration-300">
                                Contemporary Drapes
                              </div>
                            </button>
                          </div>

                          {/* Luxury Fusion Lounge */}
                          <div className="group/item opacity-0 -translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-1000 ease-out group-hover:delay-300">
                            <button
                              onClick={() => handleNavigation("/collection?category=luxury")}
                              className="text-left"
                            >
                              <div className="text-xl text-black group-hover/item:text-gray-700 transition-colors duration-300">
                                Luxury Fusion Lounge
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Category Images */}
                      <div className="w-3/5">
                        <div className="grid grid-cols-4 gap-4">
                          {/* Signature Collection Image */}
                          <div className="group/item">
                            <button
                              onClick={() => handleNavigation("/collection?category=signature")}
                              className="w-full"
                            >
                              <div className="aspect-[4/5] overflow-hidden">
                                <img 
                                  src="/images/img9.png" 
                                  alt="Signature Collection"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='128' viewBox='0 0 192 128'%3E%3Crect width='192' height='128' fill='%23fdf2f8'/%3E%3Ctext x='96' y='64' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%23be185d'%3ESignature%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                            </button>
                          </div>

                          {/* Bridal Couture Image */}
                          <div className="group/item">
                            <button
                              onClick={() => handleNavigation("/collection?category=bridal")}
                              className="w-full"
                            >
                              <div className="aspect-[4/5] overflow-hidden">
                                <img 
                                  src="/images/img7.png" 
                                  alt="Bridal Couture"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='128' viewBox='0 0 192 128'%3E%3Crect width='192' height='128' fill='%23faf5ff'/%3E%3Ctext x='96' y='64' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%237c3aed'%3EBridal%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                            </button>
                          </div>

                          {/* Contemporary Drapes Image */}
                          <div className="group/item">
                            <button
                              onClick={() => handleNavigation("/collection?category=contemporary")}
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
                          <div className="group/item">
                            <button
                              onClick={() => handleNavigation("/collection?category=luxury")}
                              className="w-full"
                            >
                              <div className="aspect-[4/5] overflow-hidden">
                                <img 
                                  src="/images/img8.png" 
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

              {/* About */}
              <Link
                to="/about"
                className="text-black font-jost text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              >
                About
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                className="text-black font-jost text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
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
                to="/checkout"
                className="flex items-center justify-center"
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

        {/* Commented out Hamburger Menu Button */}
        {/* <button
          onClick={toggleSideMenu}
          className="flex items-center justify-center"
          aria-label="Open menu"
        >
          <svg
            width="34"
            height="28"
            viewBox="0 0 34 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 fill-black"
          >
            <path
              d="M1.43514 0.000123538C1.24764 -0.00219144 1.06148 0.0280497 0.887479 0.0890897C0.713481 0.15013 0.555114 0.240751 0.421582 0.355687C0.28805 0.470624 0.182016 0.607582 0.109643 0.758605C0.0372697 0.909627 0 1.0717 0 1.23541C0 1.39911 0.0372697 1.56119 0.109643 1.71221C0.182016 1.86323 0.28805 2.00019 0.421582 2.11513C0.555114 2.23006 0.713481 2.32068 0.887479 2.38172C1.06148 2.44276 1.24764 2.473 1.43514 2.47069H32.5649C32.7524 2.473 32.9385 2.44276 33.1125 2.38172C33.2865 2.32068 33.4449 2.23006 33.5784 2.11513C33.7119 2.00019 33.818 1.86323 33.8904 1.71221C33.9627 1.56119 34 1.39911 34 1.23541C34 1.0717 33.9627 0.909627 33.8904 0.758605C33.818 0.607582 33.7119 0.470624 33.5784 0.355687C33.4449 0.240751 33.2865 0.15013 33.1125 0.0890897C32.9385 0.0280497 32.7524 -0.00219144 32.5649 0.000123538H1.43514ZM1.43514 13.1765C1.24764 13.1742 1.06148 13.2044 0.887479 13.2654C0.713481 13.3265 0.555114 13.4171 0.421582 13.532C0.28805 13.647 0.182016 13.7839 0.109643 13.935C0.0372697 14.086 0 14.2481 0 14.4118C0 14.5755 0.0372697 14.7375 0.109643 14.8886C0.182016 15.0396 0.28805 15.1765 0.421582 15.2915C0.555114 15.4064 0.713481 15.497 0.887479 15.5581C1.06148 15.6191 1.24764 15.6494 1.43514 15.647H32.5649C32.7524 15.6494 32.9385 15.6191 33.1125 15.5581C33.2865 15.497 33.4449 15.4064 33.5784 15.2915C33.7119 15.1765 33.818 15.0396 33.8904 14.8886C33.9627 14.7375 34 14.5755 34 14.4118C34 14.2481 33.9627 14.086 33.8904 13.935C33.818 13.7839 33.7119 13.647 33.5784 13.532C33.4449 13.4171 33.2865 13.3265 33.1125 13.2654C32.9385 13.2044 32.7524 13.1742 32.5649 13.1765H1.43514ZM1.43514 25.5293C1.24764 25.527 1.06148 25.5572 0.887479 25.6183C0.713481 25.6793 0.555114 25.7699 0.421582 25.8849C0.28805 25.9998 0.182016 26.1368 0.109643 26.2878C0.0372697 26.4388 0 26.6009 0 26.7646C0 26.9283 0.0372697 27.0904 0.109643 27.2414C0.182016 27.3924 0.28805 27.5294 0.421582 27.6443C0.555114 27.7592 0.713481 27.8499 0.887479 27.9109C1.06148 27.9719 1.24764 28.0022 1.43514 27.9999H32.5649C32.7524 28.0022 32.9385 27.9719 33.1125 27.9109C33.2865 27.8499 33.4449 27.7592 33.5784 27.6443C33.7119 27.5294 33.818 27.3924 33.8904 27.2414C33.9627 27.0904 34 26.9283 34 26.7646C34 26.6009 33.9627 26.4388 33.8904 26.2878C33.818 26.1368 33.7119 25.9998 33.5784 25.8849C33.4449 25.7699 33.2865 25.6793 33.1125 25.6183C32.9385 25.5572 32.7524 25.527 32.5649 25.5293H1.43514Z"
              fill="black"
            />
          </svg>
        </button> */}

        {/* Removed the separate Navigation Section - now integrated above */}
      </header>

      {/* Side Menu */}
      <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />
    </>
  );
};

export default Header;
