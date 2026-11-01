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
      name: 'AI Engineering Core',
      metric: 'Multimodal Engine',
      detail: 'Gemini Models + Custom Domain Workflows',
      color: '#416F98',
      icon: Cpu,
      x: '50%',
      y: '48%'
    },
    {
      id: 'db',
      name: 'Cloud Data Mesh',
      metric: 'Enterprise SLA',
      detail: 'Cloud Firestore & Relational Database Clusters',
      color: '#315D82',
      icon: Database,
      x: '18%',
      y: '24%'
    },
    {
      id: 'pipeline',
      name: 'Event Pipeline',
      metric: 'Real-time Queue',
      detail: 'Asynchronous Webhooks & Lead Processing',
      color: '#416F98',
      icon: Workflow,
      x: '82%',
      y: '26%'
    },
    {
      id: 'security',
      name: 'Security Gateway',
      metric: 'Role-Based RBAC',
      detail: 'Encrypted Sessions & Audit Trail Logging',
      color: '#315D82',
      icon: ShieldCheck,
      x: '24%',
      y: '74%'
    },
    {
      id: 'edge',
      name: 'Edge Delivery',
      metric: 'CDN Routing',
      detail: 'Fast Response & Mobile-First Performance',
      color: '#6F9FC5',
      icon: Server,
      x: '76%',
      y: '72%'
    }
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto py-2 select-none">
      {/* Console Frame */}
      <div className="relative rounded-2xl border border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] shadow-sm overflow-hidden transition-colors">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="ml-2 font-mono text-[11px] text-[#526477] dark:text-[#B8C5D4] tracking-wide flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
              <span>rtp.systems/architecture-mesh</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#315D82] dark:text-[#6F9FC5] bg-[#E9EEF3] dark:bg-[#101B2C] px-2.5 py-0.5 rounded-full border border-[#D5DEE8] dark:border-[#30445B]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>OPERATIONAL · ap-south-1</span>
          </div>
        </div>

        {/* Topology Canvas */}
        <div className="relative h-72 sm:h-80 w-full p-4 overflow-hidden bg-[#F2F5F8]/50 dark:bg-[#17263A]/70">
          
          {/* Subtle Grid */}
          <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30" />

          {/* Circuit Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 90 85 L 260 170" stroke="rgba(111, 159, 197, 0.45)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 430 90 L 260 170" stroke="rgba(111, 159, 197, 0.45)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 120 250 L 260 170" stroke="rgba(111, 159, 197, 0.45)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 400 240 L 260 170" stroke="rgba(111, 159, 197, 0.45)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 90 85 Q 260 30 430 90" stroke="rgba(111, 159, 197, 0.2)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
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
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group z-10"
                style={{ left: node.x, top: node.y }}
              >
                <div
                  className={`relative flex items-center justify-center rounded-xl transition-all ${
                    isCenter
                      ? 'w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-[#1C2B40] border-2 border-[#315D82] dark:border-[#6F9FC5] shadow-xs'
                      : 'w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] hover:border-[#315D82] dark:hover:border-[#6F9FC5] shadow-xs'
                  } ${isSelected ? 'ring-2 ring-[#315D82]/40 dark:ring-[#6F9FC5]/40' : ''}`}
                >
                  <Icon
                    className={`${isCenter ? 'w-6 h-6 sm:w-7 sm:h-7 text-[#315D82] dark:text-[#6F9FC5]' : 'w-4 h-4 sm:w-5 sm:h-5 text-[#526477] dark:text-[#B8C5D4] group-hover:text-[#315D82] dark:group-hover:text-[#6F9FC5]'} transition-colors`}
                  />
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: node.color }}
                  />
                </div>

                {/* Node Label */}
                <div className="mt-1 text-center whitespace-nowrap">
                  <span className="block text-[10px] font-mono font-medium text-[#182638] dark:text-[#F1F5F9]">
                    {node.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#526477] dark:text-[#B8C5D4]">
                    {node.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Subsystem Telemetry */}
        <div className="p-3.5 sm:p-4 bg-[#F2F5F8] dark:bg-[#17263A] border-t border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E9EEF3] dark:bg-[#101B2C] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-[#182638] dark:text-[#F1F5F9] flex items-center gap-2">
                <span>{nodes.find((n) => n.id === activeNode)?.name}</span>
                <span className="text-[10px] font-mono text-[#315D82] dark:text-[#6F9FC5] px-1.5 py-0.2 rounded bg-[#E9EEF3] dark:bg-[#101B2C]">
                  {nodes.find((n) => n.id === activeNode)?.metric}
                </span>
              </div>
              <div className="text-[11px] text-[#526477] dark:text-[#B8C5D4] mt-0.5 line-clamp-1">
                {nodes.find((n) => n.id === activeNode)?.detail}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end shrink-0 text-right font-mono text-[10px] text-[#526477] dark:text-[#B8C5D4]">
            <span>INFRASTRUCTURE</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">VERIFIED</span>
          </div>
        </div>

      </div>
    </div>
  );
};
