import { CSS_ANIMATIONS, Divider, SectionHead } from './campaignOS/primitives';
import { CampaignHero } from './campaignOS/CampaignHero';
import { AutopilotBar } from './campaignOS/AutopilotBar';
import { ReleaseTimeline } from './campaignOS/ReleaseTimeline';
import { PlatformGrid } from './campaignOS/PlatformGrid';
import { WalletSafe } from './campaignOS/WalletSafe';
import { CommandCenter } from './campaignOS/CommandCenter';
import { ChainedActions } from './campaignOS/ChainedActions';
import { PerformancePanel } from './campaignOS/PerformancePanel';
import { FundingGrowth } from './campaignOS/FundingGrowth';
import { LiveSystemFeed } from './campaignOS/LiveSystemFeed';
import { ConsequenceEngine } from './campaignOS/ConsequenceEngine';
import {
  RELEASE_DATA, WEEKS, PLATFORMS,
  PERFORMANCE_SIGNALS, TICKER_MESSAGES,
} from './campaignOS/data';
import {
  CalendarDays, LayoutGrid, Shield, Brain, Activity,
  TrendingUp, Link2, AlertTriangle, Radio,
} from 'lucide-react';

export default function ArtistOSCampaigns() {
  return (
    <div style={{ minHeight: '100vh', background: '#080A0D', color: '#fff', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{CSS_ANIMATIONS}</style>

      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '28px 28px 80px' }}>

        {/* 1 ── AUTOPILOT BAR */}
        <AutopilotBar />

        {/* 2 ── CAMPAIGN HERO */}
        <CampaignHero data={RELEASE_DATA} tickerMessages={TICKER_MESSAGES} />

        {/* 3 ── COMMAND CENTER + LIVE FEED */}
        <SectionHead
          title="AI Command Center"
          sub="Ranked directives with execution states, simulations, and blocker resolution"
          icon={Brain}
          color="#EF4444"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 900, color: '#EF4444', letterSpacing: '0.08em' }}>3 IN PROGRESS · 4 READY</span>
            </div>
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <CommandCenter />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 900, color: 'rgba(16,185,129,0.6)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>System Activity</div>
            <LiveSystemFeed />
          </div>
        </div>

        <Divider />

        {/* 4 ── CHAINED PLAYBOOKS */}
        <SectionHead
          title="Campaign Playbooks"
          sub="Chained action sequences — the system runs plays, not tasks"
          icon={Link2}
          color="#06B6D4"
        />
        <ChainedActions />

        <Divider />

        {/* 5 ── CONSEQUENCE ENGINE */}
        <SectionHead
          title="Consequence Engine"
          sub="What happens if you do nothing — risk modeling for every open gap"
          icon={AlertTriangle}
          color="#EF4444"
        />
        <ConsequenceEngine />

        <Divider />

        {/* 6 ── 8-WEEK TIMELINE */}
        <SectionHead
          title="8-Week Release Architecture"
          sub="Recommended standard — every week mapped, tracked, and executed"
          icon={CalendarDays}
          color="#06B6D4"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 900, color: '#F59E0B', letterSpacing: '0.08em' }}>2 AT-RISK WEEKS</span>
            </div>
          }
        />
        <ReleaseTimeline weeks={WEEKS} daysUntil={RELEASE_DATA.daysUntil} />

        <Divider />

        {/* 7 ── PLATFORM READINESS */}
        <SectionHead
          title="Platform Readiness Grid"
          sub="Every DSP and channel — hygiene scores, asset status, and action state"
          icon={LayoutGrid}
          color="#10B981"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 900, color: '#EF4444', letterSpacing: '0.08em' }}>3 PLATFORMS INCOMPLETE</span>
            </div>
          }
        />
        <PlatformGrid platforms={PLATFORMS} />

        <Divider />

        {/* 8 ── CAMPAIGN WALLET */}
        <SectionHead
          title="Campaign Wallet"
          sub="Secure funding safe — streaming receivables, ACH payouts, and campaign advances"
          icon={Shield}
          color="#F59E0B"
        />
        <WalletSafe />

        <Divider />

        {/* 9 ── LIVE PERFORMANCE */}
        <SectionHead
          title="Live Performance + Adaptation"
          sub="What is working, what is cooling, and what the system is adjusting right now"
          icon={Activity}
          color="#10B981"
        />
        <PerformancePanel signals={PERFORMANCE_SIGNALS} />

        <Divider />

        {/* 10 ── FUNDING-TO-GROWTH */}
        <SectionHead
          title="Funding to Growth"
          sub="How streaming receivables become campaign fuel and measurable growth"
          icon={TrendingUp}
          color="#F59E0B"
        />
        <FundingGrowth />

        {/* Footer */}
        <div style={{ marginTop: 36, padding: '14px 20px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.7)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>
              {RELEASE_DATA.artist} · {RELEASE_DATA.label} · Campaign OS · {RELEASE_DATA.daysUntil} days to release · System Active
            </span>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.15)' }}>GMG Intelligence Platform</span>
        </div>

      </div>
    </div>
  );
}
