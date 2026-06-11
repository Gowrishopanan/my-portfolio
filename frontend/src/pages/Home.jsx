import React, { useState, useEffect } from 'react';
import RotatingBadge from '../components/RotatingBadge';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Home({ settings, setCurrentPage }) {
  const nameParts = settings.name ? settings.name.toUpperCase().split(' ') : ['GOWRISHOPANAN', 'SIVESWARAN'];
  const firstName = nameParts[0] || 'GOWRISHOPANAN';

  // State to hold the mouse coordinates for the 3D Parallax effect!
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientWidth, clientHeight } = document.documentElement;
      // Calculate normalized offset from center (-0.5 to 0.5) and multiply by travel intensity
      const x = (e.clientX / clientWidth - 0.5) * 20; // max 20px travel
      const y = (e.clientY / clientHeight - 0.5) * 20; // max 20px travel
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-8 px-6 md:px-12 overflow-hidden bg-white select-none perspective-container">
      
      {/* Background Vertical Grid Lines - exact match */}
      <div className="bg-grid-lines">
        <div className={`grid-vertical-line cinematic-grid-line ${isMounted ? 'active' : ''}`}></div>
        <div className={`grid-vertical-line cinematic-grid-line ${isMounted ? 'active' : ''}`}></div>
        <div className={`grid-vertical-line cinematic-grid-line ${isMounted ? 'active' : ''} hidden md:block`}></div>
        <div className={`grid-vertical-line cinematic-grid-line ${isMounted ? 'active' : ''}`}></div>
      </div>

      {/* Hero Master Stack */}
      <div className="relative w-full max-w-[92%] lg:max-w-[95%] mx-auto flex-grow flex flex-col justify-between z-10 mt-6">
        
        {/* 1. Massive Name Title behind portrait - Lowered & Parallaxes in reverse direction for 3D depth */}
        <div 
          style={{ 
            transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px)`,
            transition: 'transform 0.15s ease-out'
          }}
          className="absolute top-[26%] md:top-[22%] lg:top-[16%] inset-x-0 w-full flex flex-col items-center justify-center pointer-events-none select-none z-20 leading-none"
        >
          <h1 className={`font-display text-[9.5vw] md:text-[11vw] lg:text-[12.5vw] font-light text-black/90 uppercase leading-none select-none text-center whitespace-nowrap cinematic-title ${isMounted ? 'active' : ''}`}>
            {firstName}
          </h1>
        </div>

        {/* 2. Content Row: Metadata Columns and Center Portrait */}
        <div className="relative w-full flex-grow flex flex-col md:flex-row items-end justify-between pb-8 pt-32 z-10 mt-16 md:mt-32">
          
          {/* LEFT METADATA COLUMN */}
          <div className={`w-full md:w-[35%] lg:w-[38%] flex flex-col gap-6 md:text-left text-center md:pb-28 md:pl-2 select-none z-20 cinematic-left ${isMounted ? 'active' : ''}`}>
            <div className="flex flex-col gap-2.5">
              <span className="font-display text-xs md:text-sm tracking-[0.2em] font-extrabold text-black/50 uppercase">
                {settings.title || 'SOFTWARE ENGINEERING STUDENT'}
              </span>
              <h2 className="font-display text-3xl md:text-[3rem] lg:text-[3.3rem] font-black tracking-tight text-black leading-[1.02] uppercase">
                UI/UX PRODUCT<br />
                DEVELOPER
              </h2>
            </div>

            <div className="hidden md:flex flex-col gap-3 text-left text-xs md:text-sm tracking-[0.2em] font-extrabold text-black/60 mt-20 leading-relaxed">
              <a href={settings.github || 'https://github.com'} target="_blank" rel="noopener noreferrer" className="hover:text-[#000080] transition-colors duration-300">GITHUB</a>
              <a href={settings.linkedin || 'https://linkedin.com'} target="_blank" rel="noopener noreferrer" className="hover:text-[#000080] transition-colors duration-300">LINKEDIN</a>
              <a href={`mailto:${settings.email || 'siveswaran.shopanan@gmail.com'}`} className="hover:text-[#000080] transition-colors duration-300">EMAIL</a>
            </div>
          </div>

          {/* CENTER IMAGE PORTRAIT - Overlaps background text beautifully and parallaxes in active direction */}
          <div 
            style={{ 
              transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
              transition: 'transform 0.15s ease-out'
            }}
            className="relative flex-grow flex justify-center items-end h-[560px] md:h-[820px] lg:h-[950px] my-6 md:my-0 -mb-16 md:-mb-16 select-none z-10 pointer-events-none"
          >
            <div className={`h-full w-auto flex items-end cinematic-portrait ${isMounted ? 'active' : ''}`}>
              <img 
                src="/profile.jpg?v=9" 
                alt={settings.name || 'Gowrishopanan Siveswaran'} 
                className="h-full w-auto object-contain filter contrast-[1.01] saturate-[1.02] pointer-events-auto"
              />
            </div>
          </div>

          {/* RIGHT METADATA COLUMN */}
          <div className={`w-full md:w-[32%] lg:w-[35%] flex flex-col items-center md:items-end justify-between md:text-right text-center md:pb-28 md:pr-2 select-none gap-8 md:gap-24 z-20 cinematic-right ${isMounted ? 'active' : ''}`}>
            {/* Spinning Project badge with arrow */}
            <div className="pointer-events-auto">
              <RotatingBadge onClick={() => setCurrentPage('projects')} />
            </div>

            <div className="flex flex-col gap-1.5 md:text-right">
              <span className="font-display text-xs tracking-[0.2em] font-bold text-black/40 uppercase">
                BASED IN
              </span>
              <span className="font-display text-lg md:text-2xl font-black text-black/90 uppercase tracking-wide whitespace-nowrap">
                {settings.location ? settings.location.toUpperCase() : 'COLOMBO, SRI LANKA'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Minimal Footer Metarow on Mobile */}
      <div className="md:hidden flex items-center justify-center gap-6 border-t border-black/5 pt-4 z-10 w-full">
        <a href={settings.github || 'https://github.com'} target="_blank" rel="noopener noreferrer" className="text-black/55 hover:text-[#000080] transition-colors font-display text-xs tracking-wider font-extrabold">GITHUB</a>
        <a href={settings.linkedin || 'https://linkedin.com'} target="_blank" rel="noopener noreferrer" className="text-black/55 hover:text-[#000080] transition-colors font-display text-xs tracking-wider font-extrabold">LINKEDIN</a>
        <a href={`mailto:${settings.email || 'siveswaran.shopanan@gmail.com'}`} className="text-black/55 hover:text-[#000080] transition-colors font-display text-xs tracking-wider font-extrabold">EMAIL</a>
      </div>

    </div>
  );
}
