import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowLeft, MapPin, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
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
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Have questions, feedback, or custom event orders? Reach out to the SITI FRUITIES team.
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
                <div className="inline-block bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Get in Touch
                </div>
                <h2 className="text-3xl font-bold font-serif text-foreground">Reach Out To Us</h2>
                <p className="text-muted-foreground font-medium text-lg">
                  We are always ready to serve you the freshest meals and drinks. Contact us through any of the channels below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">
                <div className="flex flex-col items-center text-center p-6 space-y-3 bg-muted/30 rounded-2xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground">Our Location</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Poplat Shopping Complex, Opposite Maintenance, Ede Road, Ile-Ife, Osun State
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-6 space-y-3 bg-muted/30 rounded-2xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground">Phone Call</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    0812 084 2962
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-6 space-y-3 bg-muted/30 rounded-2xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground">WhatsApp</h3>
                  <a 
                    href="https://wa.me/2348120842962" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Click to Chat
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground font-semibold">
                  A custom contact form will be integrated in subsequent tasks.
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
