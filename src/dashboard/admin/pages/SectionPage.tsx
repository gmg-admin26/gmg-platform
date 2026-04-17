import { useLocation } from 'react-router-dom';
import { AdminPage, AdminCard, Pill, SectionTiles, StatTile, CommandRow, ADMIN_COLORS } from '../shared';
import { ADMIN_NAV } from '../adminNav';
import AgentPanel from '../AgentPanel';
import {
  Activity, CheckCircle2, Target, AlertCircle, TrendingUp, Zap,
} from 'lucide-react';

const SECTION_AGENTS: Record<string, { slugs: string[]; title: string }> = {
  artists:    { slugs: ['artist-account', 'stage', 'industry-marketing'],  title: 'Artist Account Agents' },
  catalog:    { slugs: ['label-account', 'ledger', 'crest'],               title: 'Catalog Operations Agents' },
  marketing:  { slugs: ['industry-marketing', 'stage', 'signalops'],       title: 'Marketing Agents — AI Rep Controls' },
  comms:      { slugs: ['paula-exec', 'jacquelyn-exec', 'artist-account'], title: 'Communications Agents — Exec Assistants' },
  people:     { slugs: ['paula-exec', 'jacquelyn-exec', 'signalops'],      title: 'Agents Supporting Humans' },
  partners:   { slugs: ['beacon', 'counsel', 'contract-loop'],             title: 'Partner Pipeline Agents' },
  banking:    { slugs: ['vault', 'ledger', 'anchor'],                      title: 'Banking + Capital Agents' },
  risk:       { slugs: ['shield', 'anchor', 'counsel'],                    title: 'Risk + Protection Agents' },
  touring:    { slugs: ['tour-manager', 'store-manager', 'campus-manager'],title: 'Tour / Store / Campus Agents' },
};

export default function SectionPage() {
  const location = useLocation();
  const section = ADMIN_NAV.find(s => s.items.some(it => it.path === location.pathname))
             ?? ADMIN_NAV.find(s => location.pathname.startsWith(s.items[0]?.path ?? ''));
  const current = section?.items.find(it => it.path === location.pathname) ?? section?.items[0];

  if (!section || !current) {
    return (
      <AdminPage eyebrow="Admin OS" title="Module" accent={ADMIN_COLORS.cyan}>
        <p className="text-[11px] text-white/30 font-mono">Module not found.</p>
      </AdminPage>
    );
  }

  const other = section.items.filter(it => it.path !== current.path);
  const agentConfig = SECTION_AGENTS[section.key];

  return (
    <AdminPage
      eyebrow={section.label}
      title={current.label}
      subtitle={`${section.label} · live operational surface. Connected to GMG agent infrastructure and cross-system signals.`}
      accent={section.color}
      actions={<Pill color={section.color} label="LIVE" glow />}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatTile label="Items in Flight"  value={12} color={section.color} icon={Target}      />
        <StatTile label="Closed (7d)"      value={8}  color="#10B981"       icon={CheckCircle2} />
        <StatTile label="Blocked"          value={2}  color="#EF4444"       icon={AlertCircle}  />
        <StatTile label="Velocity"         value="+14%" color="#06B6D4"     icon={TrendingUp}   />
        <StatTile label="Agent Actions"    value={47} color="#EC4899"       icon={Zap}          />
        <StatTile label="Health"           value="OK" color="#10B981"       icon={Activity}     />
      </div>

      {agentConfig && (
        <AgentPanel
          title={agentConfig.title}
          agentSlugs={agentConfig.slugs}
          accent={section.color}
        />
      )}

      <AdminCard title={`${current.label} — Live Board`} sub="Primary operational stream for this module" accent={section.color}>
        <div className="space-y-1">
          {[1, 2, 3, 4, 5].map(i => (
            <CommandRow
              key={i}
              icon={Activity}
              title={`${current.label} — live item #${i}`}
              meta={`Owner: operations · Updated ${i}h ago`}
              accent={section.color}
            />
          ))}
        </div>
      </AdminCard>

      <AdminCard title={`${section.label} — Related Modules`} sub="Jump to connected views" accent={section.color}>
        <SectionTiles items={other.map(it => ({ label: it.label, path: it.path, icon: it.icon, color: section.color, count: Math.floor(Math.random() * 20) }))} />
      </AdminCard>
    </AdminPage>
  );
}
