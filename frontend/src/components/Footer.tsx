import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  // Accordion state management
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Accordion sections data
  const accordionSections = [
    {
      id: 'explore',
      title: 'EXPLORE',
      links: [
        { name: "Signature Collection", path: "/collection/signature" },
        { name: "Bridal Couture", path: "/collection/bridal" },
        { name: "Contemporary Drapes", path: "/collection/contemporary" },
        { name: "Luxury Fusion Lounge", path: "/collection/luxury" }
      ]
    },
    {
      id: 'account',
      title: 'ACCOUNT',
      links: [
        { name: "My Account", path: "/profile" },
        { name: "Wishlist", path: "/wishlist" },
        { name: "Order History", path: "/orders" }
      ]
    },
    {
      id: 'brand',
      title: 'BRAND',
      links: [
        { name: "About", path: "/about" },
        { name: "Press", path: "/press" },
        { name: "Careers", path: "/careers" }
      ]
    },
    {
      id: 'support',
      title: 'SUPPORT',
      links: [
        { name: "FAQs", path: "/faq" },
        { name: "Contact", path: "/contact" },
        { name: "Find A Store", path: "/stores" }
      ]
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

  const ContactItem = ({ icon, text }) => (
    <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d={icon} />
      </svg>
      <span className="text-sm font-normal">{text}</span>
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

  return (
    <footer className="w-full bg-black pt-8 pb-8 px-8 md:px-16 font-jost">
      <div className="max-w-screen-2xl mx-auto text-white">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Brand Section */}
          <div className="text-center mb-8">
            <img
              src="/images/pix-golden-logo.png"
              alt="High Street Pix Logo"
              className="h-16 w-auto mx-auto mb-4"
            />
            <h2 className="text-xl font-light text-white mb-2">
              High Street Pix
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              Celebrating the artistry of traditional Indian drapes with contemporary elegance.
            </p>
          </div>

          {/* Accordion Sections */}
          <div className="max-w-sm mx-auto mb-6">
            {accordionSections.map((section, index) => (
              <div key={section.id} className="border-b border-gray-800">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                    {section.title}
                  </h3>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      expandedSections[section.id] ? 'rotate-45' : ''
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {expandedSections[section.id] && (
                  <div className="pb-4 space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        to={link.path}
                        className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="max-w-sm mx-auto mb-6">
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

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Main Footer Content */}
          <div className="flex flex-row gap-16 mb-12">
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
              <div className="grid grid-cols-6 gap-6">
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
                {accordionSections.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          to={link.path}
                          className="block text-xs font-normal text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
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
                    {/* <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-300 mb-2">
                      Follow Us
                    </h4> */}
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
        </div>

        {/* Mobile Bottom Section */}
        <div className="block lg:hidden">
          <div className="border-t border-gray-800 pt-6">
            <div className="text-center">
              {/* Social Icons */}
              <div className="flex justify-center space-x-4 mb-6">
                {socialIcons.map((social, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {social.name === "Instagram" ? (
                        <path fillRule="evenodd" clipRule="evenodd" d={social.path} fill="currentColor" />
                      ) : (
                        <path d={social.path} />
                      )}
                    </svg>
                  </a>
                ))}
              </div>
              
              {/* Legal Information */}
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-center space-x-4">
                  <Link to="/terms" className="hover:text-white transition-colors duration-200">
                    Terms & Conditions
                  </Link>
                  <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </div>
                <div className="text-xs">
                  © 2025 High Street Pix. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom Section */}
        <div className="hidden lg:block">
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
      </div>
    </footer>
  );
};

export default Footer;
