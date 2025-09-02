import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-40 px-16 py-12">
        <div className="max-w-screen-2xl mx-auto">
          {/* Original code commented out */}
          {/* 
          <h1 className="text-4xl text-black mb-8 uppercase font-jost">
            Contact Us
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-black mb-6 font-jost">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-2">Address</h3>
                  <p className="text-gray-700">
                    HIGH STREET PIX, 22 - 25, Wonderland, Lower Ground Floor,<br />
                    7 M.G. Road, Camp,<br />
                    Pune - 411001 Maharashtra
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Phone</h3>
                  <p className="text-gray-700">+91 9812345678</p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Email</h3>
                  <p className="text-gray-700">info@highstreetpix.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Hours</h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-black mb-6 font-jost">
                Send us a Message
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Message subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors duration-200 font-jost uppercase"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
          */}

          {/* New design matching the image layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 max-w-screen-lg mx-auto">
            {/* Left Column - Contact Information */}
            <div className="space-y-10">
              {/* Get in Touch Section */}
              <div>
                <h2 className="text-5xl text-black mb-10 font-jost uppercase tracking-wide">
                  Get in Touch
                  <br />
                  with Us
                </h2>
                <div className="space-y-1">
                  <div className="flex items-center space-x-4">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-700">info@highstreetpix.com</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-gray-700">+91 9812345678</span>
                  </div>
                </div>
              </div>

              <div className="w-full border-b-[1px] border-b-[#dddddd]"></div>

              {/* Speak to Our CEO Section */}
              <div>
                <h3 className="text-xl font-medium text-black mb-4 font-jost">
                  Visit Our Store
                </h3>
                {/* <p className="text-gray-700 mb-4 leading-relaxed">
                  Every High Street PIX experience tells a story, and yours is important to us.
                </p> */}
                <p className="text-gray-700">
                  HIGH STREET PIX, 22 - 25, Wonderland, Lower Ground Floor,<br />
                  7 M.G. Road, Camp,<br />
                  Pune - 411001, Maharashtra
                </p>
                {/* <p className="text-gray-700 text-sm">
                  Personal response within 48 hours
                </p> */}
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors duration-200"
                    placeholder="Name*"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors duration-200"
                    placeholder="Email address*"
                  />
                </div>
                <div className="flex">
                  <div className="flex items-center px-4 py-3 border border-gray-300 border-r-0 bg-gray-50">
                    <span className="text-gray-700">+91</span>
                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    className="flex-1 px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors duration-200"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors duration-200 resize-none"
                    placeholder="Message*"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-6 hover:bg-gray-700 transition-colors duration-200 font-jost uppercase tracking-wide font-medium"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          <div>
            <img src="/images/contact.webp" alt="Contact Map" className="w-full h-full mt-24" />
          </div>

          {/* Visit Us Section - matching the image layout */}
          <div className="mt-24 flex flex-col lg:flex-row gap-0">
            {/* Left Section - Store Interior (40% width) */}
            <div className="lg:w-1/2">
              <img 
                src="/images/contact2.webp" 
                alt="Store Interior" 
                className="w-full object-cover"
              />
            </div>

            {/* Right Section - Text Content (60% width) */}
            <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16">
              <div className="max-w-md">
                <h2 className="text-4xl lg:text-5xl text-black mb-6 font-jost uppercase tracking-wide">
                  Visit Us
                </h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  Visit our stores and experience the artistry of design, the richness of materials, and the exceptional service that define the High Street PIX world.
                </p>
                <button 
                  onClick={() => window.open('https://maps.google.com/?q=7+M.G.+Road,+Camp,+Pune,+Maharashtra+411001', '_blank')}
                  className="text-black underline hover:text-gray-700 transition-colors duration-200 font-jost uppercase tracking-wide text-sm"
                >
                  See Our Location
                </button>
              </div>
            </div>
          </div>

          {/* Map Section */}
          {/* <div className="mt-16">
            <h2 className="text-2xl font-semibold text-black mb-6 font-jost">
              Find Us
            </h2>
            <div className="w-full h-[500px] bg-gray-200 overflow-hidden relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265481439!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjQiTiA3M8KwNTEnMjQuMSJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HIGH STREET PIX Location"
                className="transition-all duration-300 group-hover:brightness-75"
              ></iframe> */}

              {/* Address Overlay */}
              {/* <div className="absolute top-4 left-4 bg-white p-4 shadow-lg max-w-xs">
                <h3 className="font-semibold text-black mb-2">HIGH STREET PIX</h3>
                <p className="text-sm text-gray-700 mb-3">
                  22 - 25, Wonderland, Lower Ground Floor,<br />
                  7 M.G. Road, Camp,<br />
                  Pune - 411001 Maharashtra
                </p>
              </div> */}

              {/* Centered Button Overlay */}
              {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => window.open('https://maps.google.com/?q=7+M.G.+Road,+Camp,+Pune,+Maharashtra+411001', '_blank')}
                  className="bg-white text-black py-3 px-6 shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-jost uppercase text-sm font-medium"
                >
                  Click to open in Google Maps
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
