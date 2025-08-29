import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-36 px-16 py-12">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-4xl text-black mb-8 uppercase font-jost">
            Contact Us
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
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

            {/* Contact Form */}
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
          
          {/* Map Section */}
          <div className="mt-16">
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
              ></iframe>
              
              {/* Address Overlay */}
              <div className="absolute top-4 left-4 bg-white p-4 shadow-lg max-w-xs">
                <h3 className="font-semibold text-black mb-2">HIGH STREET PIX</h3>
                <p className="text-sm text-gray-700 mb-3">
                  22 - 25, Wonderland, Lower Ground Floor,<br />
                  7 M.G. Road, Camp,<br />
                  Pune - 411001 Maharashtra
                </p>
              </div>
              
              {/* Centered Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => window.open('https://maps.google.com/?q=7+M.G.+Road,+Camp,+Pune,+Maharashtra+411001', '_blank')}
                  className="bg-white text-black py-3 px-6 shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-jost uppercase text-sm font-medium"
                >
                  Click to open in Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
