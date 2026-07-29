import React from 'react';
import logoImg from '@assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png';
import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-[#0F1F0A] text-white/80 pt-20 pb-10 border-t-4 border-primary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1 */}
          <div className="space-y-6">
            <div className="bg-white/10 inline-block p-4 rounded-2xl backdrop-blur-sm">
              <img src={logoImg} alt="Siti Fruities" className="h-12 w-auto brightness-0 invert" />
            </div>
            <p className="text-xl font-serif font-bold text-white">Taste the Nutrition</p>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Premium healthy meals, smoothies, parfaits, and beautifully curated gift boxes made with love in Ile-Ife.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full inline-block" /> Quick Links
            </h4>
            <ul className="space-y-3">
              {['Home', 'Menu', 'Catering', 'Combos', 'About Us', 'Contact'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-primary transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-secondary rounded-full inline-block" /> Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Poplat Shopping Complex, Opposite Maintenance, Ede Road, Ile-Ife, Osun State</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>0812 084 2962</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <SiWhatsapp className="w-5 h-5 text-[#25D366] shrink-0" />
                <a href="https://wa.me/2348120842962" className="hover:text-white transition-colors">WhatsApp Us</a>
              </li>
              <li className="flex items-center gap-3 text-sm pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full inline-block" /> Opening Hours
            </h4>
            <ul className="space-y-4 text-sm bg-white/5 rounded-2xl p-6 border border-white/10">
              <li className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-white/60">Mon - Sat</span>
                <span className="font-semibold text-white">7:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between items-center pt-1">
                <span className="text-white/60">Sunday</span>
                <span className="font-semibold text-white">10:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {currentYear} Siti Fruities. All rights reserved.</p>
          <p>Made with <span className="text-primary">❤️</span> in Ile-Ife, Nigeria.</p>
        </div>
      </div>
    </footer>
  );
}
