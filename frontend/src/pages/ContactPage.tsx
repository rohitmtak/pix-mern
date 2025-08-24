import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-36 px-16 py-12">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-8 uppercase font-jost">
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
                    123 Fashion Street<br />
                    Style District<br />
                    New York, NY 10001
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Phone</h3>
                  <p className="text-gray-700">+1 (555) 123-4567</p>
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
                  className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors duration-200 font-jost uppercase"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
