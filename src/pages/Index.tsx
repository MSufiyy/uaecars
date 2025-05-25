
import MainLayout from "@/components/layout/MainLayout";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <MainLayout>
      <HeroBanner />
      <FeaturedListings />
      <HowItWorks />
      <CtaSection />
    </MainLayout>
  );
};

export default Index;
