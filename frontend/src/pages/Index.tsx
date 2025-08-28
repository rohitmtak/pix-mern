import React from 'react';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import CollectionSection from "@/components/CollectionSection";
import StoreInfo from "@/components/StoreInfo";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Signature Collection Section */}
      <section className="relative w-full h-screen flex">
        {/* Left Image */}
        <div className="w-1/2 flex items-center justify-center relative group h-full">
          {/* First image (default) */}
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/06d622ea0c5fff4f600cdb92f073df475fb85d8b?width=1922"
            alt="Signature Collection"
            className="w-full h-full object-cover transition-opacity custom-fade ease-in-out group-hover:opacity-0"
          />
          {/* Second image (on hover) */}
          <img
            src="/images/img9.png"
            alt="Signature Collection Hover"
            className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity custom-fade ease-in-out group-hover:opacity-100"
          />
        </div>

        {/* Right Side with Text Overlay */}
        <div className="w-1/2 relative flex items-center justify-center">
          <a
            href="/collection/signature"
            className="text-9xl font-bold text-right leading-none cursor-pointer hover:opacity-80 transition-opacity duration-300"
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
          </a>
        </div>
      </section>

      {/* Bridal Couture Section */}
      <section className="relative w-full h-screen">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/images/img7.png"
            alt="Bridal Couture Collection"
            className="w-full h-full object-cover custom-object-pos"
          />
          <div className="absolute bottom-16 left-0 right-0 text-center w-fit mx-auto">
            <a
              href="/collection/bridal"
              className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <h2
                className="text-8xl text-white font-normal uppercase font-jost"
                style={{
                  fontSize: "120px",
                  lineHeight: "normal",
                }}
              >
                Bridal Couture
              </h2>
            </a>
          </div>
        </div>
      </section>

      {/* Contemporary Drapes Section */}
      <section className="relative w-full h-screen flex">
        {/* Left Text Overlay */}
        <div className="w-1/2 relative flex items-center justify-start pl-32">
          <a
            href="/collection/contemporary"
            className="text-9xl font-bold text-left leading-none cursor-pointer hover:opacity-80 transition-opacity duration-300"
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
          </a>
        </div>

        {/* Right Image */}
        <div className="w-1/2 flex items-center justify-center relative group h-full">
          {/* First image (default) */}
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/05207931248df06094a5acff4d84e14cf9df5cd5?width=1922"
            alt="Contemporary Drapes"
            className="w-full h-full object-cover object-top transition-opacity custom-fade ease-in-out group-hover:opacity-0"
          />
          {/* Second image (on hover) */}
          <img
            src="/images/img1.webp"
            alt="Contemporary Drapes Hover"
            className="w-full h-full object-cover object-top absolute inset-0 opacity-0 transition-opacity custom-fade ease-in-out group-hover:opacity-100"
          />
        </div>
      </section>

      {/* Luxury Fusion Lounge Section */}
      <section className="relative w-full h-screen">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/images/img8.png"
            alt="Luxury Fusion Lounge"
            className="w-full h-full object-cover custom-object-pos"
          />
          <div className="absolute bottom-16 left-0 right-0 text-center w-fit mx-auto">
            <a
              href="/collection/luxury"
              className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <h2
                className="text-8xl text-white font-normal uppercase font-jost"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                  fontSize: "120px",
                  lineHeight: "normal",
                }}
              >
                Luxury Fusion Lounge
              </h2>
            </a>
          </div>
        </div>
      </section>

      {/* Store Info Section */}
      <StoreInfo />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;