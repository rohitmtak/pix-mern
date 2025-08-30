import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import CollectionSection from "@/components/CollectionSection";
import StoreInfo from "@/components/StoreInfo";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

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

      {/* Signature Collection Section */}
      {/* <Link to="/collection/signature" className="block">
        <section className="relative w-full h-screen flex"> */}
          {/* Left Image */}
          {/* <div className="w-1/2 flex items-center justify-center relative group h-full"> */}
            {/* First image (default) */}
            {/* <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/06d622ea0c5fff4f600cdb92f073df475fb85d8b?width=1922"
              alt="Signature Collection"
              className="w-full h-full object-cover transition-opacity custom-fade ease-in-out group-hover:opacity-0"
            /> */}
            {/* Second image (on hover) */}
            {/* <img
              src="/images/img9.png"
              alt="Signature Collection Hover"
              className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity custom-fade ease-in-out group-hover:opacity-100"
            />
          </div> */}

          {/* Right Side with Text Overlay */}
          {/* <div className="w-1/2 relative flex items-center justify-center">
            <div
              className="text-9xl font-bold text-right leading-none"
              style={{
                backgroundImage: "url('/images/img1.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SIGN<br />ATURE<br />COLLEC<br />TION
            </div>
          </div>
        </section>
      </Link> */}
      <Link to="/collection/signature" className="block">
        <section className="relative w-full h-screen">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/signature.jpg"
              alt="Bridal Couture Collection"
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute bottom-16 left-0 right-0 text-center w-fit mx-auto">
              <h2
                className="text-8xl text-white font-normal uppercase font-jost cursor-pointer hover:opacity-80 transition-opacity duration-300"
                style={{
                  fontSize: "120px",
                  lineHeight: "normal",
                }}
              >
                Signature Collection
              </h2>
            </div> */}
          </div>
        </section>
      </Link>

      {/* Bridal Couture Section */}
      <Link to="/collection/bridal" className="block">
        <section className="relative w-full h-screen">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/bridal.jpg"
              alt="Bridal Couture Collection"
              className="w-full h-full object-cover" // custom-object-pos
            />
            {/* <div className="absolute bottom-16 left-0 right-0 text-center w-fit mx-auto">
              <h2
                className="text-8xl text-white font-normal uppercase font-jost cursor-pointer hover:opacity-80 transition-opacity duration-300"
                style={{
                  fontSize: "120px",
                  lineHeight: "normal",
                }}
              >
                Bridal Couture
              </h2>
            </div> */}
          </div>
        </section>
      </Link>

      {/* Contemporary Drapes Section */}
      {/* <Link to="/collection/contemporary" className="block">
        <section className="relative w-full h-screen flex"> */}
          {/* Left Text Overlay */}
          {/* <div className="w-1/2 relative flex items-center justify-start pl-32">
            <div
              className="text-9xl font-bold text-left leading-none"
              style={{
                backgroundImage: "url('/images/img9.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CON<br />TEMPO<br />RARY<br />DRAPES
            </div>
          </div> */}

          {/* Right Image */}
          {/* <div className="w-1/2 flex items-center justify-center relative group h-full"> */}
            {/* First image (default) */}
            {/* <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/05207931248df06094a5acff4d84e14cf9df5cd5?width=1922"
              alt="Contemporary Drapes"
              className="w-full h-full object-cover object-top transition-opacity custom-fade ease-in-out group-hover:opacity-0"
            /> */}
            {/* Second image (on hover) */}
            {/* <img
              src="/images/img1.webp"
              alt="Contemporary Drapes Hover"
              className="w-full h-full object-cover object-top absolute inset-0 opacity-0 transition-opacity custom-fade ease-in-out group-hover:opacity-100"
            />
          </div>
        </section>
      </Link> */}
      <Link to="/collection/contemporary" className="block">
        <section className="relative w-full h-screen">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/contemporary.jpg"
              alt="Contemporary Drapes"
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute bottom-16 left-0 right-0 text-center w-fit mx-auto">
              <h2
                className="text-8xl text-white font-normal uppercase font-jost cursor-pointer hover:opacity-80 transition-opacity duration-300"
                style={{
                  fontSize: "120px",
                  lineHeight: "normal",
                }}
              >
                Contemporary Drapes
              </h2>
            </div> */}
          </div>
        </section>
      </Link>

      {/* Luxury Fusion Lounge Section */}
      <Link to="/collection/luxury" className="block">
        <section className="relative w-full h-screen">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/luxury.jpg"
              alt="Luxury Fusion Lounge"
              className="w-full h-full object-cover" // custom-object-pos
            />
            {/* <div className="absolute bottom-16 left-0 right-0 text-center w-fit mx-auto">
              <h2
                className="text-8xl text-white font-normal uppercase font-jost cursor-pointer hover:opacity-80 transition-opacity duration-300"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                  fontSize: "120px",
                  lineHeight: "normal",
                }}
              >
                Luxury Fusion Lounge
              </h2>
            </div> */}
          </div>
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