import React, { useState, useEffect } from 'react';
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
  Workflow,
  Sparkles,
  Lock,
  Globe,
  Radio,
  CheckCircle2
} from 'lucide-react';

interface ArchitectureNode {
  id: 'core' | 'db' | 'pipeline' | 'security' | 'edge';
  name: string;
  metric: string;
  category: string;
  shortDesc: string;
  detail: string;
  badge: string;
  color: string;
  accentColor: string;
  icon: React.ComponentType<{ className?: string }>;
  coords: { x: number; y: number }; // In SVG 520x340 coordinate space
  percentCoords: { left: string; top: string };
  telemetry: {
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
    stat4Label: string;
    stat4Value: string;
  };
}

export const HeroFuturisticVisual: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('core');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(media.matches);
      const listener = () => setReducedMotion(media.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  const nodes: ArchitectureNode[] = [
    {
      id: 'core',
      name: 'AI Engineering Core',
      metric: 'Multimodal Engine',
      category: 'CENTRAL INTELLIGENCE',
      badge: 'GEMINI 2.5 READY',
      shortDesc: 'Gemini Models + Custom Domain Workflows',
      detail:
        'Central multimodal reasoning orchestrator executing bilingual Tamil/English intent recognition, structured schema extraction, and automated workflow triggers.',
      color: '#00D4FF',
      accentColor: '#416F98',
      icon: Cpu,
      coords: { x: 260, y: 162 },
      percentCoords: { left: '50%', top: '48%' },
      telemetry: {
        stat1Label: 'Throughput',
        stat1Value: '1,840 req/min',
        stat2Label: 'Model Latency',
        stat2Value: '280 ms',
        stat3Label: 'Intent Accuracy',
        stat3Value: '99.8%',
        stat4Label: 'Engine State',
        stat4Value: 'OPERATIONAL'
      }
    },
    {
      id: 'db',
      name: 'Cloud Data Mesh',
      metric: 'Enterprise SLA',
      category: 'PERSISTENCE LAYER',
      badge: '99.99% UPTIME',
      shortDesc: 'Cloud Firestore & Relational Clusters',
      detail:
        'Distributed cloud database mesh integrating multi-region Firestore persistence and relational PostgreSQL models with sub-second replication and automated backup snapshots.',
      color: '#315D82',
      accentColor: '#6F9FC5',
      icon: Database,
      coords: { x: 104, y: 75 },
      percentCoords: { left: '20%', top: '22%' },
      telemetry: {
        stat1Label: 'Cluster State',
        stat1Value: '3x Replicas Synced',
        stat2Label: 'Read/Write Ops',
        stat2Value: '4.8k IOPS',
        stat3Label: 'SLA Guarantee',
        stat3Value: '99.99%',
        stat4Label: 'Security',
        stat4Value: 'AES-256'
      }
    },
    {
      id: 'pipeline',
      name: 'Event Pipeline',
      metric: 'Real-time Queue',
      category: 'STREAMING DISPATCH',
      badge: '0 MS DELAY',
      shortDesc: 'Asynchronous Webhooks & Lead Processing',
      detail:
        'Zero-latency pub/sub message pipeline that converts incoming web forms and instant quotes into real-time WhatsApp dispatches and sales notifications.',
      color: '#416F98',
      accentColor: '#00D4FF',
      icon: Workflow,
      coords: { x: 416, y: 75 },
      percentCoords: { left: '80%', top: '22%' },
      telemetry: {
        stat1Label: 'Queue Health',
        stat1Value: '0 Backlog',
        stat2Label: 'Event Rate',
        stat2Value: '520 evt/sec',
        stat3Label: 'Delivery Time',
        stat3Value: '<120 ms',
        stat4Label: 'Protocol',
        stat4Value: 'gRPC/Webhook'
      }
    },
    {
      id: 'security',
      name: 'Security Gateway',
      metric: 'Role-Based RBAC',
      category: 'GOVERNANCE & TRUST',
      badge: 'STRICT RBAC',
      shortDesc: 'Encrypted Sessions & Audit Trail Logging',
      detail:
        'Zero-trust gateway enforcing role-based permissions (Admin, Sales, Dispatch), cryptographic token validation, and immutable audit logs.',
      color: '#315D82',
      accentColor: '#00D4FF',
      icon: ShieldCheck,
      coords: { x: 114, y: 265 },
      percentCoords: { left: '22%', top: '78%' },
      telemetry: {
        stat1Label: 'Security Level',
        stat1Value: 'Tier-1 RBAC',
        stat2Label: 'Cipher Suite',
        stat2Value: 'TLS 1.3 / GCM',
        stat3Label: 'Audit Pipeline',
        stat3Value: '100% Tracked',
        stat4Label: 'Firewall',
        stat4Value: 'ENFORCED'
      }
    },
    {
      id: 'edge',
      name: 'Edge Delivery',
      metric: 'CDN Routing',
      category: 'GLOBAL DISTRIBUTION',
      badge: '<15 MS TTFB',
      shortDesc: 'Fast Response & Mobile-First Performance',
      detail:
        'Geo-distributed edge cache network delivering sub-15ms Time To First Byte (TTFB) across Tamil Nadu and all major Indian network nodes.',
      color: '#6F9FC5',
      accentColor: '#315D82',
      icon: Server,
      coords: { x: 406, y: 265 },
      percentCoords: { left: '78%', top: '78%' },
      telemetry: {
        stat1Label: 'Edge Coverage',
        stat1Value: '310+ Nodes',
        stat2Label: 'Cache Hit Rate',
        stat2Value: '94.6%',
        stat3Label: 'Response Time',
        stat3Value: '12 ms avg',
        stat4Label: 'Protocol',
        stat4Value: 'HTTP/3 Quic'
      }
    }
  ];

  const currentNode = nodes.find((n) => n.id === (hoveredNodeId || activeNodeId)) || nodes[0];

  return (
    <div className="relative w-full max-w-xl mx-auto py-2 select-none group/container">
      {/* Outer Ambient Glow Halo */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#315D82]/20 via-[#00D4FF]/10 to-[#315D82]/20 blur-xl opacity-60 group-hover/container:opacity-90 transition-opacity duration-500 pointer-events-none" />

      {/* Main Console Frame */}
      <div className="relative rounded-2xl border border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] shadow-sm hover:shadow-md overflow-hidden transition-all duration-300">
        
        {/* ============================================================== */}
        {/* 1. TOP TERMINAL HEADER BAR WITH CONTINUOUS OPERATIONAL PULSE   */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] transition-colors gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5DEE8] dark:bg-[#30445B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5DEE8]/60 dark:bg-[#30445B]/60" />
            </div>
            <span className="ml-1 sm:ml-2 font-mono text-[10px] sm:text-[11px] text-[#526477] dark:text-[#B8C5D4] tracking-wide flex items-center gap-1 truncate">
              <Terminal className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5] shrink-0" />
              <span className="hidden sm:inline">rtp.systems/</span>
              <span className="truncate">architecture-mesh</span>
            </span>
          </div>

          {/* Animated Operational Status Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[9px] sm:text-[10px] text-[#315D82] dark:text-[#6F9FC5] bg-[#E9EEF3] dark:bg-[#101B2C] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-[#D5DEE8] dark:border-[#30445B] shadow-2xs shrink-0">
            <span className="relative flex h-2 w-2">
              {!reducedMotion && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold tracking-wider">
              OPERATIONAL <span className="hidden sm:inline">· ap-south-1</span>
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. TOPOLOGY CANVAS (SVG + INTERACTIVE NODES & DATA STREAM)    */}
        {/* ============================================================== */}
        <div className="relative h-80 sm:h-88 w-full p-4 overflow-hidden bg-[#F2F5F8]/70 dark:bg-[#101B2C]/90">
          
          {/* Subtle Cyber Grid Background */}
          <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30" />

          {/* Pure SVG Animated Data Connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 520 340"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Glow filter for connection beams and particles */}
              <filter id="rtp-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Subtle Interconnect Arcs between lateral systems */}
            <path
              d="M 104 75 Q 260 15 416 75"
              fill="none"
              stroke="rgba(111, 159, 197, 0.22)"
              strokeWidth="1.2"
              strokeDasharray="3 4"
            />
            <path
              d="M 114 265 Q 260 325 406 265"
              fill="none"
              stroke="rgba(111, 159, 197, 0.22)"
              strokeWidth="1.2"
              strokeDasharray="3 4"
            />

            {/* Base Structural Radial Connections */}
            {/* 1. Core to Cloud Data Mesh (top-left) */}
            <path
              id="path-core-db"
              d="M 260 162 L 104 75"
              fill="none"
              stroke={hoveredNodeId === 'db' || activeNodeId === 'db' ? '#00D4FF' : 'rgba(111, 159, 197, 0.35)'}
              strokeWidth={hoveredNodeId === 'db' || activeNodeId === 'db' ? '2.5' : '1.5'}
              strokeDasharray={hoveredNodeId === 'db' ? 'none' : '4 4'}
              className="transition-all duration-300"
            />
            {/* 2. Core to Event Pipeline (top-right) */}
            <path
              id="path-core-pipeline"
              d="M 260 162 L 416 75"
              fill="none"
              stroke={hoveredNodeId === 'pipeline' || activeNodeId === 'pipeline' ? '#00D4FF' : 'rgba(111, 159, 197, 0.35)'}
              strokeWidth={hoveredNodeId === 'pipeline' || activeNodeId === 'pipeline' ? '2.5' : '1.5'}
              strokeDasharray={hoveredNodeId === 'pipeline' ? 'none' : '4 4'}
              className="transition-all duration-300"
            />
            {/* 3. Core to Security Gateway (bottom-left) */}
            <path
              id="path-core-security"
              d="M 260 162 L 114 265"
              fill="none"
              stroke={hoveredNodeId === 'security' || activeNodeId === 'security' ? '#00D4FF' : 'rgba(111, 159, 197, 0.35)'}
              strokeWidth={hoveredNodeId === 'security' || activeNodeId === 'security' ? '2.5' : '1.5'}
              strokeDasharray={hoveredNodeId === 'security' ? 'none' : '4 4'}
              className="transition-all duration-300"
            />
            {/* 4. Core to Edge Delivery (bottom-right) */}
            <path
              id="path-core-edge"
              d="M 260 162 L 406 265"
              fill="none"
              stroke={hoveredNodeId === 'edge' || activeNodeId === 'edge' ? '#00D4FF' : 'rgba(111, 159, 197, 0.35)'}
              strokeWidth={hoveredNodeId === 'edge' || activeNodeId === 'edge' ? '2.5' : '1.5'}
              strokeDasharray={hoveredNodeId === 'edge' ? 'none' : '4 4'}
              className="transition-all duration-300"
            />

            {/* ======================================================= */}
            {/* CONTINUOUS ANIMATED DATA PARTICLES & PULSE RINGS       */}
            {/* ======================================================= */}
            {!reducedMotion && (
              <>
                {/* Central AI Core Expanding Concentric Energy Rings */}
                <circle cx="260" cy="162" r="32" fill="none" stroke="#00D4FF" strokeWidth="1.5">
                  <animate attributeName="r" values="32;72" dur="3.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.75;0" dur="3.2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-width" values="1.5;0.3" dur="3.2s" repeatCount="indefinite" />
                </circle>

                <circle cx="260" cy="162" r="32" fill="none" stroke="#416F98" strokeWidth="1.2">
                  <animate attributeName="r" values="32;72" dur="3.2s" begin="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0" dur="3.2s" begin="1.6s" repeatCount="indefinite" />
                  <animate attributeName="stroke-width" values="1.2;0.3" dur="3.2s" begin="1.6s" repeatCount="indefinite" />
                </circle>

                {/* Rotating Tech Circuit Halo around Core */}
                <circle
                  cx="260"
                  cy="162"
                  r="42"
                  fill="none"
                  stroke="rgba(0, 212, 255, 0.4)"
                  strokeWidth="1"
                  strokeDasharray="6 8"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 260 162"
                    to="360 260 162"
                    dur="18s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* ---------------------------------------------------- */}
                {/* 1. PARTICLES: Core -> Cloud Data Mesh (top-left)    */}
                {/* ---------------------------------------------------- */}
                <circle r="3.5" fill="#00D4FF" filter="url(#rtp-glow)">
                  <animateMotion
                    path="M 260 162 L 104 75"
                    dur={hoveredNodeId === 'db' ? '1.2s' : '2.6s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.2;1;0.9;0.1"
                    dur={hoveredNodeId === 'db' ? '1.2s' : '2.6s'}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="2.2" fill="#6F9FC5">
                  <animateMotion
                    path="M 260 162 L 104 75"
                    dur={hoveredNodeId === 'db' ? '1.2s' : '2.6s'}
                    begin={hoveredNodeId === 'db' ? '0.6s' : '1.3s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.1;0.8;0.7;0"
                    dur={hoveredNodeId === 'db' ? '1.2s' : '2.6s'}
                    begin={hoveredNodeId === 'db' ? '0.6s' : '1.3s'}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* ---------------------------------------------------- */}
                {/* 2. PARTICLES: Core -> Event Pipeline (top-right)    */}
                {/* ---------------------------------------------------- */}
                <circle r="3.5" fill="#00D4FF" filter="url(#rtp-glow)">
                  <animateMotion
                    path="M 260 162 L 416 75"
                    dur={hoveredNodeId === 'pipeline' ? '1.1s' : '2.4s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.2;1;0.9;0.1"
                    dur={hoveredNodeId === 'pipeline' ? '1.1s' : '2.4s'}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="2.2" fill="#6F9FC5">
                  <animateMotion
                    path="M 260 162 L 416 75"
                    dur={hoveredNodeId === 'pipeline' ? '1.1s' : '2.4s'}
                    begin={hoveredNodeId === 'pipeline' ? '0.55s' : '1.2s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.1;0.8;0.7;0"
                    dur={hoveredNodeId === 'pipeline' ? '1.1s' : '2.4s'}
                    begin={hoveredNodeId === 'pipeline' ? '0.55s' : '1.2s'}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* ---------------------------------------------------- */}
                {/* 3. PARTICLES: Core -> Security Gateway (bottom-left) */}
                {/* ---------------------------------------------------- */}
                <circle r="3.5" fill="#00D4FF" filter="url(#rtp-glow)">
                  <animateMotion
                    path="M 260 162 L 114 265"
                    dur={hoveredNodeId === 'security' ? '1.2s' : '2.7s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.2;1;0.9;0.1"
                    dur={hoveredNodeId === 'security' ? '1.2s' : '2.7s'}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="2.2" fill="#6F9FC5">
                  <animateMotion
                    path="M 260 162 L 114 265"
                    dur={hoveredNodeId === 'security' ? '1.2s' : '2.7s'}
                    begin={hoveredNodeId === 'security' ? '0.6s' : '1.35s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.1;0.8;0.7;0"
                    dur={hoveredNodeId === 'security' ? '1.2s' : '2.7s'}
                    begin={hoveredNodeId === 'security' ? '0.6s' : '1.35s'}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* ---------------------------------------------------- */}
                {/* 4. PARTICLES: Core -> Edge Delivery (bottom-right)  */}
                {/* ---------------------------------------------------- */}
                <circle r="3.5" fill="#00D4FF" filter="url(#rtp-glow)">
                  <animateMotion
                    path="M 260 162 L 406 265"
                    dur={hoveredNodeId === 'edge' ? '1.2s' : '2.5s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.2;1;0.9;0.1"
                    dur={hoveredNodeId === 'edge' ? '1.2s' : '2.5s'}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="2.2" fill="#6F9FC5">
                  <animateMotion
                    path="M 260 162 L 406 265"
                    dur={hoveredNodeId === 'edge' ? '1.2s' : '2.5s'}
                    begin={hoveredNodeId === 'edge' ? '0.6s' : '1.25s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.1;0.8;0.7;0"
                    dur={hoveredNodeId === 'edge' ? '1.2s' : '2.5s'}
                    begin={hoveredNodeId === 'edge' ? '0.6s' : '1.25s'}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Lateral event signal travelling between top nodes */}
                <circle r="2.5" fill="#416F98" opacity="0.65">
                  <animateMotion
                    path="M 104 75 Q 260 15 416 75"
                    dur="4.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.7;0.7;0"
                    dur="4.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}
          </svg>

          {/* ============================================================== */}
          {/* 3. INTERACTIVE NODES OVERLAY WITH DEDICATED MICRO-ANIMATIONS  */}
          {/* ============================================================== */}
          {nodes.map((node) => {
            const isCenter = node.id === 'core';
            const isSelected = activeNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isHighlighted = isSelected || isHovered;
            const Icon = node.icon;

            return (
              <div
                key={node.id}
                onClick={() => {
                  setActiveNodeId(node.id);
                  setHoveredNodeId(null);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 ${
                  isHighlighted ? 'scale-105 z-30' : 'hover:scale-102'
                }`}
                style={{ left: node.percentCoords.left, top: node.percentCoords.top }}
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${node.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveNodeId(node.id);
                  }
                }}
              >
                {/* Tooltip on Hover / Touch */}
                {isHovered && (
                  <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#101B2C] text-white border border-[#00D4FF]/40 text-[10px] font-mono whitespace-nowrap shadow-lg pointer-events-none z-40 animate-in fade-in zoom-in-95 duration-150">
                    <span className="text-[#00D4FF] font-semibold">{node.badge}</span> · Click to inspect
                  </div>
                )}

                {/* Node Box Surface */}
                <div
                  className={`relative flex items-center justify-center rounded-xl transition-all duration-300 mx-auto ${
                    isCenter
                      ? `w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-[#1C2B40] border-2 shadow-sm ${
                          isHighlighted
                            ? 'border-[#00D4FF] shadow-[0_0_24px_rgba(0,212,255,0.45)] ring-2 ring-[#00D4FF]/30'
                            : 'border-[#315D82] dark:border-[#6F9FC5] shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                        }`
                      : `w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-[#1C2B40] border shadow-xs ${
                          isHighlighted
                            ? 'border-[#00D4FF] dark:border-[#00D4FF] shadow-[0_0_18px_rgba(0,212,255,0.35)] ring-2 ring-[#00D4FF]/25'
                            : 'border-[#D5DEE8] dark:border-[#30445B] hover:border-[#315D82] dark:hover:border-[#6F9FC5]'
                        }`
                  }`}
                >
                  {/* Central Node Continuous Breathing Halo */}
                  {isCenter && !reducedMotion && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#00D4FF]/10 via-[#315D82]/15 to-[#00D4FF]/20 animate-pulse pointer-events-none" />
                  )}

                  {/* Icon with Domain-Specific Animation */}
                  <Icon
                    className={`transition-all duration-300 ${
                      isCenter
                        ? `w-6 h-6 sm:w-7 sm:h-7 ${
                            isHighlighted
                              ? 'text-[#00D4FF] drop-shadow-[0_0_8px_rgba(0,212,255,0.7)] scale-110'
                              : 'text-[#315D82] dark:text-[#6F9FC5]'
                          }`
                        : `w-4 h-4 sm:w-5 sm:h-5 ${
                            isHighlighted
                              ? 'text-[#00D4FF] dark:text-[#00D4FF] drop-shadow-[0_0_6px_rgba(0,212,255,0.6)]'
                              : 'text-[#526477] dark:text-[#B8C5D4]'
                          }`
                    }`}
                  />

                  {/* Micro Activity Indicators per Component */}
                  {/* Node 1: Cloud Data Mesh (Database activity bars) */}
                  {node.id === 'db' && (
                    <span className="absolute -top-1 -right-1 flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#315D82] animate-pulse [animation-delay:0.3s]" />
                    </span>
                  )}

                  {/* Node 2: Event Pipeline (Queue pulse dot) */}
                  {node.id === 'pipeline' && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF]" />
                    </span>
                  )}

                  {/* Node 3: Security Gateway (Shield check dot) */}
                  {node.id === 'security' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#315D82] dark:bg-[#6F9FC5] border border-white dark:border-[#101B2C]" />
                  )}

                  {/* Node 4: Edge Delivery (CDN broadcast ring) */}
                  {node.id === 'edge' && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6F9FC5]" />
                    </span>
                  )}

                  {/* Central Core status gem */}
                  {isCenter && (
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00D4FF] border-2 border-white dark:border-[#1C2B40] shadow-[0_0_8px_#00D4FF]" />
                  )}
                </div>

                {/* Node Label Text */}
                <div className="mt-1 text-center whitespace-nowrap">
                  <span
                    className={`block text-[10px] font-mono transition-colors duration-200 ${
                      isHighlighted
                        ? 'text-[#00D4FF] dark:text-[#00D4FF] font-bold'
                        : 'text-[#182638] dark:text-[#F1F5F9] font-medium'
                    }`}
                  >
                    {node.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono transition-colors duration-200 ${
                      isHighlighted
                        ? 'text-[#315D82] dark:text-[#B8C5D4] font-medium'
                        : 'text-[#526477] dark:text-[#B8C5D4]'
                    }`}
                  >
                    {node.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 4. SELECTED SUBSYSTEM TELEMETRY & LIVE INFRASTRUCTURE METRICS  */}
        {/* ============================================================== */}
        <div className="p-3.5 sm:p-4 bg-[#F2F5F8] dark:bg-[#17263A] border-t border-[#D5DEE8] dark:border-[#30445B] transition-colors">
          
          {/* Active Node Primary Description Bar */}
          <div className="flex items-center justify-between gap-3 text-xs pb-3 border-b border-[#D5DEE8]/60 dark:border-[#30445B]/60">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#E9EEF3] dark:bg-[#101B2C] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#00D4FF] shrink-0 shadow-2xs">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[#182638] dark:text-[#F1F5F9] flex items-center gap-2 flex-wrap">
                  <span className="truncate">{currentNode.name}</span>
                  <span className="text-[10px] font-mono text-[#00D4FF] bg-[#101B2C] dark:bg-[#101B2C] px-1.5 py-0.5 rounded border border-[#00D4FF]/30 font-medium">
                    {currentNode.metric}
                  </span>
                  <span className="text-[9px] font-mono text-[#526477] dark:text-[#B8C5D4] hidden md:inline-block">
                    {currentNode.category}
                  </span>
                </div>
                <div className="text-[11px] text-[#526477] dark:text-[#B8C5D4] mt-0.5 line-clamp-1">
                  {currentNode.detail}
                </div>
              </div>
            </div>

            {/* Verified Badge */}
            <div className="hidden sm:flex flex-col items-end shrink-0 text-right font-mono text-[10px] text-[#526477] dark:text-[#B8C5D4]">
              <span className="text-[#8A9CAE]">INFRASTRUCTURE</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                VERIFIED
              </span>
            </div>
          </div>

          {/* Real-time Subsystem Telemetry Grid */}
          <div className="mt-2.5 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
            <div className="px-2 py-1 rounded-md bg-white dark:bg-[#101B2C] border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[#8A9CAE] block text-[9px]">{currentNode.telemetry.stat1Label}</span>
              <span className="font-semibold text-[#182638] dark:text-[#F1F5F9] tabular-nums">
                {currentNode.telemetry.stat1Value}
              </span>
            </div>

            <div className="px-2 py-1 rounded-md bg-white dark:bg-[#101B2C] border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[#8A9CAE] block text-[9px]">{currentNode.telemetry.stat2Label}</span>
              <span className="font-semibold text-[#00D4FF] tabular-nums">
                {currentNode.telemetry.stat2Value}
              </span>
            </div>

            <div className="px-2 py-1 rounded-md bg-white dark:bg-[#101B2C] border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[#8A9CAE] block text-[9px]">{currentNode.telemetry.stat3Label}</span>
              <span className="font-semibold text-[#182638] dark:text-[#F1F5F9] tabular-nums">
                {currentNode.telemetry.stat3Value}
              </span>
            </div>

            <div className="px-2 py-1 rounded-md bg-white dark:bg-[#101B2C] border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[#8A9CAE] block text-[9px]">{currentNode.telemetry.stat4Label}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {currentNode.telemetry.stat4Value}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
