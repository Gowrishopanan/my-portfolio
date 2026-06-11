import React, { useState, useEffect, useRef } from 'react';

export default function LipLandmarks() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalized offset from the center (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setMouse({ x, y });
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setMouse({ x: 0, y: 0 });
    setHovered(false);
  };

  // Base coordinates for lip vertices (x, y percentages in a 200x120 viewport grid)
  const outerLipBase = [
    { id: 1, x: 20, y: 60, weight: 0.1 },   // Left Corner
    { id: 2, x: 50, y: 35, weight: 0.25 },  // Left Top Peak
    { id: 3, x: 75, y: 45, weight: 0.2 },   // Cupids bow dip
    { id: 4, x: 100, y: 35, weight: 0.25 }, // Right Top Peak
    { id: 5, x: 130, y: 60, weight: 0.1 },  // Right Corner
    { id: 6, x: 100, y: 85, weight: 0.3 },  // Right Bottom Center
    { id: 7, x: 75, y: 85, weight: 0.3 },   // Left Bottom Center
    { id: 8, x: 50, y: 80, weight: 0.2 },   // Left Bottom Outer
  ];

  const innerLipBase = [
    { id: 9, x: 35, y: 60, weight: 0.15 },  // Left Inner Corner
    { id: 10, x: 75, y: 55, weight: 0.22 }, // Top Inner Center
    { id: 11, x: 115, y: 60, weight: 0.15 }, // Right Inner Corner
    { id: 12, x: 75, y: 70, weight: 0.25 }, // Bottom Inner Center
  ];

  // Calculate dynamic positions based on mouse coordinates
  const getDynamicCoords = (nodes) => {
    return nodes.map(node => {
      // 3D Parallax offset based on mouse location and specific node flexibility weight
      const dx = mouse.x * 25 * node.weight;
      const dy = mouse.y * 20 * node.weight;
      
      return {
        id: node.id,
        x: node.x + dx,
        y: node.y + dy
      };
    });
  };

  const outerCoords = getDynamicCoords(outerLipBase);
  const innerCoords = getDynamicCoords(innerLipBase);

  // Helper to construct SVG Path string from coordinate coordinates
  const getClosedPathStr = (coords) => {
    if (coords.length === 0) return '';
    const start = coords[0];
    const path = coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
    return `M ${start.x} ${start.y} ${path} Z`;
  };

  const getOpenPathStr = (coords) => {
    if (coords.length === 0) return '';
    const start = coords[0];
    const path = coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
    return `M ${start.x} ${start.y} ${path}`;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-36 bg-black/40 rounded-2xl border border-white/15 flex items-center justify-center p-4 relative overflow-hidden select-none cursor-crosshair group hover:border-[#ADD8E6]/30 transition-all duration-500 shadow-inner"
    >
      {/* HUD Telemetry Labels */}
      <span className="absolute top-2.5 left-4 font-mono text-[7px] tracking-widest text-[#ADD8E6] font-bold uppercase select-none">
        DIAGNOSTIC: LIPREADAI_COORDS
      </span>
      <span className="absolute top-2.5 right-4 font-mono text-[7px] tracking-widest text-white/50 font-semibold uppercase">
        {hovered ? `DX: ${(mouse.x * 100).toFixed(1)}% | DY: ${(mouse.y * 100).toFixed(1)}%` : 'TELEMETRY: RESTING'}
      </span>
      <span className="absolute bottom-2.5 left-4 font-mono text-[7px] tracking-widest text-white/40 font-semibold select-none">
        NODES: 12 DETECTED
      </span>

      {/* SVG Face landmark diagram */}
      <svg 
        viewBox="0 0 150 120" 
        className="w-36 h-auto overflow-visible select-none pointer-events-none drop-shadow-sm"
      >
        {/* Outer Lip Connector Lines */}
        <path 
          d={getClosedPathStr(outerCoords)} 
          fill="rgba(173, 216, 230, 0.03)" 
          stroke="rgba(173, 216, 230, 0.25)" 
          strokeWidth="0.8" 
          strokeDasharray="2,2"
          className="transition-all duration-300 ease-out"
        />

        {/* Inner Lip Connector Lines */}
        <path 
          d={getClosedPathStr(innerCoords)} 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.15)" 
          strokeWidth="0.8"
          className="transition-all duration-300 ease-out"
        />

        {/* Outer Lip Node Circles */}
        {outerCoords.map(c => (
          <g key={`outer-grp-${c.id}`}>
            <circle 
              cx={c.x} 
              cy={c.y} 
              r="2" 
              className="fill-[#ADD8E6] opacity-90 transition-all duration-300 ease-out" 
            />
            <circle 
              cx={c.x} 
              cy={c.y} 
              r="4.5" 
              className="stroke-[#ADD8E6]/40 stroke-[0.5] fill-transparent animate-pulse transition-all duration-300 ease-out" 
            />
            {hovered && (
              <text 
                x={c.x + 3.5} 
                y={c.y + 2} 
                className="font-mono text-[4px] font-bold fill-white/50"
              >
                P_{c.id}
              </text>
            )}
          </g>
        ))}

        {/* Inner Lip Node Circles */}
        {innerCoords.map(c => (
          <g key={`inner-grp-${c.id}`}>
            <circle 
              cx={c.x} 
              cy={c.y} 
              r="1.8" 
              className="fill-white stroke-[#ADD8E6] stroke-[0.5] transition-all duration-300 ease-out" 
            />
            {hovered && (
              <text 
                x={c.x + 3} 
                y={c.y + 2} 
                className="font-mono text-[4px] font-bold fill-[#ADD8E6]"
              >
                P_{c.id}
              </text>
            )}
          </g>
        ))}

      </svg>
      
    </div>
  );
}
