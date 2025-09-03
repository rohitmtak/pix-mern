const Footer = () => {
  // Data structure for navigation links
  const navigationData = [
    {
      title: "ACCOUNT",
      links: ["My Account"]
    },
    {
      title: "BRAND", 
      links: ["About", "Press", "Careers"]
    },
    {
      title: "SUPPORT",
      links: ["FAQs", "Contact", "Find A Store"]
    }
  ];

  // Social media icons data
  const socialIcons = [
    {
      name: "Facebook",
      path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    },
    {
      name: "Instagram", 
      path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"
    },
    {
      name: "YouTube",
      path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    }
  ];

  // Contact information data
  const contactInfo = [
    {
      icon: "M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z",
      text: "info@highstreetpix.com"
    },
    {
      icon: "M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z",
      text: "+91 9812345678"
    }
  ];

  // Reusable components
  const NavigationColumn = ({ title, links }) => (
    <div className="space-y-6">
      <div className="relative">
        <h3 className="text-xl font-normal uppercase mb-2">
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        {links.map((link, index) => (
          <a 
            key={index}
            href="#" 
            className="block text-base font-normal hover:text-gray-300 transition-colors"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );

  const SocialIcon = ({ path, name }) => (
    <a href="#" className="text-white hover:text-gray-300 transition-colors">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  );

  const ContactItem = ({ icon, text }) => (
    <div className="flex items-center space-x-2">
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d={icon} />
      </svg>
      <span className="text-base font-normal">{text}</span>
    </div>
  );

  return (
    <footer className="w-full py-16 px-16 font-jost"
      style={{
        backgroundColor: 'rgba(13,13,13,1)'
      }}
    >
      <div className="max-w-screen-2xl mx-auto text-white">
        {/* Top Section */}
        <div className="grid grid-cols-5 gap-16 mb-12">
          {/* Logo Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <img 
                src="/images/pix-golden-logo.png" 
                alt="Pix Logo" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <SocialIcon key={index} path={social.path} name={social.name} />
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {navigationData.map((section, index) => (
            <NavigationColumn 
              key={index}
              title={section.title} 
              links={section.links} 
            />
          ))}

          {/* Contact Details Section */}
          <div className="space-y-6">
            <div className="relative">
              <h3 className="text-xl font-normal uppercase mb-2">
                CONTACT
              </h3>
            </div>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <ContactItem 
                  key={index}
                  icon={contact.icon} 
                  text={contact.text} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex justify-between items-center">
            {/* Branding */}
            <div className="text-white font-bold text-xl">
              Pix
            </div>

            {/* Legal Information */}
            <div className="flex space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span>© 2025 Pix</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
