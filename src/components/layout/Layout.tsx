
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Generate a unique key for the route to trigger animations
  const pageKey = location.pathname;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div
          key={pageKey}
          className="animate-fade-up"
        >
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
