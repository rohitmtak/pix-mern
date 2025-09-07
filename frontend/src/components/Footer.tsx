import { Link } from "react-router-dom";

const Footer = () => {
  // Data structure for navigation links
  const navigationData = [
    {
      title: "EXPLORE",
      links: [
        { name: "Signature Collection", path: "/collection/signature" },
        { name: "Bridal Couture", path: "/collection/bridal" },
        { name: "Contemporary Drapes", path: "/collection/contemporary" },
        { name: "Luxury Fusion Lounge", path: "/collection/luxury" }
      ]
    },
    {
      title: "ACCOUNT",
      links: [
        { name: "My Account", path: "/profile" },
        { name: "Wishlist", path: "/wishlist" },
        { name: "Order History", path: "/orders" }
      ]
    },
    {
      title: "BRAND",
      links: [
        { name: "About", path: "/about" },
        { name: "Press", path: "/press" },
        { name: "Careers", path: "/careers" }
      ]
    },
    {
      title: "SUPPORT",
      links: [
        { name: "FAQs", path: "/faq" },
        { name: "Contact", path: "/contact" },
        { name: "Find A Store", path: "/stores" }
      ]
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
      path: "M3 12C3 8.40486 3 6.60729 3.85669 5.31255C4.23925 4.73439 4.73439 4.23925 5.31255 3.85669C6.60729 3 8.40486 3 12 3C15.5951 3 17.3927 3 18.6874 3.85669C19.2656 4.23925 19.7608 4.73439 20.1433 5.31255C21 6.60729 21 8.40486 21 12C21 15.5951 21 17.3927 20.1433 18.6874C19.7608 19.2656 19.2656 19.7608 18.6874 20.1433C17.3927 21 15.5951 21 12 21C8.40486 21 6.60729 21 5.31255 20.1433C4.73439 19.7608 4.23925 19.2656 3.85669 18.6874C3 17.3927 3 15.5951 3 12ZM16.6593 12.0002C16.6593 14.5735 14.5732 16.6596 11.9998 16.6596C9.42652 16.6596 7.34043 14.5735 7.34043 12.0002C7.34043 9.42691 9.42652 7.34082 11.9998 7.34082C14.5732 7.34082 16.6593 9.42691 16.6593 12.0002ZM16.8433 8.20155C17.4479 8.20155 17.9381 7.71138 17.9381 7.10673C17.9381 6.50207 17.4479 6.0119 16.8433 6.0119C16.2386 6.0119 15.7485 6.50207 15.7485 7.10673C15.7485 7.71138 16.2386 8.20155 16.8433 8.20155Z"
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
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
          {title}
        </h3>
      </div>
      <div className="space-y-2">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="block text-xs font-normal text-gray-400 hover:text-white transition-colors duration-200"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );

  const SocialIcon = ({ path, name }) => (
    <a 
      href="#" 
      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center"
      aria-label={name}
    >
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        {name === "Instagram" ? (
          <path fillRule="evenodd" clipRule="evenodd" d={path} fill="currentColor" />
        ) : (
          <path d={path} />
        )}
      </svg>
    </a>
  );

  const ContactItem = ({ icon, text }) => (
    <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d={icon} />
      </svg>
      <span className="text-xs font-normal">{text}</span>
    </div>
  );

  return (
    <footer className="w-full bg-black pt-16 pb-8 px-4 md:px-16 font-jost">
      <div className="max-w-screen-2xl mx-auto text-white">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12">
          {/* Logo Section - Left */}
          <div className="flex-shrink-0">
            <img
              src="/images/pix-golden-logo.png"
              alt="High Street Pix Logo"
              className="h-24 w-auto"
            />
          </div>

          {/* Content Section - Right */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
              {/* Brand Description */}
              <div className="space-y-3">
                <h2 className="text-lg font-light text-white">
                  High Street Pix
                </h2>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Celebrating the artistry of traditional Indian drapes with contemporary elegance.
                </p>
              </div>

              {/* Navigation Columns */}
              {navigationData.map((section, index) => (
                <NavigationColumn
                  key={index}
                  title={section.title}
                  links={section.links}
                />
              ))}

              {/* Contact and Social */}
              <div className="space-y-4">
                {/* Contact */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-3">
                    CONTACT
                  </h3>
                  <div className="space-y-2">
                    {contactInfo.map((contact, index) => (
                      <ContactItem
                        key={index}
                        icon={contact.icon}
                        text={contact.text}
                      />
                    ))}
                  </div>
                </div>

                {/* Social Icons */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-300 mb-2">
                    Follow Us
                  </h4>
                  <div className="flex space-x-2">
                    {socialIcons.map((social, index) => (
                      <SocialIcon key={index} path={social.path} name={social.name} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © 2025 High Street Pix. All rights reserved.
            </div>
            
            {/* Legal Information */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/shipping" className="text-gray-400 hover:text-white transition-colors duration-200">
                Shipping Policy
              </Link>
              <Link to="/returns" className="text-gray-400 hover:text-white transition-colors duration-200">
                Returns & Exchanges
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
