import { 
  HeroSection,
  StatsSection,
  FeaturesSection,
  ServicesSection,
  CallToActionSection
} from '@/components/home';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ServicesSection />
      <CallToActionSection />
    </div>
  );
}
