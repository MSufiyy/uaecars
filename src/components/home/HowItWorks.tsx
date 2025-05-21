
import React from "react";
import { Search, CheckCircle, Car } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Cars",
    description: "Browse our extensive collection of verified used cars from trusted dealers and private sellers across the UAE."
  },
  {
    icon: CheckCircle,
    title: "Contact Seller",
    description: "Found your dream car? Contact the seller directly to inquire about the car, schedule a test drive, or make an offer."
  },
  {
    icon: Car,
    title: "Complete Purchase",
    description: "Finalize the deal with confidence, knowing that all cars are verified and sellers are authenticated on our platform."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-12 bg-white">
      <div className="car-container">
        <div className="text-center mb-12">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Find and purchase your dream car in just a few steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
              <div className="bg-car-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <step.icon size={32} className="text-car-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#0F4C81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
