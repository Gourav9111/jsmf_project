import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import logoPath from "@assets/Gemini_Generated_Image_bq4jlqbq4jlqbq4j (1)_1755873870848.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 logo-container">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src={logoPath} alt="JSMF Logo" className="w-14 h-14 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Jay Shree Mahakal</h1>
              <p className="text-sm text-text-muted">Finance Service</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-text-dark hover:text-primary font-medium transition-colors" data-testid="nav-home">Home</a>
            <a href="#loans" className="text-text-dark hover:text-primary font-medium transition-colors" data-testid="nav-loans">Loans</a>
            <a href="#calculator" className="text-text-dark hover:text-primary font-medium transition-colors" data-testid="nav-calculator">EMI Calculator</a>
            <Link href="/track-application" className="text-text-dark hover:text-primary font-medium transition-colors" data-testid="nav-track">Track Application</Link>
            <a href="#dsa" className="text-text-dark hover:text-primary font-medium transition-colors" data-testid="nav-dsa">DSA Partner</a>
            <Link href="/terms" className="text-text-dark hover:text-primary font-medium transition-colors" data-testid="nav-terms">Terms</Link>
            <a href="#contact" className="text-text-dark hover:text-primary font-medium transition-colors" data-testid="nav-contact">Contact</a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-text-dark hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200" data-testid="mobile-menu">
            <div className="px-4 py-2 space-y-2">
              <a href="#home" className="block py-3 text-text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)} data-testid="mobile-nav-home">Home</a>
              <a href="#loans" className="block py-3 text-text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)} data-testid="mobile-nav-loans">Loans</a>
              <a href="#calculator" className="block py-3 text-text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)} data-testid="mobile-nav-calculator">EMI Calculator</a>
              <Link href="/track-application" className="block py-3 text-text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)} data-testid="mobile-nav-track">Track Application</Link>
              <a href="#dsa" className="block py-3 text-text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)} data-testid="mobile-nav-dsa">DSA Partner</a>
              <Link href="/terms" className="block py-3 text-text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)} data-testid="mobile-nav-terms">Terms</Link>
              <a href="#contact" className="block py-3 text-text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)} data-testid="mobile-nav-contact">Contact</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
