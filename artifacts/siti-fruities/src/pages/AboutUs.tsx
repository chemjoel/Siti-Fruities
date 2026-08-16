import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowLeft, Sparkles, Heart, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        {/* Banner Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-emerald-800 to-green-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-4 leading-tight">
              About Us
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Discover the story, mission, and passion behind SITI FRUITIES and our healthy lifestyle offerings.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-3xl border border-card-border p-8 md:p-12 shadow-sm space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <div className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Our Story
                </div>
                <h2 className="text-3xl font-bold font-serif text-foreground">SITI FRUITIES</h2>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  SITI FRUITIES is a premium food and healthy-lifestyle business committed to providing the freshest and most nutritious meals, drinks, and snacks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">
                <div className="flex flex-col items-center text-center p-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground">100% Fresh</h3>
                  <p className="text-sm text-muted-foreground font-medium">Made daily with carefully sourced local and exotic fruits and premium ingredients.</p>
                </div>

                <div className="flex flex-col items-center text-center p-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground">Zero Preservatives</h3>
                  <p className="text-sm text-muted-foreground font-medium">Naturally prepared with zero artificial colorings, sweeteners, or preservatives.</p>
                </div>

                <div className="flex flex-col items-center text-center p-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground">Made with Love</h3>
                  <p className="text-sm text-muted-foreground font-medium">Crafted with care in Ile-Ife to support your healthy lifestyle goals.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground font-semibold">
                  Full Story & About Page Coming Soon. Stay Tuned!
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <CartPanel />
      <WhatsAppButton />
    </div>
  );
}
