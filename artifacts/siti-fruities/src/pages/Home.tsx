import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PromotionsBanner from '@/components/PromotionsBanner';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategorySection from '@/components/CategorySection';
import EventGallery from '@/components/EventGallery';
import Testimonials from '@/components/Testimonials';
import FooterCTA from '@/components/FooterCTA';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';

import SignatureParfaits from '@/components/SignatureParfaits';

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full">
        <Hero />
        <SignatureParfaits />
        <PromotionsBanner />
        <CategorySection />
        <EventGallery />
        <div id="products-section">
          <FeaturedProducts />
        </div>
        <Testimonials />
        <FooterCTA />
      </main>

      <Footer />

      <CartPanel />
      <WhatsAppButton />
    </div>
  );
}
