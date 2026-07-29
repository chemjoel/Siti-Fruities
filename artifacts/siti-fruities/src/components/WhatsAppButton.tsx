import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/2348120842962"
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group flex items-center"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute right-full mr-4 bg-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block text-foreground">
        Chat with us
      </span>
      
      <div className="relative">
        {/* Pulse effect rings */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75 duration-[3000ms]"></div>
        
        {/* Button */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/30 group-hover:scale-110 transition-transform duration-300">
          <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white fill-white" />
        </div>
      </div>
    </motion.a>
  );
}
