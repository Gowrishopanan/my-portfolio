import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function RotatingBadge({ onClick }) {
  return (
    <div 
      onClick={onClick}
      className="relative w-36 h-36 flex items-center justify-center cursor-pointer group select-none z-20"
    >
      {/* Outer Rotating SVG Text */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute w-full h-full animate-spin-slow"
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text className="font-display font-bold text-[8.5px] fill-black/80 tracking-[2px] uppercase">
          <textPath href="#circlePath" startOffset="0%">
            EXPLORE PROJECTS • EXPLORE PROJECTS • 
          </textPath>
        </text>
      </svg>

      {/* Inner Central Button */}
      <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#000080] group-hover:scale-110 shadow-lg shadow-black/10">
        <ArrowUpRight size={22} className="text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>
  );
}
