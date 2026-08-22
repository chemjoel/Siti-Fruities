import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';
import type { Promotion } from '@/types/domain';
import { promotionService } from '@/services/promotion.service';

export default function PromotionsBanner() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    promotionService.getActivePromotions().then(setPromotions).catch(console.error);
  }, []);

  if (promotions.length === 0) return null;

  const current = promotions[0];

  return (
    <section className="w-full bg-gradient-to-r from-emerald-900 via-primary to-emerald-950 text-white py-4 px-4 border-y border-white/10 shadow-inner relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center shrink-0 hidden sm:flex">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-secondary text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Special Offer
              </span>
              <h4 className="font-bold text-sm sm:text-base leading-tight text-white">
                {current.title}
              </h4>
            </div>
            {current.description && (
              <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                {current.description}
              </p>
            )}
          </div>
        </div>

        {current.cta_link && (
          <Link
            href={current.cta_link}
            className="shrink-0 bg-white hover:bg-secondary text-primary hover:text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1.5 active:scale-95"
          >
            <span>{current.cta_label || 'Order Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </section>
  );
}
