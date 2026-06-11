import React, { useState } from 'react';
import { Award, Briefcase, Calendar, GraduationCap, Mail, Phone, UserCheck, Copy, Check, MapPin } from 'lucide-react';
import LiveRadarHub from '../components/LiveRadarHub';

export default function About({ settings, education, experience, references }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
        <div className="flex flex-col gap-3 apple-reveal select-none">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#6D8196]" />
            <span className="font-display text-xs tracking-widest font-extrabold text-[#6D8196]">01 / HISTORY</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight uppercase text-black/90">
            PROFILE & EDUCATION
          </h1>
        </div>

        {/* Core Profile Narrative Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-xl shadow-black/5 flex flex-col lg:flex-row gap-10 items-start hover:border-black/10 transition-all duration-300 apple-reveal delay-100">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <h3 className="font-display text-2xl font-extrabold text-black/80 flex items-center gap-2 tracking-tight">
              <UserCheck className="text-[#000080]" size={24} />
              Professional Background
            </h3>
            <p className="text-black/75 text-sm md:text-base leading-relaxed font-medium">
              {settings.bio || 'Ambitious Software Engineering student specialized in full-stack MERN and Deep Learning projects.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-t border-black/5 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-[#000080]">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-widest font-extrabold text-black/35 uppercase font-display">EMAIL</span>
                  <span className="text-xs md:text-sm font-bold text-black/85">{settings.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-[#000080]">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-widest font-extrabold text-black/35 uppercase font-display">PHONE</span>
                  <span className="text-xs md:text-sm font-bold text-black/85">{settings.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-4 bg-white border border-black/5 rounded-2xl p-6">
            <h4 className="font-display text-sm tracking-widest font-extrabold text-black/70 uppercase">
              Key Focus Areas
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-black/60 font-semibold tracking-wide uppercase">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
                Deep Learning & Computer Vision
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
                Full-Stack Web Architectures
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
                Automated Software Testing
              </li>
            </ul>
          </div>
        </div>

        {/* Timelines and References Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Education Timeline (Left 7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8 apple-reveal">
            <h3 className="font-display text-xl font-black text-black/80 flex items-center gap-2 uppercase tracking-wide">
              <GraduationCap className="text-[#000080]" size={24} />
              Academic History
            </h3>

            <div className="flex flex-col border-l border-black/10 pl-6 gap-8 ml-2 relative">
              {education && education.map((edu, idx) => (
                <div key={edu.id || idx} className={`relative flex flex-col gap-2.5 group apple-reveal delay-${Math.min((idx + 1) * 100, 500)}`}>
                  {/* Timeline Bullet */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#FFFAFA] border-2 border-[#6D8196] group-hover:bg-[#000080] group-hover:border-[#000080] transition-colors duration-300" />
                  
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-[10px] tracking-widest font-extrabold text-[#000080] bg-[#ADD8E6]/30 px-2 py-0.5 rounded-full uppercase">
                      {edu.period}
                    </span>
                  </div>
                  
                  <h4 className="font-display text-lg font-extrabold text-black/90 group-hover:text-[#000080] transition-colors duration-300 leading-snug">
                    {edu.degree}
                  </h4>
                  
                  <h5 className="font-display text-xs tracking-wide font-bold text-black/50">
                    {edu.institution}
                  </h5>

                  <p className="text-xs text-black/60 leading-relaxed font-medium max-w-xl">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* References Grid (Right 5 cols) */}
          <div id="testimonials" className="lg:col-span-5 flex flex-col gap-8 scroll-mt-24 apple-reveal delay-200">
            <h3 className="font-display text-xl font-black text-black/80 flex items-center gap-2 uppercase tracking-wide">
              <Award className="text-[#000080]" size={22} />
              Professional References
            </h3>

            <div className="flex flex-col gap-6">
              {references && references.map((ref, idx) => (
                <div key={ref.id || idx} className={`glass-panel rounded-2xl p-6 flex flex-col justify-between gap-4 hover:shadow-lg transition-all duration-300 apple-reveal delay-${Math.min((idx + 1) * 100, 500)}`}>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-display text-base font-extrabold text-black/90 tracking-tight leading-tight">
                      {ref.name}
                    </h4>
                    <p className="text-xs text-black/50 font-semibold tracking-wide">
                      {ref.title}, {ref.organization}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-black/5">
                    {ref.email && (
                      <div className="flex items-center justify-between text-xs text-black/60 bg-black/5 rounded-lg px-3 py-2">
                        <span className="font-semibold truncate">{ref.email}</span>
                        <button
                          onClick={() => copyToClipboard(ref.email, idx)}
                          className="text-[#000080] hover:text-[#6D8196] transition-colors pl-2"
                        >
                          {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    )}
                    {ref.phone && (
                      <div className="flex items-center justify-between text-xs text-[#000080] font-bold px-3 py-1 font-display tracking-widest uppercase">
                        <span>PHONE: {ref.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Brand New Dedicated Work Experience Section */}
        {experience && experience.length > 0 && (
          <div className="flex flex-col gap-8 border-t border-black/5 pt-12 mt-4 select-none apple-reveal">
            <h3 className="font-display text-xl font-black text-black/80 flex items-center gap-2 uppercase tracking-wide">
              <Briefcase className="text-[#000080]" size={24} />
              Work Experience
            </h3>

            <div className="flex flex-col border-l border-black/10 pl-6 gap-8 ml-2 relative mt-2">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className={`relative flex flex-col gap-3 group glass-panel rounded-2xl p-6 md:p-8 hover:shadow-lg hover:border-[#000080]/30 transition-all duration-300 apple-reveal delay-${Math.min((idx + 1) * 100, 500)}`}>
                  {/* Styled Node rings from mockup */}
                  <div className={`absolute -left-[31px] top-8 w-3.5 h-3.5 rounded-full bg-[#FFFAFA] border-2 ${exp.type === 'Internship' ? 'border-sky-400' : 'border-purple-400'} group-hover:scale-125 transition-transform duration-300`} />
                  
                  {/* Top card row */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-display text-[9px] tracking-widest font-extrabold text-black/40 uppercase">
                        {exp.period}
                      </span>
                      <h4 className="font-display text-xl font-extrabold text-black/90 group-hover:text-[#000080] transition-colors duration-300 leading-snug">
                        {exp.role}
                      </h4>
                      <h5 className="font-display text-sm tracking-wide font-extrabold text-[#6D8196] uppercase">
                        {exp.company}
                      </h5>
                    </div>

                    <span className={`self-start font-display text-[9px] tracking-widest font-extrabold px-3 py-1 rounded-full uppercase ${exp.type === 'Internship' ? 'text-sky-500 bg-sky-50 border border-sky-100' : 'text-purple-500 bg-purple-50 border border-purple-100'}`}>
                      {exp.type}
                    </span>
                  </div>

                  {/* Location label */}
                  <div className="flex items-center gap-1.5 text-xs text-black/45 font-semibold tracking-wide uppercase">
                    <MapPin size={13} className="text-[#6D8196]" />
                    <span>{exp.location}</span>
                  </div>

                  {/* Details with Arrow bullets */}
                  <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-black/5">
                    {exp.details && exp.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-black/60 font-semibold leading-relaxed">
                        <span className="text-[#6D8196] font-bold text-sm shrink-0 leading-none">▷</span>
                        <p>{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature 3: Live Infrastructure Radar Hub */}
        <div className="mt-12">
          <LiveRadarHub />
        </div>

      </div>

    </div>
  );
}
