import { Link } from "react-router-dom";
import { useState } from "react";

interface AccordionSection {
  id: string;
  title: string;
  links: Array<{
    name: string;
    path: string;
  }>;
}

interface ContactInfo {
  icon: string;
  text: string;
}

interface SocialIcon {
  name: string;
  path: string;
}

const Footer = () => {
  // Accordion state management
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Accordion sections data
  const accordionSections: AccordionSection[] = [
    {
      id: 'explore',
      title: 'EXPLORE',
      links: [
        { name: "BRIDAL COUTURE", path: "/bridal" },
        { name: "SIGNATURE COLLECTION", path: "/signature" },
        { name: "LUXURY FUSION LOUNGE", path: "/luxury" },
        { name: "CONTEMPORARY DRAPES", path: "/contemporary" }
      ]
    },
    {
      id: 'brand',
      title: 'BRAND',
      links: [
        { name: "ABOUT US", path: "/about" },
        { name: "COMPANY PROFILE", path: "/faq" },
        { name: "CONTACT US", path: "/contact" },
        { name: "CAREER", path: "/careers" }
      ]
    },
    {
      id: 'legal',
      title: 'LEGAL',
      links: [
        { name: "PRIVACY POLICY", path: "/privacy" },
        { name: "TERMS & CONDITIONS", path: "/terms" },
        { name: "RETURNS & CANCELLATION", path: "/returns" }
      ]
    },
    {
      id: 'contact',
      title: 'CONTACT',
      links: [
        { name: "info@highstreetpix.com", path: "mailto:info@highstreetpix.com" },
        { name: "+91 9812345678", path: "tel:+919812345678" }
      ]
    }
  ];

  // Contact information data
  const contactInfo: ContactInfo[] = [
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
  const socialIcons: SocialIcon[] = [
    {
      name: "Facebook",
      path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    },
    {
      name: "Instagram",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    },
  ];

  const ContactItem = ({ icon, text }: { icon: string; text: string }) => (
    <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d={icon} />
      </svg>
      <span className="text-sm font-normal">{text}</span>
    </div>
  );

  const SocialIcon = ({ path, name }: { path: string; name: string }) => (
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
    <footer className="w-full bg-black pt-16 lg:pt-20 pb-12 px-8 md:px-16 font-jost">
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
              Traditional craftsmanship meets modern innovation in every luxury creation.
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
                      section.id === 'contact' ? (
                        <a
                          key={linkIndex}
                          href={link.path}
                          className="flex items-center space-x-3 text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d={linkIndex === 0 ? 
                              "M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" :
                              "M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                            } />
                          </svg>
                          <span>{link.name}</span>
                        </a>
                      ) : (
                        <Link
                          key={linkIndex}
                          to={link.path}
                          className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>


        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Main Footer Content - Brand and Navigation side by side */}
          <div className="flex gap-16 mb-24">
            {/* Brand Section - Left side */}
            <div className="flex-shrink-0 w-1/4">
              <div className="space-y-6">
                {/* Brand Identity */}
                <div>
                  <h2 className="text-2xl font-normal text-white mb-4">
                    High Street Pix
                  </h2>
                  <p className="text-base text-gray-400 leading-relaxed max-w-md">
                  Traditional craftsmanship meets modern innovation in every luxury creation.
                  </p>
                </div>
                
                {/* Social Media Icons */}
                <div className="flex space-x-3">
                  {socialIcons.map((social, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors duration-200"
                      aria-label={social.name}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        {social.name === "Instagram" ? (
                          <path fillRule="evenodd" clipRule="evenodd" d={social.path} fill="currentColor" />
                        ) : (
                          <path d={social.path} />
                        )}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Sections - Right side */}
            <div className="flex-1">
              <div className="grid grid-cols-4 gap-12">
                {/* EXPLORE Column */}
                <div className="space-y-6">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-white">
                    EXPLORE
                  </h3>
                  <div className="space-y-6">
                    <Link to="/bridal" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      BRIDAL COUTURE       
                    </Link>
                    <Link to="/signature" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      SIGNATURE COLLECTION
                    </Link>
                    <Link to="/luxury" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      LUXURY FUSION LOUNGE
                    </Link>
                    <Link to="/contemporary" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      CONTEMPORARY DRAPES
                    </Link>
                  </div>
                </div>

                {/* BRAND Column */}
                <div className="space-y-6">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-white">
                    BRAND
                  </h3>
                  <div className="space-y-6">
                    <Link to="/about" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      ABOUT US
                    </Link>
                    <Link to="/faq" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      COMPANY PROFILE
                    </Link>
                    <Link to="/contact" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      CONTACT US
                    </Link>
      
                    
                  <Link to="/careers" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      CAREER
                    </Link>
                  </div>
                </div>

                {/* LEGAL Column */}
                <div className="space-y-6">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-white">
                    LEGAL
                  </h3>
                  <div className="space-y-6">
                    <Link to="/privacy" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      PRIVACY POLICY
                    </Link>
                    <Link to="/terms" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      TERMS & CONDITIONS
                    </Link>
                    <Link to="/returns" className="block text-sm font-normal text-gray-400 hover:text-white transition-colors duration-200">
                      RETURNS & CANCELLATION
                    </Link>
                  </div>
                </div>

                {/* CONTACT Column */}
                <div className="space-y-6">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-white">
                    CONTACT
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-sm font-normal">info@highstreetpix.com</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-sm font-normal">+91 9812345678</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Section */}
        <div className="block lg:hidden">
          <div className="pt-8">
            <div className="text-center">
              {/* Social Icons */}
                <div className="flex justify-center space-x-3 mb-6">
                  {socialIcons.map((social, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors duration-200"
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
                </div>
                <div className="text-sm">
                  © 2025 High Street Pix. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom Section */}
        <div className="hidden lg:block">
          <div className="border-t border-gray-800 pt-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">
                2025 © HIGH STREET PIX. ALL RIGHTS RESERVED.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
