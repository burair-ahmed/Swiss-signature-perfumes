import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedCollection } from '@/components/sections/FeaturedCollection';
// import { CategoryShowcase } from '@/components/sections/CategoryShowcase';
import { BrandStory } from '@/components/sections/BrandStory';
import { StatsBar } from '@/components/sections/StatsBar';
import { IngredientsShowcase } from '@/components/sections/IngredientsShowcase';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCollection />
      {/* <CategoryShowcase /> */}
      <BrandStory />
      <StatsBar />
      <IngredientsShowcase />
      <TestimonialsSection />
    </>
  );
}
