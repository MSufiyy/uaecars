
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    text: "I found my dream BMW through UAECars. The process was simple and the seller was verified, which gave me peace of mind throughout the transaction.",
    author: "Mohammed Al Qasimi",
    location: "Dubai",
    rating: 5
  },
  {
    id: 2,
    text: "As a first-time car buyer, I was nervous about purchasing a used vehicle. UAECars made it so simple with their detailed listings and direct contact with the seller.",
    author: "Fatima Abdullah",
    location: "Abu Dhabi",
    rating: 5
  },
  {
    id: 3,
    text: "I sold my Mercedes within a week of listing it on UAECars. The platform is user-friendly and connects you with serious buyers instantly.",
    author: "John Mathews",
    location: "Dubai",
    rating: 4
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 bg-car-light">
      <div className="car-container">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">Don't just take our word for it - hear from our satisfied users</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className="card-hover">
              <CardContent className="p-6 flex flex-col">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="mt-auto">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
