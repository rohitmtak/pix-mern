import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

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
    window.open("https://www.instagram.com/highstreetpix", "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-36 px-4 sm:px-8 lg:px-16 py-8 sm:py-12">
        <div className="max-w-screen-2xl mx-auto">
          {/* First Section - About Us Hero */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              {/* Text Content */}
              <div className="space-y-4 sm:space-y-6 max-w-lg">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-black leading-tight">
                  ABOUT US
                </h1>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                    PIX is the iconic brand born from one woman's extraordinary vision to revive contemporary fashion with timeless elegance. Founded with a deep passion for design and cultural appreciation, the brand helps bring sophisticated style to global prominence.
                  </p>
                  <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                    With a deep respect for craftsmanship and a passion for innovation, PIX creates a bridge between traditional elegance and modern aesthetics, introducing rich design traditions to the world and empowering generations of fashion enthusiasts in the process.
                  </p>
                </div>
              </div>
              
              {/* Image */}
              <div className="relative">
                <img 
                  src="https://res.cloudinary.com/djhnxxllr/image/upload/v1757334101/Designer-Portrait_qivuar.jpg" 
                  alt="Founder portrait" 
                  className="w-full h-[300px] sm:h-[400px] lg:h-[calc(100vh-48px)] object-cover object-center"
                />
              </div>
            </div>
          </section>

          {/* Quote Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center max-w-4xl mx-auto py-8 sm:py-12 lg:py-8">
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif text-black leading-relaxed mb-6 px-4">
                "Indo-contemporary luxury is not just fashion, it's a cultural narrative."
              </blockquote>
              {/* <cite className="text-lg font-sans font-medium text-black uppercase tracking-wide">
                PIX
              </cite> */}
            </div>
          </section>

          {/* The Craft Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              {/* Image */}
              <div className="relative order-1 lg:order-1">
                <img 
                  src="https://res.cloudinary.com/djhnxxllr/image/upload/v1757330212/fashionable-clothes-london-boutique-store_kzbbsy.jpg" 
                  alt="Craftsmanship in action" 
                  className="w-full h-[300px] sm:h-[400px] lg:h-[600px] object-cover object-center"
                />
              </div>
              
              {/* Text Content */}
              <div className="space-y-4 sm:space-y-6 order-2 lg:order-2 max-w-lg">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-black leading-tight">
                  THE CRAFT
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                    PIX is dedicated to craftsmanship, standing as a leading producer of handcrafted contemporary fashion. Our vertically integrated process encompasses design conception, fabric selection, pattern creation, and meticulous finishing.
                  </p>
                  <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                    Every piece reflects uncompromising quality, mastery, passion, and precision. Our artisans preserve and evolve a storied tradition, ensuring each garment tells a story of exceptional craftsmanship and contemporary elegance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Banner Image Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="relative">
              <img 
                src="https://res.cloudinary.com/djhnxxllr/image/upload/v1757327796/bridal-couture-main_t6qdn0.jpg" 
                alt="PIX brand story" 
                className="w-full h-[400px] sm:h-[500px] lg:h-screen object-cover object-center"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center pb-8 sm:pb-12 lg:pb-16">
                <div className="text-center text-white px-4">
                  <h3 className="text-2xl sm:text-3xl lg:text-5xl font-serif mb-2 sm:mb-4">ELEGANCE REDEFINED</h3>
                  <p className="text-base sm:text-lg lg:text-xl font-sans">Where Tradition Meets Contemporary</p>
                </div>
              </div>
            </div>
          </section>

          {/* Border Separator */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="w-full h-px bg-gray-300"></div>
          </section>

          {/* Instagram Carousel Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20 -mx-4 sm:-mx-8 lg:-mx-16 overflow-hidden">
            {/* Instagram Header */}
            <div className="px-4 sm:px-8 lg:px-16 mb-8 sm:mb-12 lg:mb-14">
              <div className="flex justify-center">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-gray-800 text-center">Follow Our Journey on Instagram</h3>
              </div>
            </div>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={4}
              slidesPerView={3}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 0,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 4,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 4,
                },
              }}
              className="!overflow-hidden"
            >
              {carouselImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative group cursor-pointer" onClick={handleImageClick}>
                    <img
                      src={image}
                      alt={`Instagram post ${index + 1}`}
                      className="w-full h-[250px] sm:h-[350px] lg:h-[436px] object-cover object-top transition-all duration-300 group-hover:brightness-75"
                    />
                    {/* Instagram Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white rounded-full p-3 shadow-lg">
                          <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </div>
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
