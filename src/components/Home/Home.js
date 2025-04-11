// src/pages/Home.jsx (Main Component)
import React, { useState, useEffect } from "react";
import SkeletonLoader from "../Loaders/SkeletonLoader";
import HeroSection from "./HeroSection";
import PetTypeSection from "./PetTypeSection";
import FeaturedServicesSection from "./FeaturedServicesSection";
import ResourceFinderSection from "./ResourceFinderSection";
import AdoptionSection from "./AdoptionSection";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating resource fetching
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonLoader type="list" count={9} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white overflow-hidden">
      <HeroSection />
      <PetTypeSection />
      <FeaturedServicesSection />
      <ResourceFinderSection />
      <AdoptionSection />
    </div>
  );
};

export default Home;