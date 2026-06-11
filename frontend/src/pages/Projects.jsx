import React, { useState } from 'react';
import { ExternalLink, Github, Layers, Sparkles, Terminal, Code2, ArrowRight } from 'lucide-react';
import LipLandmarks from '../components/LipLandmarks';

export default function Projects({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="relative min-h-screen w-full pt-32 pb-20 px-6 md:px-12 bg-white overflow-x-hidden">
      
      {/* Background Vertical Grid Lines */}
      <div className="bg-grid-lines">
        <div className="grid-vertical-line"></div>
        <div className="grid-vertical-line"></div>
        <div className="grid-vertical-line hidden md:block"></div>
        <div className="grid-vertical-line"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10 flex flex-col gap-16">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3 select-none apple-reveal">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#6D8196]" />
            <span className="font-display text-xs tracking-widest font-extrabold text-[#6D8196]">03 / PORTFOLIO</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight uppercase text-black/90">
            ENGINEERED CASE STUDIES
          </h1>
        </div>

        {/* Highlighted Project (LipReadAI or first item) */}
        {projects.length > 0 && (
          <div className="w-full bg-black text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col lg:flex-row gap-10 items-center justify-between border border-white/5 relative overflow-hidden group apple-reveal delay-100">
            
            {/* Ambient Background Glow in Light Blue */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#ADD8E6]/25 rounded-full filter blur-[80px] pointer-events-none transition-transform duration-700 group-hover:scale-110" />

            <div className="w-full lg:w-3/5 flex flex-col gap-5 z-10">
              <div className="flex items-center gap-2 text-[#ADD8E6]">
                <Sparkles size={18} />
                <span className="font-display text-xs tracking-widest font-extrabold uppercase font-sans">FEATURED RESEARCH STUDY</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {projects[0].title}
              </h2>
              
              <p className="text-white/60 text-xs tracking-wider uppercase font-semibold">
                {projects[0].subtitle}
              </p>

              <p className="text-white/70 text-sm md:text-base leading-relaxed font-medium">
                {projects[0].description}
              </p>

              {/* Interactive Face/Lip Landmark Diagnostics Tracker */}
              <div className="w-full max-w-md my-3 pointer-events-auto">
                <LipLandmarks />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {projects[0].tags.map((tag) => (
                  <span key={tag} className="text-[10px] tracking-widest font-extrabold bg-white/10 px-3 py-1 rounded-full border border-white/5 uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col gap-6 bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl z-10 backdrop-blur-md">
              <h4 className="font-display text-xs tracking-widest font-extrabold text-[#ADD8E6] uppercase flex items-center gap-2">
                <Code2 size={14} /> SYSTEM DETAILS
              </h4>
              
              <ul className="flex flex-col gap-3">
                {projects[0].details.slice(0, 5).map((detail, idx) => (
                  <li key={idx} className="text-xs text-white/80 leading-relaxed font-medium border-b border-white/5 pb-2 last:border-b-0 flex items-start gap-2">
                    <span className="text-[#ADD8E6]">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 mt-2">
                {projects[0].githubUrl && (
                  <a 
                    href={projects[0].githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black font-display text-xs tracking-widest font-extrabold rounded-xl hover:bg-[#ADD8E6] hover:text-black transition-all duration-300"
                  >
                    <Github size={14} /> GITHUB REPO
                  </a>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Projects Subgrid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.slice(1).map((proj, idx) => (
            <div 
              key={proj.id || idx}
              className={`glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 hover:border-[#000080]/30 group apple-reveal delay-${Math.min((idx + 1) * 100, 500)}`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <span className="font-display text-[10px] tracking-widest font-extrabold text-black/40 uppercase">
                    {proj.category}
                  </span>
                  
                  {proj.liveUrl && (
                    <span className="flex items-center gap-1 text-[9px] tracking-widest font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                      Live Demo
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-extrabold text-black/90 group-hover:text-[#000080] transition-colors leading-tight">
                  {proj.title}
                </h3>
                
                <h4 className="font-display text-[11px] font-bold text-black/50 uppercase leading-snug">
                  {proj.subtitle}
                </h4>

                <p className="text-black/75 text-xs md:text-sm leading-relaxed font-medium">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="text-[9px] tracking-widest font-extrabold bg-black/5 px-2.5 py-0.5 rounded-full border border-black/5 text-black/60 uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-black/5 pt-5">
                {selectedProject === proj.id ? (
                  <div className="bg-black/5 rounded-xl p-4 flex flex-col gap-2.5 animate-fade-in">
                    <h5 className="font-display text-[10px] tracking-widest font-extrabold text-black/40 uppercase">Key Features</h5>
                    <ul className="flex flex-col gap-2">
                      {proj.details.map((detail, dIdx) => (
                        <li key={dIdx} className="text-xs text-black/75 leading-relaxed font-medium flex items-start gap-1.5">
                          <span className="text-[#000080]">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setSelectedProject(null)} 
                      className="text-center font-display text-[10px] tracking-widest font-extrabold text-[#000080] mt-2 uppercase"
                    >
                      Hide Features
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setSelectedProject(proj.id)}
                    className="flex items-center justify-between font-display text-[10px] tracking-widest font-extrabold text-black/70 hover:text-[#000080] transition-colors uppercase py-1"
                  >
                    <span>View Key System Architecture</span>
                    <ArrowRight size={14} />
                  </button>
                )}

                <div className="flex items-center gap-2 mt-1">
                  {proj.githubUrl && (
                    <a 
                      href={proj.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-black/10 rounded-xl hover:border-black/30 text-black/70 hover:text-black font-display text-[10px] tracking-widest font-extrabold uppercase transition-all duration-300"
                    >
                      <Github size={12} /> REPOSITORY
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a 
                      href={proj.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-black hover:bg-[#000080] text-white font-display text-[10px] tracking-widest font-extrabold rounded-xl uppercase transition-all duration-300 shadow-md shadow-black/5"
                    >
                      <ExternalLink size={12} /> LIVE DEMO
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
