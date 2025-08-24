import React from 'react';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/CollectionSection";
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
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c49c9d9e20ba4b19ae5cedb7e42f49252f11cd81?width=1318"
            alt=""
            className="w-[500px] max-h-[80vh] object-cover"
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
        </div>
      </section>

      {/* Bridal Couture Section */}
      <CollectionSection
        imageUrl="/images/img7.png"
        altText="Bridal Couture Collection"
        title="Bridal Couture"
        titleColor="white"
        titlePosition="center"
        containerHeight="h-screen"
        titleSize="text-8xl"
        titleStyle={{
          fontSize: "100px",
          letterSpacing: "19.5px",
          fontWeight: 500,
        }}
        imageClassName="custom-object-pos"
      />

      {/* Contemporary Drapes Section */}
      <section className="relative w-full h-screen flex">
        {/* Left Text Overlay */}
        <div className="w-1/2 relative flex items-center justify-start pl-32">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6271c49005187678fdebbb19c1d206a03601f591?width=1484"
            alt=""
            className="w-[500px] max-h-[80vh] object-contain"
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
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
          <div className="absolute bottom-16 left-16 pointer-events-none">
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