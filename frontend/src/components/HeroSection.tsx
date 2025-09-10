const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover md:object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        {/* <source 
          src="https://res.cloudinary.com/djhnxxllr/video/upload/v1757268595/hero-video_n2jjtq.webm" 
          type="video/webm" 
        /> */}
        <source 
          src="https://res.cloudinary.com/djhnxxllr/video/upload/q_auto:low,f_webm,w_auto,c_limit,h_auto,dpr_auto/v1757268595/hero-video_n2jjtq.webm" 
          type="video/webm" 
/>
        Your browser does not support the video tag.
      </video>
      
      {/* Optional overlay for better text readability - adjusted for mobile */}
      <div className="absolute inset-0 bg-black bg-opacity-20 md:bg-opacity-30" />
      
      {/* Content overlay - add your hero content here */}
      {/* <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Pix
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Your compelling message here
          </p>
        </div>
      </div> */}
    </section>
  );
};

export default HeroSection;
