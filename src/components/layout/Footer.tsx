
import React from 'react';
import { Link } from 'react-router-dom';
import { Ship } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Ship className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight">FillMyShip</span>
            </div>
            <p className="text-sm text-gray-500">
              Connecting cargo owners with mediators for efficient shipping solutions.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/listings" className="text-sm text-gray-600 hover:text-primary">Find Routes</Link></li>
              <li><Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary">Mediator Dashboard</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-gray-600 hover:text-primary">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-primary">Contact</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-600 hover:text-primary">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-primary">Terms</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">Privacy</Link></li>
              <li><Link to="/cookies" className="text-sm text-gray-600 hover:text-primary">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} FillMyShip. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
