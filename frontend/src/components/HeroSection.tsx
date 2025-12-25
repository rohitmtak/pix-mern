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
        <source 
          src="https://res.cloudinary.com/djhnxxllr/video/upload/q_auto,f_webm/v1765967092/Banner_Video_01_lvazgi.webm"
          type="video/webm" 
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Optional overlay for better text readability - adjusted for mobile */}
      <div className="absolute inset-0 bg-black bg-opacity-20 md:bg-opacity-30" />
    
    </section>
  );
};

export default HeroSection;
