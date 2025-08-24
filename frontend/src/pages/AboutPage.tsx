import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-36 px-16 py-12">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-8 uppercase font-jost">
            About Us
          </h1>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Welcome to our brand story. We are dedicated to creating exceptional fashion experiences that blend contemporary design with timeless elegance.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our collections represent the perfect fusion of traditional craftsmanship and modern aesthetics, designed for those who appreciate quality and style.
            </p>
            <p className="text-lg text-gray-700">
              From our signature collection to luxury fusion loungewear, every piece is carefully curated to reflect our commitment to excellence and innovation in fashion.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
