import { useState } from 'react';
import {
  BookOpen, Package, DollarSign, BarChart3, Bot, FileText,
  Zap, ChevronRight, ArrowUpRight, Lock, CheckCircle,
  Layers, Star, Target, TrendingUp, Briefcase, Globe,
  Play, Users, Cpu, Shield, Search,
} from 'lucide-react';

const ACCENT = '#10B981';

const CATEGORIES = [
  { key: 'all', label: 'All Resources', icon: Layers },
  { key: 'institutional', label: 'Institutional Systems', icon: Package },
  { key: 'campaign', label: 'Campaign Systems', icon: Target },
  { key: 'financial', label: 'Financial Infrastructure', icon: DollarSign },
  { key: 'growth', label: 'Growth Tools', icon: TrendingUp },
  { key: 'ai', label: 'AI Systems', icon: Bot },
  { key: 'templates', label: 'Templates & Playbooks', icon: FileText },
];

interface Resource {
  title: string;
  description: string;
  category: string;
  tag: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  access: 'open' | 'member' | 'premium';
  features: string[];
  cta: string;
}

const RESOURCES: Resource[] = [
  {
    title: 'Artist OS',
    description: 'Full artist business operating system. Manage releases, revenue, campaigns, team, and growth from one dashboard.',
    category: 'institutional',
    tag: 'Core System',
    color: ACCENT,
    icon: Star,
    access: 'member',
    features: ['Release planning', 'Revenue tracking', 'Campaign center', 'Team management', 'AI recommendations'],
    cta: 'Access System',
  },
  {
    title: 'Campaign Strategy Builder',
    description: 'Build, deploy, and measure marketing campaigns across platforms. AI-assisted targeting and creative planning.',
    category: 'campaign',
    tag: 'AI-Powered',
    color: '#3B82F6',
    icon: Target,
    access: 'member',
    features: ['Platform targeting', 'Budget optimization', 'Creative briefs', 'Performance tracking'],
    cta: 'Build Campaign',
  },
  {
    title: 'Revenue Intelligence Dashboard',
    description: 'Track and analyze all revenue streams — streaming, sync, merch, live. Understand where every dollar comes from.',
    category: 'financial',
    tag: 'Financial',
    color: '#F59E0B',
    icon: DollarSign,
    access: 'member',
    features: ['Multi-stream tracking', 'Trend analysis', 'Payout forecasting', 'Label comparisons'],
    cta: 'View Dashboard',
  },
  {
    title: 'Fan Growth Engine',
    description: 'Audience development playbooks designed for streaming growth, social conversion, and superfan cultivation.',
    category: 'growth',
    tag: 'Growth',
    color: ACCENT,
    icon: TrendingUp,
    access: 'open',
    features: ['Playlist strategy', 'Social growth tactics', 'Superfan funnels', 'Email list building'],
    cta: 'Start Growing',
  },
  {
    title: 'AI Coworkers Suite',
    description: 'A team of specialized AI agents trained on music industry workflows. Strategy, creative, ops, and analytics.',
    category: 'ai',
    tag: 'AI Suite',
    color: '#8B5CF6',
    icon: Bot,
    access: 'member',
    features: ['Strategy agents', 'Creative writing', 'Market research', 'Campaign briefs', 'A&R analysis'],
    cta: 'Meet Your Team',
  },
  {
    title: 'Release Planning System',
    description: 'End-to-end release workflow — from concept to delivery. Timelines, checklists, distributor prep, and promotion.',
    category: 'templates',
    tag: 'Template',
    color: '#EC4899',
    icon: FileText,
    access: 'open',
    features: ['12-week timeline', 'Platform checklists', 'Promo schedule', 'Budget planner'],
    cta: 'Download Template',
  },
  {
    title: 'Catalog OS',
    description: 'Institutional catalog management for labels and catalog owners. Rights, revenue, and reactivation strategy.',
    category: 'institutional',
    tag: 'Enterprise',
    color: '#F59E0B',
    icon: Briefcase,
    access: 'premium',
    features: ['Rights tracking', 'Revenue modeling', 'Asset performance', 'Sync pipeline', 'Team workflows'],
    cta: 'Apply for Access',
  },
  {
    title: 'Ad Campaign Playbook',
    description: 'Tested ad frameworks for music promotion on Meta, TikTok, YouTube, and Spotify. Includes creative guidance.',
    category: 'campaign',
    tag: 'Playbook',
    color: '#3B82F6',
    icon: Play,
    access: 'open',
    features: ['Platform breakdowns', 'Budget tiers', 'Creative formats', 'Targeting templates'],
    cta: 'Get Playbook',
  },
  {
    title: 'Financial Planning Toolkit',
    description: 'Budgeting, forecasting, and recoupment tools built for independent artists and small music businesses.',
    category: 'financial',
    tag: 'Toolkit',
    color: '#F59E0B',
    icon: BarChart3,
    access: 'member',
    features: ['Budget templates', 'Advance calculator', 'Recoupment modeling', 'Tax prep checklist'],
    cta: 'Open Toolkit',
  },
  {
    title: 'Sync Licensing Accelerator',
    description: 'Strategy and materials for getting music placed in film, TV, ads, and gaming. Includes pitch templates.',
    category: 'growth',
    tag: 'Licensing',
    color: '#EC4899',
    icon: Zap,
    access: 'premium',
    features: ['Pitch templates', 'Supervisor contacts', 'Clearance guide', 'Deal structures'],
    cta: 'Access Program',
  },
  {
    title: 'Market Intelligence Reports',
    description: 'Quarterly reports on streaming trends, genre movements, and emerging market opportunities across the US.',
    category: 'ai',
    tag: 'Research',
    color: '#10B981',
    icon: Globe,
    access: 'member',
    features: ['Quarterly reports', 'Genre analysis', 'Market data', 'Trend signals'],
    cta: 'Read Reports',
  },
  {
    title: 'Tour & Live Operations Guide',
    description: 'Operational playbook for booking, routing, budgeting, and executing live tours and performances.',
    category: 'templates',
    tag: 'Operations',
    color: '#3B82F6',
    icon: Users,
    access: 'open',
    features: ['Booking templates', 'Budget framework', 'Rider guide', 'Settlement checklists'],
    cta: 'Download Guide',
  },
];

