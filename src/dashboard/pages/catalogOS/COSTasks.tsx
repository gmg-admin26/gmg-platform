import { useEffect } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import TaskListView from '../../components/tasks/TaskListView';
import WorkflowTransparency from '../../components/tasks/WorkflowTransparency';
import { useTasks } from '../../context/TaskContext';

function SectionLabel({ index, label, accent = '#10B981' }: { index: string; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[9px] font-mono shrink-0" style={{ color: `${accent}50` }}>{index}</span>
      <div className="h-[1px] w-3" style={{ background: `${accent}30` }} />
      <span className="text-[10px] font-mono tracking-[0.16em] uppercase font-semibold shrink-0" style={{ color: `${accent}70` }}>{label}</span>
      <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

export default function COSTasks() {
  const { loadTasks, openSubmit } = useTasks();

  useEffect(() => { loadTasks('catalog_os'); }, [loadTasks]);

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={CheckSquare}
        title="Tasks + Workflow"
        subtitle="Active work · Assignments · Blockers · Workflow transparency"
        accentColor="#10B981"
        badge="LIVE"
        actions={
          <button
            onClick={() => openSubmit('catalog_os', 'Bassnectar / Amorphous Music')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-90"
            style={{ background: '#10B981', color: '#000' }}
          >
            <Plus className="w-3.5 h-3.5" /> Submit Task
          </button>
        }
      />

      <div className="p-5 space-y-8">
        <section>
          <SectionLabel index="01" label="Workflow Overview" accent="#10B981" />
          <WorkflowTransparency system="catalog_os" accent="#10B981" />
        </section>

        <section>
          <SectionLabel index="02" label="All Tasks" accent="#06B6D4" />
          <TaskListView title="Catalog OS Tasks" accent="#10B981" />
        </section>

        <div className="h-6" />
      </div>
    </div>
  );
}
