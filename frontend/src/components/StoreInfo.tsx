const StoreInfo = () => {
  return (
    <section className="relative w-full">
      {/* Store Title */}
      <div className="text-center py-6 md:py-10 px-4">
        <h2
          className="text-2xl md:text-4xl font-bold uppercase text-black font-jost"
          style={{
            // fontFamily:
            //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
            lineHeight: "clamp(2rem, 6vw, 96px)",
          }}
        >
          OUR STORE
        </h2>
      </div>

      {/* Store Image with Address Overlay */}
      <div className="relative w-full h-screen">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3eedf065cf24f597f94f56c610073d7213656c5b?width=3840"
          alt="Our Store"
          className="w-full h-full object-cover"
        />

        {/* Address Overlay */}
        <div className="absolute bottom-8 md:bottom-16 left-1/2 transform -translate-x-1/2 text-center px-4">
          <div className="text-white">
            <p
              className="text-sm md:text-xl font-normal font-jost leading-relaxed md:whitespace-nowrap"
              style={{
                // fontFamily:
                //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                lineHeight: "clamp(1.5rem, 4vw, 50px)",
              }}
            >
              HIGH STREET PIX, 22 - 25, Wonderland, Lower Ground Floor, 7 M.G.
              Road, Camp, Pune - 411001 Maharashtra, India
            </p>
            <p
              className="text-sm md:text-xl font-normal mt-2 md:mt-0 mb-0 leading-none font-jost"
              style={{
                // fontFamily:
                //   "Helvetica, -apple-system, Roboto, Helvetica, sans-serif",
                lineHeight: "clamp(1.25rem, 3vw, 25px)",
                margin: 0,
                padding: 0,
              }}
            >
              7 Days Open | 11AM - 7PM | Contact : 020 - 41207311
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreInfo;
