import React from 'react';
import { Cpu, Heart, Database, Code2, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-black/5 py-12 px-6 md:px-12 lg:px-16 select-none relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] tracking-[0.2em] font-extrabold text-black/50">
        
        {/* Left Side: Copyright Signature */}
        <div className="flex items-center gap-2 text-left">
          <span>© {currentYear} GOWRISHOPANAN.</span>
          <span className="text-black/20">|</span>
          <span className="text-black/40">ALL RIGHTS RESERVED</span>
        </div>

        {/* Center: Designer & Developer Credits with Pulse Heart */}
        <div className="flex items-center gap-1.5 justify-center text-center">
          <span>DESIGNED & DEVELOPED WITH</span>
          <Heart size={10} className="fill-[#000080]/80 text-[#000080] animate-pulse" />
          <span>BY</span>
          <span className="text-black/80 font-black tracking-[0.25em] hover:text-[#000080] transition-colors">
            GOWRISHOPANAN
          </span>
        </div>

        {/* Right Side: Architecture Stack Declaration */}
        <div className="flex items-center gap-2 justify-end text-right">
          <Database size={11} className="text-[#000080]/70" />
          <span>ARCHITECTED IN</span>
          <span className="text-[#000080] font-black tracking-[0.22em] uppercase bg-[#ADD8E6]/20 px-2.5 py-1 rounded-md border border-[#ADD8E6]/40">
            MERN STACK
          </span>
        </div>

      </div>

      {/* Tiny descriptive detailed tagline under the credits */}
      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-black/[0.03] flex flex-col sm:flex-row items-center justify-between gap-3 text-[8px] font-mono font-bold text-black/30 uppercase">
        <span className="flex items-center gap-1.5">
          <Cpu size={9} /> NODE.JS RUNTIME + EXPRESS MICROSERVICES
        </span>
        <span className="flex items-center gap-1.5">
          <Code2 size={9} /> VITE REACT SINGLE PAGE APP
        </span>
        <span className="flex items-center gap-1.5">
          <Globe size={9} /> SECURE MONGODB ATLAS CLOUD DATABASES
        </span>
      </div>

    </footer>
  );
}
