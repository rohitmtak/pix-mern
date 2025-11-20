import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import CollectionSection from "@/components/CollectionSection";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import CloudinaryImage from "@/components/ui/CloudinaryImage";

const Index = () => {
  const { loadUserCartFromBackend } = useCart();

  // Load cart from backend when user visits home page (only once)
  useEffect(() => {
    loadUserCartFromBackend();
  }, []); // Empty dependency array to run only once
  return (
    <div className="min-h-screen bg-white">
      {/* ===========================================
          HEADER SECTION
          ===========================================
          Mobile: Fixed header with navigation
          Desktop: Same header with full navigation
      */}
      <Header />

      {/* ===========================================
          HERO SECTION
          ===========================================
          Mobile: Full-screen hero with responsive text
          Desktop: Full-screen hero with larger text
      */}
      <HeroSection />

      {/* ===========================================
          SIGNATURE COLLECTION SECTION
          ===========================================
          Layout: Split-screen (50% image, 50% text)
          Mobile: 40vh height, smaller text (text-4xl)
          Desktop: Full screen height, large text (text-9xl)
          Features: Image hover effect, gradient separators
      */}
      <Link to="/collection/signature" className="block">
        <section className="relative w-full h-[40vh] desktop:h-screen flex flex-row">
          {/* Mobile/Tablet-only top separator line */}
          <div className="desktop:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent z-10"></div>
          
          {/* LEFT SIDE - IMAGE CONTAINER */}
          <div className="w-1/2 flex items-center justify-center relative group h-full">
            {/* Default image - visible by default */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757309457/signature-collection-main_m0xi89.webp"
              alt="Signature Collection"
              className="w-full h-full object-cover transition-opacity custom-fade custom-fade-mobile ease-in-out group-hover:opacity-0"
              quality="auto"
              format="auto"
              crop="scale"
              loading="eager"
            />

            {/* Hover image - appears on hover */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757273498/signature-collection-hover_yxltpy.webp"
              alt="Signature Collection Hover"
              className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity custom-fade custom-fade-mobile ease-in-out group-hover:opacity-100"
              quality="auto"
              format="auto"
              crop="scale"
              loading="lazy"
            />
          </div>

          {/* RIGHT SIDE - TEXT CONTAINER */}
          <div className="w-1/2 relative flex items-center justify-center h-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Background decorative pattern */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/30"></div>
            </div>

            {/* Main text content */}
            <div className="relative z-10 mt-8 desktop:mt-0">
              <div className="text-4xl desktop:text-9xl font-medium text-right leading-tight desktop:leading-none font-playfair px-4 desktop:px-0 text-black">
                SIGN
                <br />
                ATURE
                <br />
                COLL
                <br />
                ECTION
              </div>
            </div>
          </div>
          
          {/* Mobile/Tablet-only bottom separator line */}
          <div className="desktop:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent z-10"></div>
        </section>
      </Link>

      {/* ===========================================
          BRIDAL COUTURE SECTION
          ===========================================
          Layout: Full-width image with text overlay
          Mobile: 60vh height, smaller text (text-3xl)
          Desktop: Full screen height, large text (text-8xl)
          Features: Black background, centered text overlay
      */}
      <Link to="/collection/bridal" className="block">
        <section className="relative w-full h-[60vh] desktop:h-screen">
          {/* Main image container */}
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {/* Background image */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757414519/img7.1_fgqnvb.jpg"
              alt="Bridal Couture Collection"
              imgClassName="object-[center_top] custom-object-pos"
              className="w-full h-full"
              quality="auto"
              format="auto"
              loading="lazy"
            />

            {/* Text overlay positioned at bottom */}
            <div className="absolute bottom-8 desktop:bottom-16 left-0 right-0 text-center w-fit mx-auto px-4">
              <h2
                className="font-playfair text-3xl desktop:text-8xl text-white font-normal uppercase font-jost cursor-pointer"
                style={{
                  fontSize: "clamp(2rem, 8vw, 120px)",
                  lineHeight: "normal",
                }}
              >
                Bridal Couture
              </h2>

              {/* Mobile/Tablet-only spacing */}
              <div className="desktop:hidden mt-3"></div>
            </div>
          </div>
          
          {/* Mobile/Tablet-only bottom separator line */}
          <div className="desktop:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent z-10"></div>
        </section>
      </Link>

      {/* ===========================================
          CONTEMPORARY DRAPES SECTION
          ===========================================
          Layout: Split-screen (50% text, 50% image)
          Mobile: 40vh height, smaller text (text-4xl)
          Desktop: Full screen height, large text (text-9xl)
          Features: Text on left, image on right, hover effect
      */}
      <Link to="/collection/contemporary" className="block">
        <section className="relative w-full h-[40vh] desktop:h-screen flex flex-row">
          {/* LEFT SIDE - TEXT CONTAINER */}
          <div className="w-1/2 relative flex items-center justify-center desktop:justify-start desktop:pl-32 h-full bg-gradient-to-br from-slate-50 via-white to-gray-50">
            {/* Background decorative pattern */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/40 via-transparent to-gray-50/20"></div>
            </div>

            {/* Main text content */}
            <div className="relative z-10 mt-8 desktop:mt-0">
              <div className="text-4xl desktop:text-9xl font-medium text-left leading-tight desktop:leading-none font-playfair px-4 desktop:px-0 text-black">
                CON
                <br />
                TEMPO
                <br />
                RARY
                <br />
                DRAPES
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - IMAGE CONTAINER */}
          <div className="w-1/2 flex items-center justify-center relative group h-full">
            {/* Default image - visible by default */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757410412/sec4-img3_qnh5ns.png"
              alt="Contemporary Drapes"
              className="w-full h-full object-cover object-top transition-opacity custom-fade custom-fade-mobile ease-in-out group-hover:opacity-0"
              quality="auto"
              format="auto"
              crop="scale"
              loading="lazy"
            />
            
            {/* Hover image - appears on hover */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757411073/sec4-img4_gj1qge.webp"
              alt="Contemporary Drapes Hover"
              className="w-full h-full object-cover object-top absolute inset-0 opacity-0 transition-opacity custom-fade custom-fade-mobile ease-in-out group-hover:opacity-100"
              quality="auto"
              format="auto"
              crop="scale"
              loading="lazy"
            />
          </div>
          
          {/* Mobile/Tablet-only bottom separator line */}
          <div className="desktop:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent z-10"></div>
        </section>
      </Link>

      {/* ===========================================
          LUXURY FUSION LOUNGE SECTION
          ===========================================
          Layout: Full-width image with text overlay
          Mobile: 60vh height, smaller text (text-3xl)
          Desktop: Full screen height, large text (text-8xl)
          Features: Similar to Bridal section, centered text overlay
      */}
      <Link to="/collection/luxury" className="block group">
        <section className="relative w-full h-[60vh] desktop:h-screen overflow-hidden">
          {/* Main image container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background image */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757411708/img8.1_cbwkx6.jpg"
              alt="Luxury Fusion Lounge"
              imgClassName="object-[center_top] custom-object-pos"
              className="w-full h-full"
              quality="auto"
              format="auto"
              loading="lazy"
            />

            {/* Text overlay positioned at bottom */}
            <div className="absolute bottom-8 desktop:bottom-16 left-0 right-0 text-center w-fit mx-auto px-4">
              <h2
                className="font-playfair text-3xl desktop:text-8xl text-white font-normal uppercase font-jost cursor-pointer"
                style={{
                  fontSize: "clamp(2rem, 8vw, 120px)",
                  lineHeight: "normal",
                }}
              >
                Luxury Fusion Lounge
              </h2>
            </div>
          </div>
        </section>
      </Link>

      {/* ===========================================
          STORE INFORMATION SECTION
          ===========================================
          Layout: Title + Full-width image with address overlay
          Mobile: 60vh height, smaller text, responsive padding
          Desktop: Full screen height, larger text
          Features: Store address and hours overlay
      */}
      <section className="relative w-full">
        {/* Store title section */}
        <div className="text-center py-6 md:py-10 px-4">
          <h2
            className="text-2xl md:text-4xl uppercase text-black font-jost"
            style={{
              lineHeight: "clamp(2rem, 6vw, 96px)",
            }}
          >
            OUR STORE
          </h2>
        </div>

        {/* Store image with address overlay */}
        <div className="relative w-full h-[60vh] desktop:h-screen">
          {/* Background store image */}
          <CloudinaryImage
            cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757412649/storefront_fzas9n.png"
            alt="Our Store"
            className="w-full h-full object-cover"
            quality="auto"
            format="auto"
            crop="scale"
            loading="lazy"
          />

          {/* Address and hours overlay */}
          <div className="absolute bottom-8 desktop:bottom-16 left-1/2 transform -translate-x-1/2 text-center px-2 desktop:px-4 w-[95%] desktop:w-auto">
            <div className="text-white">
              {/* Store address */}
              <p
                className="text-sm desktop:text-xl font-normal font-jost leading-relaxed whitespace-nowrap overflow-hidden"
                style={{
                  lineHeight: "clamp(1.5rem, 4vw, 50px)",
                }}
              >
                HIGH STREET PIX, 22 - 25, Wonderland, Lower Ground Floor, 7 M.G.
                Road, Camp, Pune - 411001 Maharashtra, India
              </p>
              
              {/* Store hours and contact */}
              <p
                className="text-sm desktop:text-xl font-normal mt-2 desktop:mt-0 mb-0 leading-none font-jost whitespace-nowrap overflow-hidden"
                style={{
                  lineHeight: "clamp(1.25rem, 3vw, 25px)",
                  margin: 0,
                  padding: 0,
                }}
              >
                7 Days Open | 11AM - 7PM | Contact : 020 - 41207311
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================
          FOOTER SECTION
          ===========================================
          Mobile: Compact footer with essential links
          Desktop: Full footer with all sections
      */}
      <Footer />
    </div>
  );
};

export default Index;
