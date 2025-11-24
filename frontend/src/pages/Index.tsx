import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import CloudinaryImage from "@/components/ui/CloudinaryImage";

const Index = () => {
  const { loadUserCartFromBackend } = useCart();

  useEffect(() => {
    loadUserCartFromBackend();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />

      {/* ----------------------------------------------------
         SIGNATURE COLLECTION — Luxury Split Editorial Layout
      ----------------------------------------------------- */}
      <Link to="/collection/signature" className="block">
        <section className="relative w-full h-[40vh] desktop:h-screen flex flex-row">
          {/* mobile top line */}
          <div className="desktop:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />

          {/* LEFT — IMAGE */}
          <div className="w-1/2 h-full relative group">
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757309457/signature-collection-main_m0xi89.webp"
              alt="Signature Collection"
              className="w-full h-full object-cover transition-opacity custom-fade custom-fade-mobile group-hover:opacity-0"
              quality="auto"
              format="auto"
              crop="scale"
              loading="eager"
            />

            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757273498/signature-collection-hover_yxltpy.webp"
              alt="Signature Collection Hover"
              className="w-full h-full absolute inset-0 object-cover opacity-0 transition-opacity custom-fade custom-fade-mobile group-hover:opacity-100"
              quality="auto"
              format="auto"
              crop="scale"
              loading="lazy"
            />
          </div>

          {/* RIGHT — SPLIT TEXT */}
          <div className="w-1/2 h-full relative flex items-center justify-center">
            <div className="relative z-10 mt-8 desktop:mt-0 px-4 desktop:px-0">
              <div className="
                split-title font-playfair tracking-tightness
                text-split-mobile sm:text-split-tablet desktop:text-split-desktop
                font-medium text-right leading-tight desktop:leading-none text-black
              ">
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

          {/* mobile bottom line */}
          <div className="desktop:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </section>
      </Link>

      {/* ----------------------------------------------------
         BRIDAL COUTURE — Hero with Playfair headline
      ----------------------------------------------------- */}
      <Link to="/collection/bridal" className="block">
        <section className="relative w-full h-[60vh] desktop:h-screen">
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757414519/img7.1_fgqnvb.jpg"
              alt="Bridal Couture Collection"
              imgClassName="object-[center_top] custom-object-pos"
              className="w-full h-full"
              quality="auto"
              format="auto"
              loading="lazy"
            />

            <div className="absolute bottom-8 desktop:bottom-16 left-0 right-0 text-center px-4 w-fit mx-auto">
              <h2
                className="
                  font-playfair uppercase text-white
                  text-hero-mobile sm:text-hero-tablet desktop:text-hero-desktop
                "
              >
                Bridal Couture
              </h2>
            </div>
          </div>

          {/* mobile bottom line */}
          <div className="desktop:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </section>
      </Link>

      {/* ----------------------------------------------------
         CONTEMPORARY DRAPES — Split text left, hover image right
      ----------------------------------------------------- */}
      <Link to="/collection/contemporary" className="block">
        <section className="relative w-full h-[40vh] desktop:h-screen flex flex-row">
          {/* LEFT — SPLIT TEXT */}
          <div className="w-1/2 h-full relative flex items-center justify-center desktop:justify-start desktop:pl-32">
            <div className="relative z-10 mt-8 desktop:mt-0 px-4 desktop:px-0">
              <div className="
                split-title font-playfair text-black
                text-split-mobile sm:text-split-tablet desktop:text-split-desktop
                leading-tight desktop:leading-none tracking-tightness
              ">
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

          {/* RIGHT — IMAGE WITH HOVER */}
          <div className="w-1/2 h-full relative group">
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757410412/sec4-img3_qnh5ns.png"
              alt="Contemporary Drapes"
              className="w-full h-full object-cover object-top transition-opacity custom-fade custom-fade-mobile group-hover:opacity-0"
              quality="auto"
              format="auto"
              crop="scale"
              loading="lazy"
            />
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757411073/sec4-img4_gj1qge.webp"
              alt="Contemporary Drapes Hover"
              className="w-full h-full object-cover object-top absolute inset-0 opacity-0 transition-opacity custom-fade custom-fade-mobile group-hover:opacity-100"
              quality="auto"
              format="auto"
              crop="scale"
              loading="lazy"
            />
          </div>

          {/* mobile bottom line */}
          <div className="desktop:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </section>
      </Link>

      {/* ----------------------------------------------------
         LUXURY FUSION LOUNGE — Hero layout
      ----------------------------------------------------- */}
      <Link to="/collection/luxury" className="block group">
        <section className="relative w-full h-[60vh] desktop:h-screen overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <CloudinaryImage
              cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757411708/img8.1_cbwkx6.jpg"
              alt="Luxury Fusion Lounge"
              imgClassName="object-[center_top] custom-object-pos"
              className="w-full h-full"
              quality="auto"
              format="auto"
              loading="lazy"
            />

            <div className="absolute bottom-8 desktop:bottom-16 text-center px-4 w-fit mx-auto left-0 right-0">
              <h2
                className="
                  font-playfair uppercase text-white
                  text-hero-mobile sm:text-hero-tablet desktop:text-hero-desktop
                "
              >
                Luxury Fusion Lounge
              </h2>
            </div>
          </div>
        </section>
      </Link>

      {/* ----------------------------------------------------
         STORE SECTION
      ----------------------------------------------------- */}
      <section className="relative w-full">
        <div className="text-center py-6 md:py-10 px-4">
          <h2 className="uppercase font-jost text-section-mobile md:text-section-desktop text-black">
            OUR STORE
          </h2>
        </div>

        <div className="relative w-full h-[60vh] desktop:h-screen">
          <CloudinaryImage
            cloudinaryUrl="https://res.cloudinary.com/djhnxxllr/image/upload/v1757412649/storefront_fzas9n.png"
            alt="Our Store"
            className="w-full h-full object-cover"
            quality="auto"
            format="auto"
            crop="scale"
            loading="lazy"
          />

          <div className="absolute bottom-8 desktop:bottom-16 left-1/2 -translate-x-1/2 text-center px-2 desktop:px-12 w-[95%]">
            <p className="text-base sm:text-lg md:text-xl desktop:text-2xl font-normal font-jost  whitespace-normal break-words text-white">
              HIGH STREET PIX, 22 - 25, Wonderland, Lower Ground Floor, 7 M.G. Road, Camp, Pune - 411001 Maharashtra, India
            </p>
            <p className="text-base sm:text-lg md:text-xl desktop:text-2xl font-normal mt-3 leading-none font-jost text-white">
              7 Days Open | 11AM - 7PM | Contact : 020 - 41207311
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
