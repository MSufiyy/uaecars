
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="car-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-car-primary">
              UAE<span className="text-car-accent">Cars</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-car-primary transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-foreground hover:text-car-primary transition-colors">
              Browse Cars
            </Link>
            <Link to="/sell" className="text-foreground hover:text-car-primary transition-colors">
              Sell Your Car
            </Link>
            <Link to="/about" className="text-foreground hover:text-car-primary transition-colors">
              About Us
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/login">
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Login</span>
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-car-primary hover:bg-car-secondary">Register</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="car-container py-4 space-y-4">
            <Link 
              to="/" 
              className="block py-2 text-foreground hover:text-car-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="block py-2 text-foreground hover:text-car-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Cars
            </Link>
            <Link 
              to="/sell" 
              className="block py-2 text-foreground hover:text-car-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Sell Your Car
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-foreground hover:text-car-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="pt-2 border-t border-gray-100">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full mb-2">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-car-primary hover:bg-car-secondary">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
