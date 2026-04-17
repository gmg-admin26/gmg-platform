import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Agent, fetchAgents, CATEGORY_META } from '../adminAgentService';
import { AdminPage, AdminCard, Pill } from '../shared';
import { AgentCard } from './AgentWorkspace';

export default function AgentCategories() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setAgents(await fetchAgents());
      setLoading(false);
    })();
  }, []);

  const grouped = Object.keys(CATEGORY_META).map(key => ({
    key,
    meta: CATEGORY_META[key],
    agents: agents.filter(a => a.category === key),
  }));

  return (
    <AdminPage
      eyebrow="AI Agent Roster"
      title="Agent Categories"
      subtitle="Every GMG AI agent grouped by operating function — Core, Executive, Legal, Growth, Operations, Account."
      accent="#EC4899"
    >
      {loading ? (
        <div className="py-8 text-center text-[11px] font-mono text-white/30">Loading…</div>
      ) : (
        <div className="space-y-5">
          {grouped.map(g => (
            <AdminCard
              key={g.key}
              title={`${g.meta.label} · ${g.agents.length} agent${g.agents.length === 1 ? '' : 's'}`}
              sub={g.meta.description}
              accent={g.meta.color}
              right={<Pill color={g.meta.color} label={g.key.toUpperCase()} glow />}
            >
              {g.agents.length === 0 ? (
                <div className="py-6 text-center text-[11px] font-mono text-white/25">No agents in this category.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {g.agents.map(a => (
                    <AgentCard key={a.id} agent={a} onClick={() => navigate(`/dashboard/admin-os/agents/${a.slug}`)} />
                  ))}
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
