const Footer = () => {
  // Data structure for navigation links
  const navigationData = [
    {
      title: "EXPLORE",
      links: ["Signature Collection", "Bridal Couture", "Contemporary Drapes", "Luxury Fusion Lounge"]
    },
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
      path: "M3 12C3 8.40486 3 6.60729 3.85669 5.31255C4.23925 4.73439 4.73439 4.23925 5.31255 3.85669C6.60729 3 8.40486 3 12 3C15.5951 3 17.3927 3 18.6874 3.85669C19.2656 4.23925 19.7608 4.73439 20.1433 5.31255C21 6.60729 21 8.40486 21 12C21 15.5951 21 17.3927 20.1433 18.6874C19.7608 19.2656 19.2656 19.7608 18.6874 20.1433C17.3927 21 15.5951 21 12 21C8.40486 21 6.60729 21 5.31255 20.1433C4.73439 19.7608 4.23925 19.2656 3.85669 18.6874C3 17.3927 3 15.5951 3 12ZM11.9998 15.0832C13.7025 15.0832 15.0828 13.7029 15.0828 12.0002C15.0828 10.2975 13.7025 8.91722 11.9998 8.91722C10.2971 8.91722 8.91684 10.2975 8.91684 12.0002C8.91684 13.7029 10.2971 15.0832 11.9998 15.0832ZM16.6593 12.0002C16.6593 14.5735 14.5732 16.6596 11.9998 16.6596C9.42652 16.6596 7.34043 14.5735 7.34043 12.0002C7.34043 9.42691 9.42652 7.34082 11.9998 7.34082C14.5732 7.34082 16.6593 9.42691 16.6593 12.0002ZM16.8433 8.20155C17.4479 8.20155 17.9381 7.71138 17.9381 7.10673C17.9381 6.50207 17.4479 6.0119 16.8433 6.0119C16.2386 6.0119 15.7485 6.50207 15.7485 7.10673C15.7485 7.71138 16.2386 8.20155 16.8433 8.20155Z"
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
    <div className="space-y-5">
      <div className="relative">
        <h3 className="text-base font-normal uppercase">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {links.map((link, index) => (
          <a
            key={index}
            href="#"
            className="block text-sm font-normal text-gray-400 hover:text-white transition-colors"
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
    <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d={icon} />
      </svg>
      <span className="text-sm font-normal">{text}</span>
    </div>
  );

  return (
    <footer className="w-full pt-16 pb-12 px-16 font-jost"
      style={{
        backgroundColor: 'rgba(13,13,13,1)'
      }}
    >
      <div className="max-w-screen-2xl mx-auto text-white">
        {/* Top Section */}
        <div className="flex justify-between gap-16 mb-12">
          {/* Logo S24tion */}
          <div className="flex flex-col">
            <div className="space-y-8">
              <div className="space-y-4">
                <img
                  src="/images/pix-golden-logo.png"
                  alt="Pix Logo"
                  className="h-24 w-auto"
                />
              </div>

              {/* Social Icons */}
              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <SocialIcon key={index} path={social.path} name={social.name} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-32">
            {/* Navigation Columns */}
            {navigationData.map((section, index) => (
              <NavigationColumn
                key={index}
                title={section.title}
                links={section.links}
              />
            ))}

            {/* Contact Details Section */}
            <div className="space-y-5">
              <div className="relative">
                <h3 className="text-base font-normal uppercase">
                  CONTACT
                </h3>
              </div>
              <div className="space-y-3">
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
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 pt-6">
          <div className="flex justify-end items-center">
            {/* Branding */}
            {/* <div className="text-white font-bold text-xl">
              Pix
            </div> */}

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
