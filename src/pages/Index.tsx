
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import CtaSection from "@/components/home/CtaSection";
import { clearAllLocalStorage } from "@/utils/persistentStorage";

const Index = () => {
  // Clear old localStorage data on homepage load
  useEffect(() => {
    console.log("Clearing localStorage on homepage");
    clearAllLocalStorage();
  }, []);

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
