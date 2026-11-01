import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Layers,
  Network,
  ShieldCheck,
  Zap,
  Activity,
  Server,
  Terminal,
  Workflow
} from 'lucide-react';

export const HeroFuturisticVisual: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('core');

  const nodes = [
    {
      id: 'core',
      name: 'AI Neural Core',
      metric: '4.2ms Inference',
      detail: 'Gemini Multimodal + Custom Fine-tuned Models',
      color: '#00D4FF',
      icon: Cpu,
      x: '50%',
      y: '48%'
    },
    {
      id: 'db',
      name: 'Cloud Data Mesh',
      metric: '99.999% SLA',
      detail: 'PostgreSQL & Real-time Firestore Clusters',
      color: '#356BFF',
      icon: Database,
      x: '18%',
      y: '24%'
    },
    {
      id: 'pipeline',
      name: 'Event Pipeline',
      metric: '50k msg/sec',
      detail: 'Zero-latency Webhooks & Multi-agent Queue',
      color: '#8057FF',
      icon: Workflow,
      x: '82%',
      y: '26%'
    },
    {
      id: 'security',
      name: 'SecOps Gateway',
      metric: 'Zero Trust',
      detail: 'mTLS, Role-based Access & AES-256 GCM',
      color: '#00E5A3',
      icon: ShieldCheck,
      x: '24%',
      y: '74%'
    },
    {
      id: 'edge',
      name: 'Global Edge CDN',
      metric: '18ms Global TTFB',
      detail: 'Cloudflare Enterprise Anywhere Acceleration',
      color: '#00D4FF',
      icon: Server,
      x: '76%',
      y: '72%'
    }
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto perspective-1200 py-4 select-none">
      {/* Outer Ambient Glow Ring */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-[#00D4FF]/15 via-[#356BFF]/10 to-[#8057FF]/15 rounded-3xl blur-2xl -z-10 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Main Glass Console Terminal */}
      <div className="relative rounded-2xl border border-blue-200 dark:border-[#00D4FF]/25 bg-white/95 dark:bg-[#070B18]/85 backdrop-blur-xl shadow-xl dark:shadow-2xl shadow-blue-900/10 dark:shadow-black/80 overflow-hidden transform-3d transition-transform duration-500 hover:rotate-y-2 hover:rotate-x-1">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-blue-100 dark:border-[#00D4FF]/15 bg-slate-100/90 dark:bg-[#0B1530]/90">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] dark:bg-[#00D4FF] animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] dark:bg-[#356BFF]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] dark:bg-[#8057FF]" />
            <span className="ml-2 font-mono text-[11px] text-[#334155] dark:text-[#CBD5E1] tracking-wide flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00D4FF]" />
              <span>rtp.infrastructure.mesh/topology</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-[#0284C7] dark:text-[#00D4FF] bg-blue-50 dark:bg-[#00D4FF]/10 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-[#00D4FF]/30">
            <Activity className="w-3 h-3 animate-spin text-[#0284C7] dark:text-[#00D4FF]" style={{ animationDuration: '6s' }} />
            <span>MESH ACTIVE · ap-south-1</span>
          </div>
        </div>

        {/* 3D Neural Topology Canvas */}
        <div className="relative h-80 sm:h-96 w-full p-4 overflow-hidden bg-gradient-to-b from-blue-50/80 via-slate-50 to-white dark:bg-radial dark:from-[#0B1530] dark:via-[#070B18] dark:to-[#050812]">
          
          {/* Technical Fine Grid Overlay */}
          <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />

          {/* Connected Circuit Network Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGrad1" x1="18%" y1="24%" x2="50%" y2="48%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="lineGrad2" x1="82%" y1="26%" x2="50%" y2="48%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="lineGrad3" x1="24%" y1="74%" x2="50%" y2="48%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="lineGrad4" x1="76%" y1="72%" x2="50%" y2="48%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Circuit paths connecting to Core Node */}
            <path d="M 90 85 L 260 170" stroke="url(#lineGrad1)" strokeWidth="1.5" strokeDasharray="4 6" className="animate-data-flow" />
            <path d="M 430 90 L 260 170" stroke="url(#lineGrad2)" strokeWidth="1.5" strokeDasharray="4 6" className="animate-data-flow" />
            <path d="M 120 270 L 260 170" stroke="url(#lineGrad3)" strokeWidth="1.5" strokeDasharray="4 6" className="animate-data-flow" />
            <path d="M 400 260 L 260 170" stroke="url(#lineGrad4)" strokeWidth="1.5" strokeDasharray="4 6" className="animate-data-flow" />
            
            {/* Outer perimeter cross-bus */}
            <path d="M 90 85 Q 260 30 430 90" stroke="rgba(37, 99, 235, 0.25)" strokeWidth="1" strokeDasharray="3 5" fill="none" />
            <path d="M 120 270 Q 260 320 400 260" stroke="rgba(2, 132, 199, 0.25)" strokeWidth="1" strokeDasharray="3 5" fill="none" />
          </svg>

          {/* Interactive Topology Nodes */}
          {nodes.map((node) => {
            const isSelected = activeNode === node.id;
            const Icon = node.icon;
            const isCenter = node.id === 'core';

            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-10"
                style={{ left: node.x, top: node.y }}
              >
                <div
                  className={`relative flex items-center justify-center rounded-xl transition-all duration-300 ${
                    isCenter
                      ? 'w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-[#070B18]/90 border-2 border-[#0284C7] dark:border-[#00D4FF] shadow-lg shadow-blue-500/20 dark:shadow-[#00D4FF]/30'
                      : 'w-11 h-11 sm:w-13 sm:h-13 bg-white/95 dark:bg-[#0B1530]/85 border border-blue-200 dark:border-[#356BFF]/40 hover:border-[#0284C7] dark:hover:border-[#00D4FF] shadow-xs dark:shadow-md dark:shadow-black/50'
                  } ${isSelected ? 'scale-110 ring-2 ring-[#0284C7]/50 dark:ring-[#00D4FF]/50 ring-offset-2 ring-offset-white dark:ring-offset-[#070B18]' : ''}`}
                >
                  <Icon
                    className={`${isCenter ? 'w-8 h-8 text-[#0284C7] dark:text-[#00D4FF]' : 'w-5 h-5 text-[#334155] dark:text-[#CBD5E1] group-hover:text-[#0284C7] dark:group-hover:text-[#00D4FF]'} transition-colors`}
                  />

                  {/* Pulsing beacon dot */}
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: node.color }}
                  />
                </div>

                {/* Node Label Chip */}
                <div className="mt-1.5 text-center whitespace-nowrap">
                  <span className="block text-[10px] sm:text-[11px] font-mono font-semibold text-[#0B1530] dark:text-white drop-shadow-xs">
                    {node.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#0284C7] dark:text-[#00D4FF] font-medium">
                    {node.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Subsystem Telemetry Card */}
        <div className="p-3.5 sm:p-4 bg-slate-50/95 dark:bg-[#0B1530]/95 border-t border-blue-100 dark:border-[#00D4FF]/15 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100/70 dark:bg-[#00D4FF]/10 border border-blue-200 dark:border-[#00D4FF]/30 flex items-center justify-center text-[#0284C7] dark:text-[#00D4FF] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-[#0B1530] dark:text-white flex items-center gap-2">
                <span>{nodes.find((n) => n.id === activeNode)?.name}</span>
                <span className="text-[10px] font-mono text-[#0284C7] dark:text-[#00D4FF] px-1.5 py-0.2 rounded bg-blue-100/60 dark:bg-[#00D4FF]/10">
                  {nodes.find((n) => n.id === activeNode)?.metric}
                </span>
              </div>
              <div className="text-[11px] text-[#475569] dark:text-[#CBD5E1] mt-0.5 line-clamp-1">
                {nodes.find((n) => n.id === activeNode)?.detail}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end shrink-0 text-right font-mono text-[10px] text-[#64748B] dark:text-[#8292AA]">
            <span>ENGINEERING SPEC</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% OPERATIONAL</span>
          </div>
        </div>

      </div>
    </div>
  );
};
