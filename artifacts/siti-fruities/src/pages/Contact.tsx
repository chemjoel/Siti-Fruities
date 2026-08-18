import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  MessageSquare, 
  ShoppingBag, 
  Utensils, 
  Sparkles,
  Instagram
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const whatsappUrl = "https://wa.me/2348120842962?text=Hello%20SITI%20FRUITIES%2C%20I%27d%20like%20to%20make%20an%20enquiry.";
  const phoneUrl = "tel:09059207065";
  const emailUrl = "mailto:sitifruities@gmail.com";
  const mapsUrl = "https://maps.google.com/?q=Poplat+Shopping+Complex+Ede+Road+Ile-Ife+Osun+State";

  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        
        {/* 1. Contact Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-emerald-800 to-green-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl text-center space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif leading-tight">
              We'd Love to Hear From You
            </h1>
            <p className="text-lg md:text-xl text-white/95 font-medium leading-relaxed max-w-2xl mx-auto">
              Have a question, want to place an order, plan an event, or simply want to find us? Get in touch with SITI FRUITIES.
            </p>
          </div>
        </section>

        {/* 2. Primary Contact Actions Section */}
        <section className="py-16 bg-white border-b border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Reach Out
              </div>
              <h2 className="text-3xl font-bold font-serif text-foreground">Quick Contact Channels</h2>
              <p className="text-muted-foreground font-medium text-sm">Choose the most convenient way to reach our team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* WhatsApp Card */}
              <div className="bg-card rounded-3xl border border-card-border p-8 shadow-sm flex flex-col justify-between space-y-6 group hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif text-foreground">WhatsApp</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Instant messaging & direct order enquiries</p>
                  </div>
                  <p className="text-base font-bold text-foreground">0812 084 2962</p>
                </div>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-full h-11 text-sm shadow-sm transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </Button>
                </a>
              </div>

              {/* Phone Card */}
              <div className="bg-card rounded-3xl border border-card-border p-8 shadow-sm flex flex-col justify-between space-y-6 group hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif text-foreground">Phone Call</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Direct voice line for fast customer assistance</p>
                  </div>
                  <p className="text-base font-bold text-foreground">0905 920 7065</p>
                </div>
                <a 
                  href={phoneUrl}
                  className="w-full"
                >
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full h-11 text-sm shadow-sm transition-all flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Call SITI FRUITIES</span>
                  </Button>
                </a>
              </div>

              {/* Email Card */}
              <div className="bg-card rounded-3xl border border-card-border p-8 shadow-sm flex flex-col justify-between space-y-6 group hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif text-foreground">Email</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">For general enquiries, catering & feedback</p>
                  </div>
                  <p className="text-sm font-bold text-foreground break-all">sitifruities@gmail.com</p>
                </div>
                <a 
                  href={emailUrl}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full border-border hover:bg-muted text-foreground font-bold rounded-full h-11 text-sm transition-all flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Send an Email</span>
                  </Button>
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Location & Opening Hours Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Visit Us & Directions Card */}
              <div className="bg-card rounded-3xl border border-card-border p-8 md:p-10 shadow-sm flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">Store Location</span>
                      <h3 className="text-2xl font-bold font-serif text-foreground">Visit Us</h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-foreground font-medium leading-relaxed bg-muted/40 p-5 rounded-2xl border border-border">
                    <p className="font-bold text-base text-foreground">SITI FRUITIES</p>
                    <p>Poplat Shopping Complex</p>
                    <p>Near Jolly Hostel, adjacent to Maintenance</p>
                    <p>Along Ede Road</p>
                    <p className="text-muted-foreground">Ile-Ife, Osun State, Nigeria</p>
                  </div>
                </div>

                <a 
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block"
                >
                  <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-full h-12 text-sm shadow-md transition-all flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
                  </Button>
                </a>
              </div>

              {/* Opening Hours Card */}
              <div className="bg-card rounded-3xl border border-card-border p-8 md:p-10 shadow-sm flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block">Service Times</span>
                      <h3 className="text-2xl font-bold font-serif text-foreground">Opening Hours</h3>
                    </div>
                  </div>

                  <div className="space-y-3 divide-y divide-border text-sm">
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium text-foreground">Monday</span>
                      <span className="font-bold text-primary">9:00 AM – 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium text-foreground">Tuesday</span>
                      <span className="font-bold text-primary">9:00 AM – 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium text-foreground">Wednesday</span>
                      <span className="font-bold text-primary">9:00 AM – 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium text-foreground">Thursday</span>
                      <span className="font-bold text-primary">9:00 AM – 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium text-foreground">Friday</span>
                      <span className="font-bold text-primary">9:00 AM – 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium text-foreground">Saturday</span>
                      <span className="font-bold text-primary">9:00 AM – 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium text-foreground">Sunday</span>
                      <span className="font-bold text-secondary">1:00 PM – 8:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Social Media Section */}
        <section className="py-16 bg-white border-t border-b border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-serif text-foreground">Follow SITI FRUITIES</h2>
              <p className="text-muted-foreground font-medium text-sm">Stay updated with fresh treats, promotions, and stories.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              {/* Instagram */}
              <a 
                href="https://instagram.com/sitifruities"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" className="w-full sm:w-auto min-w-[220px] bg-pink-50/50 hover:bg-pink-100/60 text-pink-700 border-pink-200/80 font-bold rounded-full h-12 px-6 text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xs">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <span>@sitifruities</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto sm:ml-2" />
                </Button>
              </a>

              {/* TikTok */}
              <a 
                href="https://tiktok.com/@sitifruitiescafe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" className="w-full sm:w-auto min-w-[220px] bg-muted/40 hover:bg-muted text-foreground border-border font-bold rounded-full h-12 px-6 text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xs">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span>@sitifruitiescafe</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto sm:ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* 5. Bottom CTAs (Event & Menu) */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Event & Catering CTA */}
              <div className="bg-white rounded-3xl border border-secondary/20 p-8 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-foreground">Planning an Event?</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Planning a gathering, office event, meeting or special occasion? Explore our Events & Catering options and let SITI FRUITIES help make it a little more delicious.
                  </p>
                </div>
                <Link href="/catering-events">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full h-11 text-sm shadow-sm transition-all flex items-center justify-center gap-2">
                    <Utensils className="w-4 h-4" />
                    <span>Explore Events & Catering</span>
                  </Button>
                </Link>
              </div>

              {/* Explore Menu CTA */}
              <div className="bg-white rounded-3xl border border-primary/20 p-8 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-foreground">Looking for Something to Eat or Drink?</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Explore our menu and discover fresh, healthy and delicious options from SITI FRUITIES.
                  </p>
                </div>
                <Link href="/">
                  <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-full h-11 text-sm shadow-sm transition-all flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Explore Our Menu</span>
                  </Button>
                </Link>
              </div>

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
