import HeroSection from '../components/home/HeroSection';
import ToolsGrid from '../components/home/ToolsGrid';
import FeaturesSection from '../components/home/FeaturesSection';
import StatsOverviewSection from '../components/home/StatsOverviewSection';
import FaqSection from '../components/home/FaqSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 1. Clean, focused Hero Section */}
      <HeroSection />

      {/* 2. Tools Grid */}
      <ToolsGrid />

      {/* 3. Core Standards / Features */}
      <FeaturesSection />

      {/* 4. The 3 Stat Cards from Screenshot + Real Visiting Counter at bottom */}
      <StatsOverviewSection />

      {/* 5. Clean FAQ */}
      <FaqSection />
    </div>
  );
}
