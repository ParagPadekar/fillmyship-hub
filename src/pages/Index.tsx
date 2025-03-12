
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SearchForm from '@/components/ui-custom/SearchForm';
import { Button } from '@/components/ui/button';
import { Ship, Anchor, BarChart, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 z-0" />
        
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl z-0" />
        <div className="absolute left-0 bottom-0 -ml-20 -mb-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl z-0" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-10">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2 animate-fade-up">
              The leading marketplace for cargo shipping
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Find the best shipping <br /> 
              <span className="text-primary">for your cargo</span>
            </h1>
            <p className="text-xl text-gray-600 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Connect with trusted mediators and get competitive quotes for 
              shipping your cargo to destinations worldwide.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
            <SearchForm isHero />
          </div>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Ship className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">50+ Global Routes</h3>
              <p className="text-gray-600">Access shipping options across major global ports with competitive pricing.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">Compare prices from different mediators to find the best deal for your cargo.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Verified Mediators</h3>
              <p className="text-gray-600">All mediators are verified and rated by other cargo owners for reliability.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How FillMyShip Works</h2>
            <p className="text-xl text-gray-600">
              A simple process to find and book the right shipping solution for your cargo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Search Routes</h3>
              <p className="text-gray-600">
                Enter your departure and destination ports, along with your preferred dates.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Compare Offers</h3>
              <p className="text-gray-600">
                Compare prices, transit times, and reviews from various mediators.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Book & Ship</h3>
              <p className="text-gray-600">
                Contact the mediator directly to finalize details and book your shipment.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button asChild size="lg">
              <Link to="/listings">Browse Available Listings</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FillMyShip</h2>
            <p className="text-xl text-gray-600">
              We provide a transparent marketplace for finding the best shipping options
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2">Save Time</h3>
                <p className="text-gray-600">
                  Quickly find available shipping options without contacting multiple providers.
                  Our platform aggregates all available routes in one place.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Anchor className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2">Global Network</h3>
                <p className="text-gray-600">
                  Access shipping options from major ports worldwide with detailed 
                  information about vessels, capacity, and additional services.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2">Market Transparency</h3>
                <p className="text-gray-600">
                  Compare prices and services across different mediators to make
                  informed decisions based on your specific shipping needs.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium mb-2">Quality Assurance</h3>
                <p className="text-gray-600">
                  All listings are reviewed and approved by our team before being published.
                  Read authentic reviews from other cargo owners.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/how-it-works">Learn More About Our Process</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Ship Your Cargo?</h2>
            <p className="text-xl opacity-90">
              Join thousands of cargo owners who have found reliable shipping solutions on our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/listings">Find Shipping Options</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10 border-white">
                <Link to="/signup">Create an Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
