import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "New Arrivals", href: "/products?new=true" },
        { name: "Best Sellers", href: "/products?featured=true" },
        { name: "Sale", href: "/products?sale=true" },
        { name: "Gift Cards", href: "/gift-cards" }
      ]
    },
    {
      title: "Customer Care",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Size Guide", href: "/size-guide" },
        { name: "Shipping & Returns", href: "/shipping" },
        { name: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Sustainability", href: "/sustainability" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Instagram", icon: "Instagram", href: "#" },
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "Pinterest", icon: "Pinterest", href: "#" }
  ];

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-gray-700">
          <div className="text-center space-y-4">
            <h3 className="font-display text-2xl font-semibold">
              Stay in the loop
            </h3>
            <p className="text-gray-300 max-w-md mx-auto">
              Subscribe to our newsletter for exclusive offers and the latest fashion updates.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-accent to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-accent transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-yellow-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-xl font-bold">
                  Vogue Threads
                </span>
              </Link>
              <p className="text-gray-300 text-sm">
                Curating timeless fashion pieces that blend elegance with modern style.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-accent transition-colors duration-200"
                  >
                    <ApperIcon name={social.icon} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="font-display font-semibold text-white">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-accent transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © 2024 Vogue Threads. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-accent text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-accent text-sm transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;