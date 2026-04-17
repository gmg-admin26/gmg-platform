import type { WorkerWithRelations, PaymentSafe, PaymentStage, DelayCategory, ReleaseType } from '../../../data/workerPaymentService';

export const TAB_KEYS = ['all', 'pending', 'processing', 'delayed', 'ready', 'paid'] as const;
export type TabKey = typeof TAB_KEYS[number];

export const TAB_LABELS: Record<TabKey, string> = {
  all:        'All',
  pending:    'Pending Approval',
  processing: 'Processing',
  delayed:    'Delayed',
  ready:      'Ready to Release',
  paid:       'Paid',
};

export const ROUTE_TO_TAB: Record<string, TabKey> = {
  safes:    'all',
  payments: 'pending',
  delayed:  'delayed',
};

export const STAGE_LABEL: Record<PaymentStage, string> = {
  agreement_active:       'Agreement Active',
  deliverables_submitted: 'Deliverables Submitted',
  under_review:           'Under Review',
  approved:               'Approved',
  processing:             'Processing',
  get_paid:               'Get Paid',
  delayed:                'Delayed',
  paid:                   'Paid',
};

export const STAGE_COLOR: Record<PaymentStage, string> = {
  agreement_active:       '#6B7280',
  deliverables_submitted: '#8B8F9B',
  under_review:           '#F59E0B',
  approved:               '#06B6D4',
  processing:             '#06B6D4',
  get_paid:               '#10B981',
  delayed:                '#EF4444',
  paid:                   '#10B981',
};

export const CATEGORY_LABEL: Record<DelayCategory, string> = {
  missing_contract:        'Missing Contract',
  missing_w9:              'Missing W9 / EIN',
  ach_issue:               'ACH Issue',
  deliverables_incomplete: 'Deliverables Incomplete',
  upstream_cash_timing:    'Upstream Cash Timing',
  legal_hold:              'Legal Hold',
  other:                   'Other',
};

export const RELEASE_TYPE_LABEL: Record<ReleaseType, string> = {
  partial:       'Partial Release',
  final:         'Final Payment',
  bonus:         'Bonus',
  reimbursement: 'Reimbursement',
};

export function currentStage(w: WorkerWithRelations): PaymentStage {
  const s = w.payment_safe;
  if (!s) return 'agreement_active';
  if (s.stage) return s.stage;
  if (s.status === 'delayed') return 'delayed';
  if (s.status === 'paid') return 'paid';
  if (s.status === 'approved') return 'get_paid';
  if (s.status === 'pending') return 'processing';
  if (s.status === 'held') return 'under_review';
  return 'agreement_active';
}

export function blockersFor(w: WorkerWithRelations): { label: string; severity: 'critical' | 'warning' }[] {
  const blockers: { label: string; severity: 'critical' | 'warning' }[] = [];
  const s = w.payment_safe;
  if (w.agreement_status !== 'signed') blockers.push({ label: 'Contract missing', severity: 'critical' });
  if (w.w9_status === 'missing')      blockers.push({ label: 'W9 / EIN missing', severity: 'critical' });
  if (w.ach_status === 'missing')     blockers.push({ label: 'ACH missing',      severity: 'critical' });
  if (w.invoice_status === 'missing') blockers.push({ label: 'Invoice missing',  severity: 'warning' });
  const deliverablesDone = (w.assignments ?? []).length > 0 && (w.assignments ?? []).every(a => a.status === 'approved');
  if (!deliverablesDone && (w.assignments?.length ?? 0) > 0) blockers.push({ label: 'Deliverables incomplete', severity: 'warning' });
  if (s && !s.compliance_deliverables_approved) blockers.push({ label: 'Final signoff missing', severity: 'warning' });
  return blockers;
}

export function matchesTab(w: WorkerWithRelations, tab: TabKey): boolean {
  const stage = currentStage(w);
  const safe = w.payment_safe;
  switch (tab) {
    case 'all':        return true;
    case 'pending':    return stage === 'under_review' || safe?.status === 'held';
    case 'processing': return stage === 'processing'   || safe?.status === 'pending';
    case 'delayed':    return stage === 'delayed'      || safe?.status === 'delayed';
    case 'ready':      return stage === 'get_paid'     || safe?.status === 'approved';
    case 'paid':       return stage === 'paid'         || safe?.status === 'paid';
  }
}

export function computePaidOut(_s: PaymentSafe | undefined): number {
  return 0;
}

export function computeRemaining(s: PaymentSafe | undefined, contracted: number): number {
  if (!s) return contracted;
  if (s.status === 'paid') return 0;
  return Number(s.amount ?? contracted);
}

export function contractedFee(w: WorkerWithRelations): number {
  if (w.fee_type === 'flat' || w.fee_type === 'retainer') return Number(w.rate ?? 0);
  const n = (w.assignments ?? []).length || 1;
  return Number(w.rate ?? 0) * n;
}
