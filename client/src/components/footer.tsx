import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/Gemini_Generated_Image_bq4jlqbq4jlqbq4j (1)_1755873870848.png";
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Our Services", href: "#loans" },
    { name: "EMI Calculator", href: "#calculator" },
    { name: "DSA Partnership", href: "#dsa" },
    { name: "Contact Us", href: "#contact" },
  ];

  const loanProducts = [
    { name: "Personal Loan", href: "/user" },
    { name: "Business Loan", href: "/user" },
    { name: "Home Loan", href: "/user" },
    { name: "Loan Against Property", href: "/user" },
    { name: "Working Capital Loan", href: "/user" },
  ];

  const portalLinks = [
    { name: "Admin Login", href: "/admin", color: "bg-red-600 hover:bg-red-700" },
    { name: "DSA Login", href: "/dsa", color: "bg-yellow-500 hover:bg-yellow-600 text-black" },
    { name: "User Login", href: "/user", color: "bg-primary hover:bg-blue-700" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Disclaimer", href: "#" },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <footer className="bg-text-dark text-white py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div data-testid="footer-company-info">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={logoPath} alt="JSMF Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Jay Shree Mahakal</h3>
                <p className="text-sm text-gray-400">Finance Service</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Professional finance services in Bhopal providing fast, secure, and reliable loan solutions with competitive interest rates.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleLinkClick(social.href)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                    data-testid={`social-link-${social.label.toLowerCase()}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div data-testid="footer-quick-links">
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                    data-testid={`quick-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Loan Products */}
          <div data-testid="footer-loan-products">
            <h4 className="font-semibold mb-6">Loan Products</h4>
            <ul className="space-y-3">
              {loanProducts.map((product, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(product.href)}
                    className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                    data-testid={`loan-product-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {product.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Portals */}
          <div data-testid="footer-contact-portals">
            <h4 className="font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2 text-sm">
                <MapPin className="text-primary w-4 h-4" />
                <span className="text-gray-400">Bhopal, Madhya Pradesh</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="text-primary w-4 h-4" />
                <span className="text-gray-400">+91 91626 207918</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Instagram className="text-primary w-4 h-4" />
                <span className="text-gray-400">@jayshreemahakalfinance</span>
              </li>
            </ul>

            {/* Portal Links */}
            <div>
              <h5 className="font-semibold mb-3 text-sm">Login Portals</h5>
              <div className="space-y-2" data-testid="footer-portal-links">
                {portalLinks.map((portal, index) => (
                  <Button
                    key={index}
                    onClick={() => handleLinkClick(portal.href)}
                    className={`w-full ${portal.color} px-3 py-2 text-center text-sm font-semibold transition-colors`}
                    data-testid={`portal-link-${portal.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {portal.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center" data-testid="footer-bottom">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; 2024 Jay Shree Mahakal Finance Service. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0" data-testid="footer-legal-links">
            {legalLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link.href)}
                className="text-gray-400 hover:text-white text-sm transition-colors"
                data-testid={`legal-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
