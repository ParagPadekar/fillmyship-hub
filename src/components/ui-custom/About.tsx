
// import Layout from "@/components/Layout";
import { Ship, AnchorIcon, TruckIcon, Award, TrendingUp, Scale } from "lucide-react";
import Layout from "../layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">About FillMyShip</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionizing cargo shipping through transparency, efficiency, and technology.
            </p>
          </div>
          
          {/* Mission and Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Ship className="h-8 w-8 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-blue-900">Our Mission</h2>
              </div>
              <p className="text-gray-700">
                FillMyShip aims to transform the fragmented cargo shipping industry by consolidating mediators onto a single, 
                transparent platform. We're committed to making cargo transport more efficient, accessible, and user-friendly 
                for businesses of all sizes.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-blue-900">Our Vision</h2>
              </div>
              <p className="text-gray-700">
                We envision a future where cargo shipping is as easy as booking a flight. By bringing transparency to pricing, 
                reliability ratings, and service quality, we're creating a marketplace where businesses can make informed 
                decisions and shipping providers can compete fairly.
              </p>
            </div>
          </div>
          
          {/* The Problem We're Solving */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">The Problem We're Solving</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
                  <Scale className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Fragmentation</h3>
                <p className="text-gray-600">
                  The shipping industry is highly fragmented with numerous mediators, making it difficult for businesses to find the best options.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
                  <TruckIcon className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Lack of Transparency</h3>
                <p className="text-gray-600">
                  Pricing, reliability, and service quality information is often hidden or difficult to compare across providers.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
                  <Award className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Inefficient Communication</h3>
                <p className="text-gray-600">
                  Traditional methods make it challenging for businesses and shipping providers to communicate directly and efficiently.
                </p>
              </div>
            </div>
          </div>
          
          {/* Our Solution */}
          <div className="bg-blue-900 text-white py-12 px-6 rounded-xl mb-20">
            <h2 className="text-3xl font-bold text-center mb-8">Our Solution</h2>
            <p className="text-lg max-w-4xl mx-auto text-center">
              FillMyShip consolidates the cargo shipping marketplace onto a single platform, much like Google Flights does for airline tickets. 
              Our user-friendly interface allows businesses to search, filter, and compare shipping options based on price, past reliability, 
              and service quality. We facilitate direct communication between businesses and shipping providers, making cargo transport more transparent 
              and efficient for everyone involved.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;