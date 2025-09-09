import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-brand-gold">Rayalaseema</span> Fashions
            </h3>
            <p className="text-primary-foreground/80 mb-4">
              Premium quality clothing for the modern gentleman. Discover timeless style with contemporary comfort.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shirts" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  Shirts
                </Link>
              </li>
              <li>
                <Link to="/pants" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  Pants
                </Link>
              </li>
              <li>
                <Link to="/tshirts" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  Track Your Order
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-brand-gold transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <span className="text-sm">
                  123 Fashion Street, Rayalaseema, Andhra Pradesh, India
                </span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-5 h-5 text-brand-gold" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-5 h-5 text-brand-gold" />
                <span>info@rayalaseemafashions.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Rayalaseema Fashions. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-primary-foreground/60 hover:text-brand-gold text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-brand-gold text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;