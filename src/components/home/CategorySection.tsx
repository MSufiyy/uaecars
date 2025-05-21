
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "luxury",
    name: "Luxury Cars",
    description: "Premium vehicles with advanced features and superior comfort",
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&q=80&w=900",
    count: 245
  },
  {
    id: "suv",
    name: "SUVs",
    description: "Spacious vehicles with enhanced ground clearance",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=900",
    count: 312
  },
  {
    id: "sedan",
    name: "Sedans",
    description: "Comfortable, mid-sized cars perfect for everyday use",
    image: "https://images.unsplash.com/photo-1549220167-4b376d33dbb2?auto=format&fit=crop&q=80&w=900",
    count: 187
  },
  {
    id: "sports",
    name: "Sports Cars",
    description: "High-performance vehicles designed for speed and handling",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=900",
    count: 98
  }
];

const CategorySection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="car-container">
        <div className="text-center mb-12">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Find your dream car by exploring our categories</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-lg overflow-hidden shadow-md card-hover">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-muted-foreground mb-3">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-car-primary font-medium">{category.count} Cars</span>
                  <Link to={`/category/${category.id}`}>
                    <Button size="sm" variant="outline">Browse</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
