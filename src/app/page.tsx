// import SearchByCollection from "@/components/sections/Collections";
import AboutUs from "@/components/sections/AboutUs";
import BlogsSection from "@/components/sections/Blogs";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import HeroSection from "@/components/sections/Hero";
import Newsletter from "@/components/sections/Newsletter";
import BulkPricingCalculator from "@/components/sections/PricingCalculator";
import ProductRadarChart from "@/components/ui/RadarChart";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <AboutUs />
      <FeaturedProducts title="Featured Products" />
      <FeaturedProducts title="Most Selling Products" />
      <FeaturedProducts title="Discounted Products" />
      <BulkPricingCalculator />
      <BlogsSection />
      <Newsletter />
      <ProductRadarChart />
    </div>
  );
}
