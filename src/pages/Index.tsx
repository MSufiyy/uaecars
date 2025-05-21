
import MainLayout from "@/components/layout/MainLayout";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedListings from "@/components/home/FeaturedListings";
import CategorySection from "@/components/home/CategorySection";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <MainLayout>
      <HeroBanner />
      <FeaturedListings />
      <CategorySection />
      <HowItWorks />
      <TestimonialsSection />
      <CtaSection />
    </MainLayout>
  );
};

export default Index;
