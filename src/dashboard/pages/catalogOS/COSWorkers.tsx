import { FolderKanban } from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import WorkerPaymentSystem from '../../components/workers/WorkerPaymentSystem';

const ACCENT = '#10B981';

export default function COSWorkers() {
  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={FolderKanban}
        title="Project OS"
        subtitle="Worker payment tracking · Compliance gates · Deliverable status · ACH · Project agreements"
        accentColor={ACCENT}
        badge="Controlled Workflow"
      />
      <div className="pt-4 pb-6">
        <WorkerPaymentSystem system="catalog_os" accentColor={ACCENT} />
      </div>
    </div>
  );
}
