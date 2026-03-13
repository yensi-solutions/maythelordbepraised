import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeaturedPastors } from '../components/landing/FeaturedPastors';
import { ServicesPreview } from '../components/landing/ServicesPreview';
import { PrayerPreview } from '../components/landing/PrayerPreview';
import { GivingSection } from '../components/landing/GivingSection';
import { CTASection } from '../components/landing/CTASection';
import { Footer, VideoShowcase } from '@mtlbp/shared';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <HowItWorks />
      <VideoShowcase variant="follower" />
      <FeaturedPastors />
      <ServicesPreview />
      <PrayerPreview />
      <GivingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