const ACCESS_CONFIG = {
  open: { label: 'Open Access', color: ACCENT },
  member: { label: 'Member Access', color: '#3B82F6' },
  premium: { label: 'Premium', color: '#F59E0B' },
};

function ResourceCard({ resource }: { resource: Resource }) {
  const [hov, setHov] = useState(false);
  const Icon = resource.icon;
  const acc = ACCESS_CONFIG[resource.access];

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3 transition-all cursor-default"
      style={{
        background: hov ? `${resource.color}07` : 'rgba(10,12,16,0.9)',
        borderColor: hov ? `${resource.color}30` : 'rgba(255,255,255,0.05)',
        boxShadow: hov ? `0 0 24px ${resource.color}0A` : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${resource.color}12`, border: `1px solid ${resource.color}20` }}>
          <Icon className="w-4.5 h-4.5" style={{ color: resource.color }} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider"
            style={{ color: resource.color, background: `${resource.color}10`, border: `1px solid ${resource.color}18` }}>
            {resource.tag}
          </span>
          <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider"
            style={{ color: acc.color, background: `${acc.color}0A` }}>
            {resource.access !== 'open' && <Lock className="w-2 h-2 inline mr-0.5" />}
            {acc.label}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-bold text-white/85 mb-1.5">{resource.title}</h3>
        <p className="text-[10.5px] text-white/35 leading-relaxed">{resource.description}</p>
      </div>

      <ul className="space-y-1.5">
        {resource.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle className="w-2.5 h-2.5 shrink-0" style={{ color: resource.color }} />
            <span className="text-[10px] text-white/40">{f}</span>
          </li>
        ))}
      </ul>

      <button
        className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-semibold transition-all"
        style={{
          background: `${resource.color}14`,
          color: resource.color,
          border: `1px solid ${resource.color}25`,
        }}
      >
        {resource.cta} <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function IndustryOSBoutique() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = RESOURCES.filter(r => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes bq-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .bq-rise { animation: bq-rise 0.45s ease both; }
        .bq-1 { animation-delay: 0.04s; }
        .bq-2 { animation-delay: 0.08s; }
        .bq-3 { animation-delay: 0.12s; }
      `}</style>

      {/* Header */}
      <div className="mb-8 bq-rise">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}20` }}>
            <BookOpen className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">Resource Boutique</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">The Resource Boutique</h1>
        <p className="text-[13px] text-white/35 max-w-xl leading-relaxed">
          Curated tools, systems, and playbooks built for music professionals in the GMG network.
          Access what you need to operate, grow, and scale.
        </p>
      </div>

      {/* Stats + Search Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 bq-rise bq-1">
        <div className="flex items-center gap-4 flex-1">
          {[
            { label: 'Total Resources', value: `${RESOURCES.length}` },
            { label: 'Open Access', value: `${RESOURCES.filter(r => r.access === 'open').length}` },
            { label: 'Member Access', value: `${RESOURCES.filter(r => r.access === 'member').length}` },
          ].map((s, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[16px] font-bold text-white/80">{s.value}</span>
              <span className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-[11px] text-white/60 placeholder-white/20 outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6 bq-rise bq-2">
        {CATEGORIES.map(cat => {
          const CatIcon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-medium transition-all"
              style={{
                background: isActive ? `${ACCENT}14` : 'rgba(255,255,255,0.03)',
                color: isActive ? ACCENT : 'rgba(255,255,255,0.35)',
                border: `1px solid ${isActive ? `${ACCENT}25` : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <CatIcon className="w-3 h-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Resource Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bq-rise bq-3">
          {filtered.map((resource, i) => (
            <div key={i} style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
              <ResourceCard resource={resource} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Search className="w-5 h-5 text-white/20" />
          </div>
          <p className="text-[13px] font-semibold text-white/30">No resources found</p>
          <p className="text-[11px] text-white/15 mt-1">Try adjusting your search or category filter</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all'); }}
            className="mt-4 text-[10.5px] font-medium transition-colors hover:opacity-80"
            style={{ color: ACCENT }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div
        className="mt-10 rounded-2xl p-6 border flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{
          background: `${ACCENT}07`,
          borderColor: `${ACCENT}18`,
        }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="w-4 h-4" style={{ color: ACCENT }} />
            <p className="text-[12px] font-bold text-white/80">Unlock Full Access</p>
          </div>
          <p className="text-[10.5px] text-white/35 leading-relaxed">
            Apply for approved membership to access all member and premium resources in the boutique.
          </p>
        </div>
        <a
          href="/industry-os/signup"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold shrink-0 transition-all hover:opacity-90"
          style={{ background: ACCENT, color: '#000' }}
        >
          Apply for Membership <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
