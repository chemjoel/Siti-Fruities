import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Leaf, 
  Check, 
  MapPin, 
  Phone, 
  MessageSquare, 
  User, 
  TrendingUp, 
  Compass,
  ShoppingBag,
  Award,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// Local assets mapping (reused from CategorySection)
const freshFruitsImg = '/assets/Screenshot_20260729-212635_1785360049633.jpg';
const parfaitImg = '/assets/IMG_8455_parfait_bowls.jpg';
const smoothieImg = '/assets/Screenshot_20260729-212748_1785360013740.jpg';
const sandwichImg = '/assets/IMG_1940_sandwich.jpg';
const hamperImg = '/assets/Screenshot_20260729-213638_1785360173839.jpg';
const founderImg = '/assets/IMG_1954_founder.jpg';

export default function AboutUs() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        
        {/* 1. Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-emerald-800 to-green-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Text Area */}
              <div className="w-full lg:w-1/2 space-y-6 text-left">
                <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif leading-tight">
                  Healthy Treats That Actually Taste Good.
                </h1>
                <p className="text-lg md:text-xl text-white/95 font-medium leading-relaxed max-w-xl">
                  Welcome to SITI FRUITIES — a health-focused food brand creating nutritious, delicious and feel-good treats for everyday life.
                </p>
              </div>

              {/* Cover Image Showcase */}
              <div className="w-full lg:w-1/2">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group bg-emerald-950/45">
                  <img 
                    src={freshFruitsImg} 
                    alt="Siti Fruities Fresh Fruit Bowl"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-white/95 text-emerald-800 px-3 py-1 rounded-full shadow-sm inline-block mb-2">
                      Always Fresh
                    </span>
                    <h3 className="text-xl font-bold font-serif text-white">Handcrafted for Wellness</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Our Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> Our Story
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">A Passion for Healthy Living</h2>
              </div>

              <div className="prose prose-emerald max-w-none text-muted-foreground font-medium text-md md:text-lg leading-relaxed space-y-6">
                <p>
                  SITI FRUITIES is a premium, health-focused food brand dedicated to providing high-quality, nutritious treats. What started as a vision to make healthy habits simple has blossomed into a comprehensive culinary brand trusted by thousands of customers.
                </p>
                <p>
                  We believe that choosing nourishing food shouldn't mean sacrificing the flavors you love. Our entire product selection is crafted around the belief that healthy food does not have to be boring. Every recipe we design is a balance of nourishment and culinary delight.
                </p>
              </div>

              {/* Quote Block Banner */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-secondary/15 p-8 rounded-3xl text-center space-y-4 max-w-2xl mx-auto shadow-sm">
                <Heart className="w-8 h-8 text-secondary mx-auto fill-secondary/10" />
                <blockquote className="text-xl font-bold font-serif text-foreground leading-snug">
                  "Healthy treats that actually taste good."
                </blockquote>
                <cite className="block text-xs font-bold uppercase tracking-widest text-primary not-italic">
                  Nutritious? Yes. Delicious? Absolutely.
                </cite>
              </div>
            </div>
          </div>
        </section>

        {/* 3. More Than Just Fruit Section */}
        <section className="py-20 bg-background border-t border-border">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">More Than Just Fruit</h2>
              <p className="text-muted-foreground font-medium">
                SITI FRUITIES has developed a diverse menu centered around fresh ingredients, wholesome combinations, and enjoyable food experiences.
              </p>
            </div>

            {/* Category Breadth Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Category 1: Fresh & Healthy */}
              <div className="bg-card rounded-3xl border border-card-border overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-emerald-950/45">
                  <img src={freshFruitsImg} alt="Fresh fruits and parfaits" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <h3 className="text-lg font-bold font-serif text-foreground">Fresh & Healthy</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground font-medium flex-1">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Fresh fruits & bowls</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Healthy chicken salad</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Greek yogurt & parfaits</li>
                  </ul>
                </div>
              </div>

              {/* Category 2: Drinks */}
              <div className="bg-card rounded-3xl border border-card-border overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-emerald-950/45">
                  <img src={smoothieImg} alt="Smoothies and drinks" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <h3 className="text-lg font-bold font-serif text-foreground">Nutritious Drinks</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground font-medium flex-1">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Thick, rich smoothies</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Raw cold-pressed juices</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Milk tea, Zobo & Tigernut</li>
                  </ul>
                </div>
              </div>

              {/* Category 3: Meals & Treats */}
              <div className="bg-card rounded-3xl border border-card-border overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-emerald-950/45">
                  <img src={sandwichImg} alt="Sandwiches and snacks" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <h3 className="text-lg font-bold font-serif text-foreground">Meals & Bakery</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground font-medium flex-1">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Signature cream sandwiches</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Gourmet beef cheesesteak</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Whole wheat banana bread</li>
                  </ul>
                </div>
              </div>

              {/* Category 4: Special Occasions */}
              <div className="bg-card rounded-3xl border border-card-border overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-emerald-950/45">
                  <img src={hamperImg} alt="Hampers and events" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <h3 className="text-lg font-bold font-serif text-foreground">Special Occasions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground font-medium flex-1">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Fresh fruit hampers</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Curated treat boxes</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Catering & bulk event orders</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Our Approach Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <h2 className="text-3xl font-bold font-serif text-foreground">Our Approach</h2>
              <p className="text-muted-foreground font-medium">How we bring wellness and taste together in perfect harmony.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Theme 1: Nutrition */}
              <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl bg-muted/20 border border-border">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-primary">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground">Nutrition First</h3>
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                  We focus on wholesome foods made with natural fresh ingredients and thoughtfully structured combinations.
                </p>
              </div>

              {/* Theme 2: Taste */}
              <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl bg-muted/20 border border-border">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground">Taste & Delight</h3>
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                  Being healthy shouldn't mean compromises. We prioritize rich flavor profiles that make eating healthy a joy.
                </p>
              </div>

              {/* Theme 3: Quality */}
              <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl bg-muted/20 border border-border">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground">Premium Quality</h3>
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                  From sourcing ingredients to product presentation, we aim for excellence, hygiene, and premium value.
                </p>
              </div>

              {/* Theme 4: Convenience */}
              <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl bg-muted/20 border border-border">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground">Easy Access</h3>
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                  Enjoy cafe dine-ins, quick pickups, or convenient delivery across Ile-Ife and environs.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Founder Section */}
        <section className="py-20 bg-background border-t border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="bg-card rounded-3xl border border-card-border p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center gap-10 md:gap-12">
              
              {/* Founder Photograph */}
              <div className="w-56 h-64 sm:w-64 sm:h-72 md:w-72 md:h-80 rounded-3xl overflow-hidden border-2 border-secondary/20 shadow-2xl relative shrink-0 group bg-card">
                <img 
                  src={founderImg} 
                  alt="Abimbola Sitirat Yunna - Founder & Creative Director, SITI FRUITIES"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                <span className="absolute bottom-3 left-4 right-4 text-center bg-white/95 backdrop-blur-sm text-primary text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-full shadow-md border border-white/20">
                  Founder & Creative Director
                </span>
              </div>

              {/* Bio Details */}
              <div className="space-y-5 flex-1 text-left">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Visionary Leadership</span>
                  <h2 className="text-3xl font-bold font-serif text-foreground">Meet the Founder</h2>
                  <h4 className="text-sm font-bold text-secondary mt-1">Abimbola Sitirat Yunna</h4>
                  <p className="text-xs text-muted-foreground font-medium">Founder & Creative Director, SITI FRUITIES</p>
                </div>

                <div className="text-sm text-muted-foreground leading-relaxed font-medium space-y-3">
                  <p>
                    Abimbola Sitirat Yunna is the Creative Director behind SITI FRUITIES. With a strong background in Sociology and Anthropology from Obafemi Awolowo University, Abimbola's leadership has been foundational to the brand's rise.
                  </p>
                  <p>
                    Her early commitment to service was demonstrated as Vice President during the 2018/2019 academic session at OAU. Today, her vision guides SITI FRUITIES as a brand focused on wellness, community, and entrepreneurship.
                  </p>
                </div>

                {/* Qualities */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['Innovation', 'Community Wellness', 'Entrepreneurship', 'Excellence', 'Service'].map((q) => (
                    <span key={q} className="px-2.5 py-1 bg-muted text-foreground text-[10px] font-bold uppercase tracking-wider rounded-lg border border-border/80">
                      {q}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. Growth Section */}
        <section className="py-20 bg-white border-t border-b border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold font-serif text-foreground">Growing With Our Community</h2>
            <p className="text-muted-foreground font-medium text-md md:text-lg leading-relaxed max-w-2xl mx-auto">
              Through consistent quality and customer trust, SITI FRUITIES has expanded into a recognized brand with two operating branches, predominantly serving our vibrant communities across Osun State.
            </p>
          </div>
        </section>

        {/* 7. Experience & CTA Section */}
        <section className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center space-y-8 relative z-10">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black font-serif text-foreground tracking-tight leading-tight">
                Ready for something fresh?
              </h2>
              <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto leading-relaxed">
                Explore the SITI FRUITIES menu and find something nutritious, delicious and made for you.
              </p>
            </div>

            {/* Experience Checklist */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2 text-xs font-bold text-foreground/80">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> Dine In Café</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> Quick Pick-ups</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> Reliable Delivery</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> Catering & Events</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold rounded-full h-12 px-8 shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Our Menu</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto bg-white border-border hover:bg-muted text-foreground font-bold rounded-full h-12 px-8 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Get in Touch</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <CartPanel />
      <WhatsAppButton />
    </div>
  );
}
