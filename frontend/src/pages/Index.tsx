import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import CollectionSection from "@/components/CollectionSection";
import StoreInfo from "@/components/StoreInfo";
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
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Mobile Section Spacer */}
      <div className="md:hidden h-6 bg-gradient-to-b from-white via-gray-50 to-white"></div>

      {/* Signature Collection Section */}
      <Link to="/collection/signature" className="block">
        <section className="relative w-full h-screen flex flex-col md:flex-row">
          {/* Mobile Section Separator */}
          <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent z-10"></div>
          
          {/* Left Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative group h-1/2 md:h-full">
            {/* First image (default) */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757309457/signature-collection-main_m0xi89.webp"
              alt="Signature Collection"
              className="w-full h-full object-cover transition-opacity custom-fade ease-in-out group-hover:opacity-0"
              quality="auto"
              format="auto"
              crop="scale"
              loading="eager"
            />
            {/* Second image (on hover) */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757273498/signature-collection-hover_yxltpy.webp"
              alt="Signature Collection Hover"
              className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity custom-fade ease-in-out group-hover:opacity-100"
              quality="auto"
              format="auto"
              crop="scale"
              loading="lazy"
            />
          </div>

          {/* Right Side with Text Overlay */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center h-1/2 md:h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 md:bg-transparent">
            {/* Luxury Fashion Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Elegant background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/30"></div>
              
              {/* Mobile luxury elements */}
              <div className="md:hidden">
                {/* Gold accent corners */}
                <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-amber-300/40"></div>
                <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-amber-300/40"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-amber-300/40"></div>
                <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-amber-300/40"></div>
                
                
                {/* Side accent lines */}
                <div className="absolute top-1/3 left-4 w-8 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"></div>
                <div className="absolute top-1/3 right-4 w-8 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"></div>
              </div>
              
              {/* Desktop luxury elements */}
              <div className="hidden md:block">
                {/* Sophisticated gold corner frames */}
                <div className="absolute top-12 left-12 w-16 h-16 border-l-2 border-t-2 border-amber-300/35"></div>
                <div className="absolute top-12 right-12 w-16 h-16 border-r-2 border-t-2 border-amber-300/35"></div>
                <div className="absolute bottom-12 left-12 w-16 h-16 border-l-2 border-b-2 border-amber-300/35"></div>
                <div className="absolute bottom-12 right-12 w-16 h-16 border-r-2 border-b-2 border-amber-300/35"></div>
                
                {/* Elegant side patterns */}
                <div className="absolute top-1/4 left-8 w-12 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent"></div>
                <div className="absolute top-1/4 right-8 w-12 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent"></div>
                <div className="absolute bottom-1/4 left-8 w-12 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent"></div>
                <div className="absolute bottom-1/4 right-8 w-12 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent"></div>
                
                
                {/* Vertical accent lines */}
                <div className="absolute top-1/3 left-6 w-px h-24 bg-gradient-to-b from-transparent via-amber-300/20 to-transparent"></div>
                <div className="absolute top-1/3 right-6 w-px h-24 bg-gradient-to-b from-transparent via-amber-300/20 to-transparent"></div>
              </div>
            </div>
            
            <div className="relative z-10">
              <div
                className="text-4xl md:text-9xl font-medium text-center md:text-right leading-tight md:leading-none font-playfair px-4 md:px-0 text-black"
                // style={{
                //   backgroundImage: "url('/images/img1.webp')",
                //   backgroundSize: "cover",
                //   backgroundPosition: "center",
                //   backgroundClip: "text",
                //   WebkitBackgroundClip: "text",
                //   WebkitTextFillColor: "transparent",
                // }}
              >
                SIGN<br />ATURE<br />COLLEC<br />TION
              </div>
              
              {/* Mobile-only subtitle */}
              <div className="md:hidden mt-4 text-center">
                <p className="text-sm text-gray-600 font-jost uppercase tracking-wider">
                  Timeless Elegance
                </p>
                <div className="w-12 h-px bg-amber-300/30 mx-auto mt-2"></div>
              </div>
            </div>
          </div>
          
          {/* Mobile Section Separator */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent z-10"></div>
        </section>
      </Link>

      {/* Bridal Couture Section */}
      <Link to="/collection/bridal" className="block">
        <section className="relative w-full h-screen">
          {/* Mobile Section Separator */}
          <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent z-10"></div>
          
          <div className="relative w-full h-screen bg-black flex items-center justify-center">
          <CloudinaryImage
            cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/c_fill,w_1920,h_1080/v1757273492/bridal-couture-main_whvkli.webp"
            alt="Bridal Couture Collection"
            className="w-full h-full object-cover"
            quality="auto"
            format="auto"
            loading="lazy"
          />
 
            {/* Enhanced Mobile Text Container */}
            <div className="absolute bottom-8 md:bottom-16 left-0 right-0 text-center w-fit mx-auto px-4">
              {/* Mobile-only decorative element */}
              <div className="md:hidden mb-4 flex justify-center">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              
              <h2
                className="font-playfair text-3xl md:text-8xl text-white font-normal uppercase font-jost cursor-pointer hover:opacity-80 transition-opacity duration-300"
                style={{
                  fontSize: "clamp(2rem, 8vw, 120px)",
                  lineHeight: "normal",
                }}
              >
                Bridal Couture
              </h2>
              
              {/* Mobile-only subtitle */}
              <div className="md:hidden mt-3">
                <p className="text-sm text-white/80 font-jost uppercase tracking-wider">
                  Timeless Romance
                </p>
              </div>
            </div>
          </div>
          
          {/* Mobile Section Separator */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent z-10"></div>
        </section>
      </Link>

      {/* Mobile Section Spacer */}
      <div className="md:hidden h-6 bg-gradient-to-b from-amber-50 via-white to-amber-50"></div>

      {/* Contemporary Drapes Section */}
      <Link to="/collection/contemporary" className="block">
        <section className="relative w-full h-screen flex flex-col md:flex-row">
          {/* Mobile Section Separator */}
          <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent z-10"></div>
          
          {/* Left Text Overlay */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center md:justify-start md:pl-32 h-1/2 md:h-full bg-gradient-to-br from-slate-50 via-white to-gray-50 md:bg-transparent order-2 md:order-1">
            {/* Luxury Fashion Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Elegant background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/40 via-transparent to-gray-50/20"></div>
              
              {/* Mobile luxury elements */}
              <div className="md:hidden">
                {/* Amber accent corners */}
                <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-amber-300/40"></div>
                <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-amber-300/40"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-amber-300/40"></div>
                <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-amber-300/40"></div>
                
                
                {/* Side accent lines */}
                <div className="absolute top-1/3 left-4 w-8 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"></div>
                <div className="absolute top-1/3 right-4 w-8 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"></div>
              </div>
              
              {/* Desktop luxury elements */}
              <div className="hidden md:block">
                {/* Sophisticated gold corner frames */}
                <div className="absolute top-12 left-12 w-16 h-16 border-l-2 border-t-2 border-amber-300/35"></div>
                <div className="absolute top-12 right-12 w-16 h-16 border-r-2 border-t-2 border-amber-300/35"></div>
                <div className="absolute bottom-12 left-12 w-16 h-16 border-l-2 border-b-2 border-amber-300/35"></div>
                <div className="absolute bottom-12 right-12 w-16 h-16 border-r-2 border-b-2 border-amber-300/35"></div>
                
                {/* Elegant side patterns */}
                <div className="absolute top-1/4 left-8 w-12 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent"></div>
                <div className="absolute top-1/4 right-8 w-12 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent"></div>
                <div className="absolute bottom-1/4 left-8 w-12 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent"></div>
                <div className="absolute bottom-1/4 right-8 w-12 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent"></div>
                
                
                {/* Vertical accent lines */}
                <div className="absolute top-1/3 left-6 w-px h-24 bg-gradient-to-b from-transparent via-amber-300/20 to-transparent"></div>
                <div className="absolute top-1/3 right-6 w-px h-24 bg-gradient-to-b from-transparent via-amber-300/20 to-transparent"></div>
              </div>
            </div>
            
            <div className="relative z-10">
              {/* Mobile-only decorative element */}
              <div className="md:hidden mb-4 flex justify-center">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent"></div>
              </div>
              
              <div
                className="text-4xl md:text-9xl font-medium text-center md:text-left leading-tight md:leading-none font-playfair px-4 md:px-0 text-black"
                // style={{
                //   backgroundImage: "url('/images/img9.png')",
                //   backgroundSize: "cover",
                //   backgroundPosition: "center",
                //   backgroundClip: "text",
                //   WebkitBackgroundClip: "text",
                //   WebkitTextFillColor: "transparent",
                // }}
              >
                CON<br />TEMPO<br />RARY<br />DRAPES
              </div>
              
              {/* Enhanced Mobile-only subtitle */}
              <div className="md:hidden mt-4 text-center">
                <p className="text-sm text-gray-600 font-jost uppercase tracking-wider">
                  Modern Sophistication
                </p>
                <div className="w-12 h-px bg-amber-300/40 mx-auto mt-2"></div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative group h-1/2 md:h-full order-1 md:order-2">
            {/* First image (default) */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757273495/contemporary-drapes-main_weoz2z.webp"
              alt="Contemporary Drapes"
              className="w-full h-full object-cover object-top transition-opacity custom-fade ease-in-out group-hover:opacity-0"
              quality="auto"
              format="auto"
              crop="scale"
              loading="lazy"
            />
            {/* Second image (on hover) */}
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757273493/contemporary-drapes-hover_pmd6uf.webp"
              alt="Contemporary Drapes Hover"
              className="w-full h-full object-cover object-top absolute inset-0 opacity-0 transition-opacity custom-fade ease-in-out group-hover:opacity-100"
              quality="auto"
              format="auto"
              crop="scale"
              loading="lazy"
            />
          </div>
        </section>
      </Link>

      {/* Mobile Section Spacer */}
      <div className="md:hidden h-6 bg-gradient-to-b from-amber-50 via-white to-white"></div>

      {/* Luxury Fusion Lounge Section */}
      <Link to="/collection/luxury" className="block group">
        <section className="relative w-full h-screen overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
          <CloudinaryImage
            cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/c_fill,w_1920,h_1080/v1757273496/luxury-fusion-main_ojwtwi.webp"
            alt="Luxury Fusion Lounge"
            className="w-full h-full object-cover"
            quality="auto"
            format="auto"
            loading="lazy"
          />

            <div className="absolute bottom-8 md:bottom-16 left-0 right-0 text-center w-fit mx-auto px-4">
              <h2
                className="font-playfair text-3xl md:text-8xl text-white font-normal uppercase font-jost cursor-pointer hover:opacity-80 transition-opacity duration-300"
                style={{
                  fontSize: "clamp(2rem, 8vw, 120px)",
                  lineHeight: "normal",
                }}
              >
                Luxury Fusion Lounge
              </h2>
            </div>
          </div>
          
          {/* Mobile Section Separator */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent z-10"></div>
        </section>
      </Link>

      {/* Store Info Section */}
      <StoreInfo />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;