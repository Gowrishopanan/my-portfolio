import React, { useState, useEffect } from 'react';
import { Radio, Database, ShieldAlert, Cpu } from 'lucide-react';

export default function LiveRadarHub() {
  const [latency, setLatency] = useState(14);
  const [threadCount, setThreadCount] = useState(48);

  // Simulate real-time server activity fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2ms to +2ms
        const next = prev + change;
        return next < 8 ? 8 : next > 22 ? 22 : next;
      });
      setThreadCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1 to +1 thread active
        const next = prev + change;
        return next < 40 ? 40 : next > 56 ? 56 : next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-black/5 hover:border-[#000080]/30 transition-all duration-500 apple-reveal">
      
      {/* LEFT: Sweeping Vector Radar Graphic */}
      <div className="relative w-44 h-44 shrink-0 bg-black/90 rounded-full border border-white/10 flex items-center justify-center overflow-hidden shadow-inner select-none">
        
        {/* Sweeping Radar Line */}
        <div className="absolute inset-0 origin-center animate-spin z-10" style={{ animationDuration: '4s', background: 'linear-gradient(90deg, transparent 50%, rgba(0, 0, 128, 0.4) 100%)' }} />
        
        {/* Radar Concentric Rings */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-[#000080]/20 border-dashed" />
        <div className="absolute w-[60%] h-[60%] rounded-full border border-[#000080]/15" />
        <div className="absolute w-[40%] h-[40%] rounded-full border border-[#000080]/10 border-dashed" />
        <div className="absolute w-[20%] h-[20%] rounded-full border border-[#000080]/5" />
        
        {/* Axis Lines */}
        <div className="absolute w-full h-[1px] bg-white/10" />
        <div className="absolute h-full w-[1px] bg-white/10" />
        
        {/* Pulsing Beacon Point on Colombo Coordinates */}
        <div className="absolute top-[42%] left-[58%] z-20 flex items-center justify-center select-none">
          <span className="absolute inline-flex h-4.5 w-4.5 rounded-full bg-[#000080]/60 animate-ping opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#000080]" />
        </div>

        {/* Pulse Beacon 2: remote db sharded server */}
        <div className="absolute top-[68%] left-[28%] z-20 flex items-center justify-center select-none opacity-50">
          <span className="absolute inline-flex h-3 w-3 rounded-full bg-[#ADD8E6]/60 animate-ping opacity-75" style={{ animationDelay: '1s' }} />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6D8196]" />
        </div>

        {/* Status indicator on radar screen */}
        <span className="absolute bottom-2 inset-x-0 text-center font-mono text-[8px] tracking-wider text-green-500 font-bold uppercase z-20">
          RADAR ACTIVE
        </span>
      </div>

      {/* RIGHT: Live Infrastructure telemetry parameters */}
      <div className="flex-grow flex flex-col justify-between h-full w-full gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[#000080]">
            <Radio size={16} className="animate-pulse" />
            <span className="font-display text-[10px] tracking-widest font-extrabold uppercase">LIVE INFRASTRUCTURE RADAR</span>
          </div>
          <h4 className="font-display text-lg font-black tracking-tight text-black/90 uppercase">
            GOWRI-NODE-01 INTERFACE STATUS
          </h4>
          <p className="text-black/60 text-xs md:text-sm font-medium leading-relaxed max-w-xl">
            Linked to local Sri Lankan and remote sharded server environments, verifying automated telemetry states and MongoDB clusters.
          </p>
        </div>

        {/* Diagnostic parameters subgrid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 border-t border-black/5 pt-5">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] tracking-widest font-extrabold text-black/35 uppercase flex items-center gap-1">
              <Radio size={10} className="text-[#6D8196]" /> LATENCY
            </span>
            <span className="font-mono text-sm font-bold text-black/85 flex items-center gap-1.5">
              {latency}ms <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] tracking-widest font-extrabold text-black/35 uppercase flex items-center gap-1">
              <Database size={10} className="text-[#6D8196]" /> DATABASE
            </span>
            <span className="font-display text-xs font-black text-[#000080] uppercase">
              MONGO_ATLAS
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] tracking-widest font-extrabold text-black/35 uppercase flex items-center gap-1">
              <Cpu size={10} className="text-[#6D8196]" /> POOL THREADS
            </span>
            <span className="font-mono text-sm font-bold text-black/85">
              {threadCount} active
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] tracking-widest font-extrabold text-black/35 uppercase flex items-center gap-1">
              <ShieldAlert size={10} className="text-[#6D8196]" /> SSL LINK
            </span>
            <span className="font-display text-xs font-black text-emerald-600 uppercase">
              100% SECURED
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
