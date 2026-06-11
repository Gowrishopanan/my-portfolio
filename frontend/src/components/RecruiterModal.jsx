import React, { useState } from 'react';
import { X, Briefcase, Mail, FileText, PhoneCall, Award, Copy, Check } from 'lucide-react';

export default function RecruiterModal({ onClose, settings }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(settings.email || 'siveswaran.shopanan@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 md:p-6 select-none animate-fade-in">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-black/10 flex flex-col md:flex-row items-stretch min-h-[480px]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 hover:text-black transition-colors"
        >
          <X size={16} />
        </button>

        {/* LEFT COLUMN: Headshot & Identity (1/3 width) */}
        <div className="w-full md:w-[35%] bg-black text-white p-6 md:p-8 flex flex-col justify-between items-center text-center relative overflow-hidden select-none border-b md:border-b-0 md:border-r border-white/10">
          {/* Subtle Ambient light blue Glow */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ADD8E6]/25 rounded-full filter blur-2xl pointer-events-none" />

          <div className="w-full flex flex-col items-center gap-4 z-10 mt-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shadow-md">
              <img 
                src="/profile.jpg" 
                alt="Gowrishopanan" 
                className="w-full h-full object-cover filter contrast-[1.02]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display text-lg font-black tracking-tight uppercase leading-none">
                GOWRISHOPANAN
              </h3>
              <span className="font-display text-[9px] tracking-widest font-extrabold text-[#ADD8E6] uppercase">
                SOFTWARE ENGINEER
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full text-left z-10 text-[9px] tracking-wider font-extrabold text-white/50 border-t border-white/10 pt-6 mt-6">
            <div className="flex items-center justify-between">
              <span>ACADEMIC:</span>
              <span className="text-white">SLIIT CSE DEPT</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GPA STATUS:</span>
              <span className="text-[#ADD8E6]">HONORS FIRST CLASS</span>
            </div>
            <div className="flex items-center justify-between">
              <span>LOCATION:</span>
              <span className="text-white">COLOMBO, LK</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Highlights & CTA Board (2/3 width) */}
        <div className="flex-grow p-6 md:p-8 flex flex-col justify-between gap-6 relative">
          
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#000080]">
                <Briefcase size={16} />
                <span className="font-display text-[10px] tracking-widest font-extrabold uppercase">30-SECOND PITCH MATRIX</span>
              </div>
              <h2 className="font-display text-xl font-black text-black/90 uppercase tracking-tight">
                EXECUTIVE HIGHLIGHT SUMMARY
              </h2>
            </div>

            {/* Core Pillars */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="text-sm bg-[#ADD8E6]/25 text-[#000080] w-7 h-7 rounded-lg flex items-center justify-center font-bold shrink-0">1</span>
                <div>
                  <h4 className="font-display text-xs font-black text-black/95 uppercase tracking-wide">MERN Full-Stack Architectures</h4>
                  <p className="text-black/60 text-xs mt-0.5 leading-relaxed">Built and secured multi-tier database systems linked via MongoDB Atlas and optimized REST endpoints.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-sm bg-[#ADD8E6]/25 text-[#000080] w-7 h-7 rounded-lg flex items-center justify-center font-bold shrink-0">2</span>
                <div>
                  <h4 className="font-display text-xs font-black text-black/95 uppercase tracking-wide">AI Computer Vision Research</h4>
                  <p className="text-black/60 text-xs mt-0.5 leading-relaxed">Engineered the LipReadAI ML model pipeline for facial landmark alignment and speech extraction diagnostics.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-sm bg-[#ADD8E6]/25 text-[#000080] w-7 h-7 rounded-lg flex items-center justify-center font-bold shrink-0">3</span>
                <div>
                  <h4 className="font-display text-xs font-black text-black/95 uppercase tracking-wide">Quality Assurance & Test Automation</h4>
                  <p className="text-black/60 text-xs mt-0.5 leading-relaxed">Skilled in structural black-box and integration test automation scripts using Selenium Webdriver and PyTest.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive CTA buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-black/5 pt-5 mt-2">
            
            <button 
              onClick={copyEmail}
              className="flex items-center justify-center gap-2 py-3 bg-black hover:bg-black/85 text-white font-display text-[9px] tracking-widest font-extrabold rounded-xl transition-all duration-300 shadow-md uppercase"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" /> COPIED
                </>
              ) : (
                <>
                  <Copy size={12} /> COPY EMAIL
                </>
              )}
            </button>

            <a 
              href="mailto:siveswaran.shopanan@gmail.com?subject=Inquiry%20from%20Portfolio&body=Hello%20Gowri,%20I%20reviewed%20your%20briefing%20and%20would%20like%20to..."
              className="flex items-center justify-center gap-2 py-3 border border-black/10 hover:border-black text-black hover:bg-black/5 font-display text-[9px] tracking-widest font-extrabold rounded-xl transition-all duration-300 uppercase"
            >
              <PhoneCall size={12} /> HIRE DIRECT
            </a>

            <a 
              href="/profile.jpg" // mock CV link downloads profile image as document asset
              download="Gowri_Resume.jpg"
              className="flex items-center justify-center gap-2 py-3 bg-[#000080] hover:bg-[#6D8196] text-white font-display text-[9px] tracking-widest font-extrabold rounded-xl transition-all duration-300 shadow-md uppercase"
            >
              <FileText size={12} /> GET CV / RESUME
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}
