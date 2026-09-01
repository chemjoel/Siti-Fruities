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
        <path
          d="M32 14 C18 14 10 26 12 40 C14 50 24 58 32 60 C40 58 50 50 52 40 C54 26 46 14 32 14 Z"
          fill="url(#berryGrad)"
        />
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
        <path
          d="M32 4 C32 4 33 10 32 14 C27 10 20 8 18 11 C22 13 26 15 28 17 C22 18 15 20 15 23 C20 22 25 20 29 18 C28 22 28 26 32 26 C36 26 36 22 35 18 C39 20 44 22 49 23 C49 20 42 18 36 17 C38 15 42 13 46 11 C44 8 37 10 32 14 Z"
          fill="url(#calyxGrad)"
        />
        <path d="M32 4 C31 1 33 0 34 0" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

export function StrawberryHalfDecoration({ className = '', size = 72 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
      transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="halfBerryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="35%" stopColor="#F87171" />
            <stop offset="75%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          <linearGradient id="halfBerryFlesh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEE2E2" />
            <stop offset="50%" stopColor="#FECACA" />
            <stop offset="100%" stopColor="#FCA5A5" />
          </linearGradient>
        </defs>
        {/* Cut half — flat side left */}
        <path d="M40 8 C26 8 16 20 16 36 C16 52 26 68 40 72 C54 68 64 52 64 36 C64 20 54 8 40 8 Z" fill="url(#halfBerryGrad)" />
        {/* Flat cut face */}
        <ellipse cx="40" cy="40" rx="24" ry="32" fill="url(#halfBerryFlesh)" />
        <ellipse cx="40" cy="40" rx="18" ry="26" fill="#FEE2E2" opacity="0.6" />
        {/* Seeds on cut face */}
        <ellipse cx="32" cy="30" rx="1.5" ry="2.5" fill="#FCA5A5" opacity="0.8" transform="rotate(-10 32 30)" />
        <ellipse cx="40" cy="26" rx="1.5" ry="2.5" fill="#FCA5A5" opacity="0.8" />
        <ellipse cx="48" cy="30" rx="1.5" ry="2.5" fill="#FCA5A5" opacity="0.8" transform="rotate(10 48 30)" />
        <ellipse cx="28" cy="42" rx="1.5" ry="2.5" fill="#FCA5A5" opacity="0.8" transform="rotate(-5 28 42)" />
        <ellipse cx="36" cy="40" rx="1.5" ry="2.5" fill="#FCA5A5" opacity="0.8" />
        <ellipse cx="44" cy="40" rx="1.5" ry="2.5" fill="#FCA5A5" opacity="0.8" />
        <ellipse cx="52" cy="42" rx="1.5" ry="2.5" fill="#FCA5A5" opacity="0.8" transform="rotate(5 52 42)" />
        <ellipse cx="34" cy="54" rx="1.5" ry="2.5" fill="#FCA5A5" opacity="0.8" />
        <ellipse cx="46" cy="54" rx="1.5" ry="2.5" fill="#FCA5A5" opacity="0.8" />
        {/* Calyx */}
        <path d="M40 2 C38 5 39 8 40 8 C36 5 30 4 28 7 C31 9 35 10 37 12 C32 12 26 14 26 17 C31 16 36 14 39 13 C38 17 38 21 40 21 C42 21 42 17 41 13 C44 14 49 16 54 17 C54 14 48 12 43 12 C45 10 49 9 52 7 C50 4 44 5 40 8 Z" fill="#15803D" />
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
        <circle cx="32" cy="32" r="30" fill="#78350F" />
        <circle cx="32" cy="32" r="28" fill="#92400E" />
        <circle cx="32" cy="32" r="26" fill="url(#kiwiFlesh)" />
        <ellipse cx="32" cy="32" rx="9" ry="11" fill="#F0FDF4" />
        <ellipse cx="32" cy="32" rx="6" ry="7" fill="#FEFCE8" />
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
        <circle cx="42" cy="24" r="18" fill="url(#blueGrad1)" />
        <path d="M42 16 L44 19 L47 18 L45 21 L47 23 L44 23 L42 26 L40 23 L37 23 L39 21 L37 18 L40 19 Z" fill="#1E293B" opacity="0.8" />
        <circle cx="24" cy="40" r="20" fill="url(#blueGrad2)" />
        <ellipse cx="19" cy="34" rx="5" ry="3" fill="#BFDBFE" opacity="0.4" transform="rotate(-30 19 34)" />
        <path d="M24 32 L26 35 L29 34 L27 37 L30 39 L26 39 L24 43 L22 39 L18 39 L21 37 L19 34 L22 35 Z" fill="#0F172A" opacity="0.85" />
      </svg>
    </motion.div>
  );
}

