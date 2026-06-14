import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LiveTickerBar } from '@/components/landing/LiveTickerBar';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { LiveSignalsPreview } from '@/components/landing/LiveSignalsPreview';
import { PricingSection } from '@/components/landing/PricingSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { SWRProvider } from '@/components/providers/SWRProvider';

export default function HomePage() {
  return (
    <SWRProvider>
      <Navbar />
      <div className="h-14 lg:h-0" aria-hidden="true" />
      <LiveTickerBar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <LiveSignalsPreview />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </SWRProvider>
  );
}
