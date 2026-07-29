import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function FooterCTA() {
  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary z-0" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2VGaWx0ZXIpIi8+PC9zdmc+')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-black font-serif text-white mb-6 leading-tight">
            Ready to Eat Healthy?
          </h2>
          <p className="text-lg md:text-xl text-white/90 font-medium mb-10 max-w-xl mx-auto">
            Order your favourites today. Prepared fresh and delivered right to your door in Ile-Ife.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/2348120842962" 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                className="w-full rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8 py-6 h-auto text-lg shadow-xl"
              >
                Order on WhatsApp
              </Button>
            </a>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={scrollToProducts}
              className="w-full sm:w-auto rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-8 py-6 h-auto text-lg transition-colors"
            >
              Browse Menu
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
