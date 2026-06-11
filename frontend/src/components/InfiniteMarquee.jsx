import React from 'react';

export default function InfiniteMarquee() {
  const words = [
    'FULL-STACK WEB ARCHITECTURE',
    'COMPUTER VISION RESEARCH',
    'MERN STACK SECURED SYSTEMS',
    'AUTOMATED QA SUITES',
    'DEEP LEARNING MODELING',
    'SLIIT COMPUTER SCIENCE',
    'LANDMARK DETECTION PIPELINES',
    'BLACK-BOX QA BENCHMARKS'
  ];

  // Render twice for continuous loop
  return (
    <div className="w-full bg-black/5 py-4 border-y border-black/5 overflow-hidden flex select-none relative my-16">
      
      {/* Dynamic Left Gradient Shield */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      
      {/* Dynamic Right Gradient Shield */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Marquee Track 1 */}
      <div className="flex shrink-0 items-center justify-around gap-8 min-w-full animate-marquee font-display text-[9px] md:text-[10px] tracking-[0.25em] font-extrabold text-black/45 uppercase">
        {words.map((w, idx) => (
          <span key={`w1-${idx}`} className="flex items-center gap-8">
            <span>{w}</span>
            <span>•</span>
          </span>
        ))}
      </div>

      {/* Marquee Track 2 (Duplicates for seamless wrap) */}
      <div className="flex shrink-0 items-center justify-around gap-8 min-w-full animate-marquee font-display text-[9px] md:text-[10px] tracking-[0.25em] font-extrabold text-black/45 uppercase" aria-hidden="true">
        {words.map((w, idx) => (
          <span key={`w2-${idx}`} className="flex items-center gap-8">
            <span>{w}</span>
            <span>•</span>
          </span>
        ))}
      </div>

      {/* Embedded CSS for seamless loop */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />

    </div>
  );
}
