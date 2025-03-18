
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Truck, FileText, Clock, Shield, Handshake } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Ship className="h-12 w-12 text-primary" />,
      title: "Find Available Space",
      description: "Browse and search through available shipping routes and container space from verified carriers and freight forwarders."
    },
    {
      icon: <FileText className="h-12 w-12 text-primary" />,
      title: "Submit Your Cargo Details",
      description: "Provide details about your cargo, including dimensions, weight, and special handling requirements."
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "Receive Quick Quotes",
      description: "Get transparent pricing based on your cargo details and selected shipping route."
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Secure Booking",
      description: "Book with confidence through our secure platform with end-to-end tracking and customer support."
    },
    {
      icon: <Truck className="h-12 w-12 text-primary" />,
      title: "Track Your Shipment",
      description: "Monitor your cargo throughout the entire journey with real-time tracking updates."
    },
    {
      icon: <Handshake className="h-12 w-12 text-primary" />,
      title: "Complete Delivery",
      description: "Rate and review your experience once your cargo has been successfully delivered."
    }
  ];

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">How FillMyShip Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform connects businesses with available shipping container space, 
            making international freight shipping more accessible and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mb-2">{step.icon}</div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary/5 rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Benefits of Using FillMyShip</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses that have optimized their shipping operations with our platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Cost Savings</h3>
              <p className="text-muted-foreground">
                Save up to 40% on shipping costs by filling unused container space.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Reduced Carbon Footprint</h3>
              <p className="text-muted-foreground">
                Help reduce emissions by maximizing container utilization.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-muted-foreground">
                No hidden fees or surprises - see exactly what you're paying for.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Verified Carriers</h3>
              <p className="text-muted-foreground">
                All carriers on our platform are thoroughly vetted and verified.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our dedicated support team is available around the clock.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Fast Booking</h3>
              <p className="text-muted-foreground">
                Book your shipment in minutes, not days or weeks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
