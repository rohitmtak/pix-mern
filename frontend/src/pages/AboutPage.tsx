import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const AboutPage = () => {
  const carouselImages = [
    "https://res.cloudinary.com/djhnxxllr/image/upload/v1757326525/about-insta4_f42e8h.webp",
    "https://res.cloudinary.com/djhnxxllr/image/upload/v1757326524/about-insta2_h5axmf.webp",
    "https://res.cloudinary.com/djhnxxllr/image/upload/v1757326524/about-insta1_wommjl.webp",
    "https://res.cloudinary.com/djhnxxllr/image/upload/v1757326524/about-insta3_dt4led.webp",
    "https://res.cloudinary.com/djhnxxllr/image/upload/v1757326801/about-insta5_wkhmz8.jpg",
    "https://res.cloudinary.com/djhnxxllr/image/upload/v1757327011/contemporary-drapes-main_fn54am.webp",
  ];

  const handleImageClick = () => {
    window.open("https://www.instagram.com/highstreetpix", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* MAIN CONTENT WRAPPER */}
      <main className="pt-40 px-4 sm:px-8 lg:px-16 pb-16">
        <div className="max-w-screen-2xl mx-auto">

          {/* ===========================
              ABOUT HERO SECTION
          ============================ */}
          <section className="mb-28">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20 items-center">
              
              {/* TEXT LEFT */}
              <div className="xl:max-w-lg space-y-6 order-2 xl:order-1">
                <h1 className="font-playfair text-4xl sm:text-5xl desktop:text-6xl text-black tracking-tightness leading-tight">
                  ABOUT US
                </h1>

                <p className="font-jost text-gray-700 text-base sm:text-lg leading-relaxed">
                  PIX is the iconic brand born from one woman's extraordinary vision to revive 
                  contemporary fashion with timeless elegance. Founded with a deep passion for design 
                  and cultural appreciation, the brand helps bring sophisticated style to global prominence.
                </p>

                <p className="font-jost text-gray-700 text-base sm:text-lg leading-relaxed">
                  With a deep respect for craftsmanship and a passion for innovation, PIX creates a bridge 
                  between traditional elegance and modern aesthetics, introducing rich design traditions 
                  to the world and empowering generations of fashion enthusiasts in the process.
                </p>
              </div>

              {/* IMAGE RIGHT */}
              <div className="relative order-1 xl:order-2">
                <img
                  src="https://res.cloudinary.com/djhnxxllr/image/upload/v1757334101/Designer-Portrait_qivuar.jpg"
                  alt="Designer Portrait"
                  className="w-full h-[350px] sm:h-[450px] desktop:h-[700px] object-cover object-center"
                />
              </div>

            </div>
          </section>

          {/* ===========================
              QUOTE
          ============================ */}
          <section className="text-center mb-28">
            <blockquote className="font-playfair text-xl sm:text-2xl desktop:text-3xl leading-relaxed text-black max-w-3xl mx-auto px-4">
              “Indo-contemporary luxury is not just fashion, it's a cultural narrative.”
            </blockquote>
          </section>

          {/* ===========================
              THE CRAFT SECTION
          ============================ */}
          <section className="mb-28">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20 items-center">

              {/* IMAGE LEFT */}
              <div>
                <img
                  src="https://res.cloudinary.com/djhnxxllr/image/upload/v1757330212/fashionable-clothes-london-boutique-store_kzbbsy.jpg"
                  alt="The Craft"
                  className="w-full h-[350px] sm:h-[450px] desktop:h-[600px] object-cover object-center"
                />
              </div>

              {/* TEXT RIGHT */}
              <div className="xl:max-w-xl space-y-6">
                <h2 className="font-playfair text-4xl sm:text-5xl desktop:text-6xl text-black tracking-tightness leading-tight">
                  THE CRAFT
                </h2>

                <p className="font-jost text-gray-700 text-base sm:text-lg leading-relaxed">
                  PIX is dedicated to craftsmanship, standing as a leading producer of handcrafted 
                  contemporary fashion. Our vertically integrated process encompasses design conception, 
                  fabric selection, pattern creation, and meticulous finishing.
                </p>

                <p className="font-jost text-gray-700 text-base sm:text-lg leading-relaxed">
                  Every piece reflects uncompromising quality, mastery, passion, and precision. Our artisans 
                  preserve and evolve a storied tradition, ensuring each garment tells a story of exceptional 
                  craftsmanship and contemporary elegance.
                </p>
              </div>

            </div>
          </section>

          {/* ===========================
              LARGE BANNER
          ============================ */}
          <section className="mb-16 sm:mb-20 md:mb-24 lg:mb-28 relative">
            <img
              src="https://res.cloudinary.com/djhnxxllr/image/upload/v1757327796/bridal-couture-main_t6qdn0.jpg"
              alt="Elegance Redefined"
              className="w-full h-[450px] sm:h-[600px] desktop:h-[90vh] object-cover object-center"
            />

            {/* TEXT OVERLAY */}
            <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-12 sm:pb-16 desktop:pb-20">
              <div className="text-center text-white px-4">
                <h3 className="font-playfair text-3xl sm:text-4xl desktop:text-5xl tracking-tightness mb-8">
                  ELEGANCE REDEFINED
                </h3>
                <p className="font-jost text-base sm:text-lg desktop:text-xl">
                  Where Tradition Meets Contemporary
                </p>
              </div>
            </div>
          </section>

          {/* ===========================
              DIVIDER LINE
          ============================ */}
          <section className="mb-10 sm:mb-14 md:mb-16 lg:mb-20">
            <div className="w-full h-px bg-gray-300"></div>
          </section>

          {/* ===========================
              INSTAGRAM CAROUSEL
          ============================ */}
          <section className="mb-24 -mx-4 sm:-mx-8 desktop:-mx-24 overflow-hidden">

            <div className="px-4 sm:px-8 desktop:px-24 mb-10">
              <h3 className="text-center font-playfair text-xl sm:text-2xl desktop:text-3xl text-black tracking-tightness">
                Follow Our Journey on Instagram
              </h3>
            </div>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={4}
              slidesPerView={3}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1367: { slidesPerView: 3 },
              }}
            >
              {carouselImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <div
                    onClick={handleImageClick}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={img}
                      className="w-full h-[450px] sm:h-[350px] desktop:h-[450px] object-cover transition-all duration-300 object-top group-hover:brightness-75"
                      alt={`Instagram ${index + 1}`}
                    />

                    {/* INSTAGRAM ICON OVERLAY */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <a
                          href="https://www.instagram.com/highstreetpix"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open Instagram"
                          className="bg-white rounded-full p-3 shadow-lg inline-flex items-center justify-center"
                        >
                          <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      </div>
                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
