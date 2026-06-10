import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LiveTickerBar } from '@/components/landing/LiveTickerBar';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { LiveSignalsPreview } from '@/components/landing/LiveSignalsPreview';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { SWRProvider } from '@/components/providers/SWRProvider';

export default function HomePage() {
  return (
    <SWRProvider>
      <Navbar />
      <LiveTickerBar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <LiveSignalsPreview />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </SWRProvider>
  );
}
