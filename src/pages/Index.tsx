
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import CtaSection from "@/components/home/CtaSection";
import { initializeFromLocalStorage } from "@/utils/persistentStorage";

const Index = () => {
  // Initialize data from localStorage to IndexedDB on first visit to homepage
  useEffect(() => {
    const init = async () => {
      console.log("Initializing data on homepage");
      // Run initialization with a clean refresh to ensure syncing across browsers
      await initializeFromLocalStorage();
    };
    init();
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
