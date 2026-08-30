import React from 'react';
import { motion } from 'framer-motion';

export function StrawberryDecoration({ className = '', size = 56 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="berryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="40%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="calyxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
        {/* Strawberry Body */}
        <path
          d="M32 14 C18 14 10 26 12 40 C14 50 24 58 32 60 C40 58 50 50 52 40 C54 26 46 14 32 14 Z"
          fill="url(#berryGrad)"
        />
        {/* Seeds */}
        <circle cx="24" cy="28" r="1.4" fill="#FEF08A" opacity="0.9" />
        <circle cx="32" cy="26" r="1.4" fill="#FEF08A" opacity="0.9" />
        <circle cx="40" cy="28" r="1.4" fill="#FEF08A" opacity="0.9" />
        <circle cx="20" cy="38" r="1.4" fill="#FEF08A" opacity="0.9" />
        <circle cx="28" cy="37" r="1.4" fill="#FEF08A" opacity="0.9" />
        <circle cx="36" cy="37" r="1.4" fill="#FEF08A" opacity="0.9" />
        <circle cx="44" cy="38" r="1.4" fill="#FEF08A" opacity="0.9" />
        <circle cx="26" cy="47" r="1.3" fill="#FEF08A" opacity="0.9" />
        <circle cx="34" cy="46" r="1.3" fill="#FEF08A" opacity="0.9" />
        <circle cx="38" cy="47" r="1.3" fill="#FEF08A" opacity="0.9" />
        <circle cx="32" cy="54" r="1.2" fill="#FEF08A" opacity="0.9" />
        {/* Calyx Leaves */}
        <path
          d="M32 4 C32 4 33 10 32 14 C27 10 20 8 18 11 C22 13 26 15 28 17 C22 18 15 20 15 23 C20 22 25 20 29 18 C28 22 28 26 32 26 C36 26 36 22 35 18 C39 20 44 22 49 23 C49 20 42 18 36 17 C38 15 42 13 46 11 C44 8 37 10 32 14 Z"
          fill="url(#calyxGrad)"
        />
        {/* Stem */}
        <path d="M32 4 C31 1 33 0 34 0" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

export function KiwiSliceDecoration({ className = '', size = 60 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="kiwiFlesh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="60%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>
        {/* Fuzzy Brown Outer Skin */}
        <circle cx="32" cy="32" r="30" fill="#78350F" />
        <circle cx="32" cy="32" r="28" fill="#92400E" />
        {/* Green Flesh */}
        <circle cx="32" cy="32" r="26" fill="url(#kiwiFlesh)" />
        {/* Light Cream Core */}
        <ellipse cx="32" cy="32" rx="9" ry="11" fill="#F0FDF4" />
        <ellipse cx="32" cy="32" rx="6" ry="7" fill="#FEFCE8" />
        {/* Radiating Seeds */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = 32 + Math.cos(rad) * 15;
          const y = 32 + Math.sin(rad) * 15;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="1.2"
              ry="2"
              transform={`rotate(${deg + 90} ${x} ${y})`}
              fill="#1F2937"
            />
          );
        })}
      </svg>
    </motion.div>
  );
}

export function BlueberryDecoration({ className = '', size = 52 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="blueGrad1" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="30%" stopColor="#2563EB" />
            <stop offset="80%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>
          <radialGradient id="blueGrad2" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="30%" stopColor="#3B82F6" />
            <stop offset="80%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#172554" />
          </radialGradient>
        </defs>
        {/* Back Berry */}
        <circle cx="42" cy="24" r="18" fill="url(#blueGrad1)" />
        {/* Star Calyx Back */}
        <path d="M42 16 L44 19 L47 18 L45 21 L47 23 L44 23 L42 26 L40 23 L37 23 L39 21 L37 18 L40 19 Z" fill="#1E293B" opacity="0.8" />

        {/* Front Berry */}
        <circle cx="24" cy="40" r="20" fill="url(#blueGrad2)" />
        <ellipse cx="19" cy="34" rx="5" ry="3" fill="#BFDBFE" opacity="0.4" transform="rotate(-30 19 34)" />
        {/* Star Calyx Front */}
        <path d="M24 32 L26 35 L29 34 L27 37 L30 39 L26 39 L24 43 L22 39 L18 39 L21 37 L19 34 L22 35 Z" fill="#0F172A" opacity="0.85" />
      </svg>
    </motion.div>
  );
}

export function MangoDecoration({ className = '', size = 54 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, 9, 0], rotate: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="mangoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="80%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        {/* Mango Cube */}
        <path
          d="M12 18 C12 12 18 8 26 8 L42 12 C48 14 54 20 54 28 L50 44 C48 52 40 56 32 54 L18 50 C12 48 10 42 12 34 Z"
          fill="url(#mangoGrad)"
        />
        {/* Juicy Highlights */}
        <path d="M18 16 C26 12 38 16 44 22" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
        <circle cx="28" cy="24" r="2" fill="#FFFFFF" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

export function MintLeafDecoration({ className = '', size = 50 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -11, 0], rotate: [0, -12, 0] }}
      transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="60%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
        <path
          d="M8 56 C8 56 16 52 26 42 C38 30 54 20 56 8 C44 10 32 24 22 36 C14 46 8 56 8 56 Z"
          fill="url(#mintGrad)"
        />
        {/* Main Central Vein */}
        <path d="M8 56 C18 46 36 28 56 8" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
        {/* Side Veins */}
        <path d="M20 44 C26 43 32 46 34 50" stroke="#065F46" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M28 36 C34 33 40 35 43 38" stroke="#065F46" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M38 26 C44 23 48 24 50 26" stroke="#065F46" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

export function CashewDecoration({ className = '', size = 48 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, 8, 0], rotate: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 6.8, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="cashewGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>
        {/* Crescent Cashew */}
        <path
          d="M18 20 C22 10 36 8 46 14 C56 20 58 36 50 46 C42 56 26 56 20 46 C16 38 24 30 30 32 C36 34 38 40 34 44 C30 46 24 44 26 40 C28 36 32 36 34 38"
          fill="url(#cashewGrad)"
          stroke="#B45309"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M26 16 C34 14 44 18 48 26" stroke="#FEF9C3" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </svg>
    </motion.div>
  );
}
