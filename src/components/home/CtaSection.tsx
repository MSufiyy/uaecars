
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-16 bg-car-primary text-white">
      <div className="car-container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Buy or Sell a Car?</h2>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Join thousands of satisfied users who have found their perfect car or sold their vehicle quickly on UAECars.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-car-accent text-black hover:brightness-110">
                Register Now
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 bg-white hover:text-white">
                Browse Cars
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