export function GrapeClusterDecoration({ className = '', size = 72 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
      transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 80 90" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="grapeGrad1" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="40%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </radialGradient>
          <radialGradient id="grapeGrad2" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="40%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#3B0764" />
          </radialGradient>
        </defs>
        {/* Stem */}
        <path d="M40 4 C40 4 38 8 38 14 C36 12 32 10 30 12 C33 14 36 16 38 18" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
        {/* Grapes: bottom row */}
        <circle cx="28" cy="76" r="10" fill="url(#grapeGrad1)" />
        <circle cx="28" cy="76" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        <circle cx="40" cy="78" r="10" fill="url(#grapeGrad2)" />
        <circle cx="40" cy="78" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        <circle cx="52" cy="76" r="10" fill="url(#grapeGrad1)" />
        <circle cx="52" cy="76" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        {/* Middle row */}
        <circle cx="22" cy="58" r="10" fill="url(#grapeGrad2)" />
        <circle cx="22" cy="58" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        <circle cx="34" cy="60" r="10" fill="url(#grapeGrad1)" />
        <circle cx="34" cy="60" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        <circle cx="46" cy="60" r="10" fill="url(#grapeGrad2)" />
        <circle cx="46" cy="60" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        <circle cx="58" cy="58" r="10" fill="url(#grapeGrad1)" />
        <circle cx="58" cy="58" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        {/* Upper-middle row */}
        <circle cx="28" cy="40" r="10" fill="url(#grapeGrad1)" />
        <circle cx="28" cy="40" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        <circle cx="40" cy="38" r="10" fill="url(#grapeGrad2)" />
        <circle cx="40" cy="38" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        <circle cx="52" cy="40" r="10" fill="url(#grapeGrad1)" />
        <circle cx="52" cy="40" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        {/* Top row */}
        <circle cx="34" cy="22" r="10" fill="url(#grapeGrad2)" />
        <circle cx="34" cy="22" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        <circle cx="46" cy="22" r="10" fill="url(#grapeGrad1)" />
        <circle cx="46" cy="22" r="5" fill="white" opacity="0.18" transform="translate(-2,-2)" />
        {/* Leaf */}
        <path d="M36 10 C30 6 22 8 20 14 C24 14 28 12 30 14 C26 16 22 20 22 24 C26 22 30 18 34 18 C32 22 32 26 34 28 C36 24 36 20 38 18 Z" fill="#16A34A" opacity="0.9" />
      </svg>
    </motion.div>
  );
}

export function WatermelonSliceDecoration({ className = '', size = 70 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, 9, 0], rotate: [0, -7, 0] }}
      transition={{ repeat: Infinity, duration: 7.5, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 80 60" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="wmRind" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="50%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="wmFlesh" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="60%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
        {/* Green rind arc */}
        <path d="M4 56 C4 56 8 8 40 4 C72 8 76 56 76 56 Z" fill="url(#wmRind)" />
        {/* White inner rind */}
        <path d="M9 56 C9 56 13 14 40 10 C67 14 71 56 71 56 Z" fill="#F0FDF4" />
        {/* Red flesh */}
        <path d="M14 56 C14 56 18 20 40 16 C62 20 66 56 66 56 Z" fill="url(#wmFlesh)" />
        {/* Seeds */}
        <ellipse cx="30" cy="38" rx="2" ry="3.5" fill="#1C1917" transform="rotate(-12 30 38)" />
        <ellipse cx="40" cy="34" rx="2" ry="3.5" fill="#1C1917" />
        <ellipse cx="50" cy="38" rx="2" ry="3.5" fill="#1C1917" transform="rotate(12 50 38)" />
        <ellipse cx="24" cy="48" rx="1.8" ry="3" fill="#1C1917" transform="rotate(-8 24 48)" />
        <ellipse cx="35" cy="46" rx="1.8" ry="3" fill="#1C1917" transform="rotate(-3 35 46)" />
        <ellipse cx="45" cy="46" rx="1.8" ry="3" fill="#1C1917" transform="rotate(3 45 46)" />
        <ellipse cx="56" cy="48" rx="1.8" ry="3" fill="#1C1917" transform="rotate(8 56 48)" />
        {/* Highlight */}
        <path d="M22 26 C30 20 50 22 58 28" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    </motion.div>
  );
}

