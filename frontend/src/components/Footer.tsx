const Footer = () => {
  return (
    <footer className="w-full py-16 px-16 font-jost"
      style={{
        backgroundColor: 'rgba(13,13,13,1)'
      }}
    >
      <div className="max-w-screen-2xl mx-auto text-white">
        <div className="grid grid-cols-4 gap-16">
          {/* Explore Highstreet Pix Column */}
          <div className="space-y-6">
            <div className="relative">
              <h3
                className="text-xl font-normal uppercase mb-2"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Explore Highstreet Pix
              </h3>
              <div className="w-20 h-0.5 bg-white" />
            </div>
            <div className="space-y-4">
              <a
                href="#"
                className="block text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Bridal Couture:
              </a>
              <a
                href="#"
                className="block text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Signature Collection:
              </a>
              <a
                href="#"
                className="block text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Luxury Fusion Lounge:
              </a>
              <a
                href="#"
                className="block text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Contemporary Drapes:
              </a>
            </div>
          </div>

          {/* Policy Column */}
          <div className="space-y-6">
            <div className="relative">
              <h3
                className="text-xl font-normal uppercase mb-2"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Policy
              </h3>
              <div className="w-20 h-0.5 bg-white" />
            </div>
            <div className="space-y-4">
              <p
                className="text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Terms of use:
              </p>
              <p
                className="text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Privacy Policy:
              </p>
              <p
                className="text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Return & cancellation:
              </p>
              <p
                className="text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Orders - Shipping - Dilvery:
              </p>
            </div>
          </div>

          {/* More About Pix Column */}
          <div className="space-y-6">
            <div className="relative">
              <h3
                className="text-xl font-normal uppercase mb-2"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                More About Pix
              </h3>
              <div className="w-20 h-0.5 bg-white" />
            </div>
            <div className="space-y-4">
              <p
                className="text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Carrers:
              </p>
              <p
                className="text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Locate Us:
              </p>
              <p
                className="text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Company Profile:
              </p>
            </div>
          </div>

          {/* Customer Support Column */}
          <div className="space-y-6">
            <div className="relative">
              <h3
                className="text-xl font-normal uppercase mb-2"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Customer Support
              </h3>
              <div className="w-20 h-0.5 bg-white" />
            </div>
            <div className="space-y-4">
              <p
                className="text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Call:
              </p>
              <p
                className="text-base font-normal"
                style={{
                  // fontFamily:
                  //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Address:
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