export function OrangeSliceDecoration({ className = '', size = 64 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 6.2, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="orangeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="40%" stopColor="#FB923C" />
            <stop offset="85%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </radialGradient>
        </defs>
        {/* Peel */}
        <circle cx="32" cy="32" r="31" fill="#C2410C" />
        <circle cx="32" cy="32" r="29" fill="#EA580C" />
        {/* Flesh */}
        <circle cx="32" cy="32" r="27" fill="url(#orangeGrad)" />
        {/* Center */}
        <circle cx="32" cy="32" r="5" fill="#FEF08A" opacity="0.9" />
        {/* Segments */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = 32 + Math.cos(rad) * 26;
          const y2 = 32 + Math.sin(rad) * 26;
          return (
            <line key={i} x1="32" y1="32" x2={x2} y2={y2} stroke="#EA580C" strokeWidth="1.2" opacity="0.5" />
          );
        })}
        {/* Highlight */}
        <ellipse cx="22" cy="22" rx="7" ry="4" fill="white" opacity="0.22" transform="rotate(-40 22 22)" />
      </svg>
    </motion.div>
  );
}

export function PineappleSliceDecoration({ className = '', size = 66 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, 11, 0], rotate: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      className={`pointer-events-none select-none drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 70 80" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="pineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="80%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        {/* Leaves */}
        <path d="M35 4 C33 1 28 0 26 4 C30 5 33 8 35 12 Z" fill="#16A34A" />
        <path d="M35 4 C37 1 42 0 44 4 C40 5 37 8 35 12 Z" fill="#22C55E" />
        <path d="M35 4 C35 0 35 -2 35 0 C35 2 35 6 35 12 Z" fill="#15803D" />
        <path d="M28 6 C24 2 18 3 17 7 C22 7 26 10 28 14 Z" fill="#4ADE80" />
        <path d="M42 6 C46 2 52 3 53 7 C48 7 44 10 42 14 Z" fill="#4ADE80" />
        {/* Body */}
        <ellipse cx="35" cy="50" rx="28" ry="28" fill="url(#pineGrad)" />
        {/* Diamond scale pattern */}
        {[...Array(4)].map((_, row) =>
          [...Array(4)].map((_, col) => {
            const x = 18 + col * 13 + (row % 2 === 0 ? 0 : 6.5);
            const y = 32 + row * 12;
            return (
              <path
                key={`${row}-${col}`}
                d={`M${x} ${y - 5} L${x + 5} ${y} L${x} ${y + 5} L${x - 5} ${y} Z`}
                fill="#D97706"
                opacity="0.35"
              />
            );
          })
        )}
        {/* Center hole */}
        <circle cx="35" cy="50" r="6" fill="#FDE68A" opacity="0.8" />
        <circle cx="35" cy="50" r="3" fill="#FBBF24" opacity="0.6" />
        {/* Highlight */}
        <ellipse cx="26" cy="38" rx="7" ry="4" fill="white" opacity="0.25" transform="rotate(-30 26 38)" />
      </svg>
    </motion.div>
  );
}

export function YoghurtSwirlDecoration({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.04, 1], rotate: [0, 3, 0] }}
      transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="creamGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FEF9EF" />
            <stop offset="80%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.6" />
          </radialGradient>
          <filter id="creamBlur">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>
        {/* Outer soft blob */}
        <ellipse cx="50" cy="52" rx="42" ry="36" fill="url(#creamGrad)" opacity="0.85" />
        {/* Swirl layers */}
        <path
          d="M50 20 C68 20 82 32 80 50 C78 68 62 76 50 74 C38 72 26 62 28 50 C30 38 40 28 50 26 C60 24 70 32 68 44 C66 56 56 62 50 60 C44 58 38 52 40 46 C42 40 48 38 52 42"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
          filter="url(#creamBlur)"
        />
        {/* Inner swirl peak */}
        <path
          d="M50 32 C58 32 64 40 62 48 C60 56 54 60 50 58 C46 56 42 50 44 44 C46 40 50 38 52 42"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        {/* Cream peak */}
        <ellipse cx="50" cy="36" rx="8" ry="6" fill="white" opacity="0.9" />
        <ellipse cx="50" cy="32" rx="5" ry="4" fill="white" opacity="0.95" />
        <ellipse cx="50" cy="29" rx="3" ry="2.5" fill="white" />
        {/* Drip */}
        <path d="M62 58 C64 62 63 68 60 70" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
        <path d="M38 60 C36 65 37 70 40 72" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        {/* Soft shine */}
        <ellipse cx="44" cy="40" rx="6" ry="3" fill="white" opacity="0.4" transform="rotate(-20 44 40)" />
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
        <path
          d="M12 18 C12 12 18 8 26 8 L42 12 C48 14 54 20 54 28 L50 44 C48 52 40 56 32 54 L18 50 C12 48 10 42 12 34 Z"
          fill="url(#mangoGrad)"
        />
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
        <path d="M8 56 C18 46 36 28 56 8" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
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
