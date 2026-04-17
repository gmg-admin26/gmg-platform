import { supabase } from '../../lib/supabase';

export type WorkerSystem = 'catalog_os' | 'industry_os' | 'artist_os' | 'rocksteady';
export type FeeType = 'hourly' | 'flat' | 'retainer' | 'rev_share';
export type ACHStatus = 'missing' | 'pending' | 'connected';
export type W9Status = 'missing' | 'submitted' | 'verified';
export type InvoiceStatus = 'missing' | 'submitted' | 'approved' | 'paid';
export type AgreementStatus = 'missing' | 'sent' | 'signed';
export type AssignmentStatus = 'open' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
export type PaymentStatus = 'held' | 'pending' | 'approved' | 'delayed' | 'paid' | 'cancelled';

export interface ProjectWorker {
  id: string;
  name: string;
  role: string;
  project: string;
  system: WorkerSystem;
  fee_type: FeeType;
  rate: number;
  rate_currency: string;
  payment_terms_days: number;
  ach_status: ACHStatus;
  w9_status: W9Status;
  invoice_status: InvoiceStatus;
  agreement_status: AgreementStatus;
  email?: string;
  phone?: string;
  entity_name?: string;
  ein_last4?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  assignments?: ProjectAssignment[];
  payment_safe?: PaymentSafe;
}

export interface ProjectAssignment {
  id: string;
  worker_id: string;
  deliverable_title: string;
  deliverable_description?: string;
  completion_definition?: string;
  due_date?: string;
  assigned_manager?: string;
  status: AssignmentStatus;
  notes?: string;
  issues?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type DelayCategory =
  | 'missing_contract'
  | 'missing_w9'
  | 'ach_issue'
  | 'deliverables_incomplete'
  | 'upstream_cash_timing'
  | 'legal_hold'
  | 'other';

export type ReleaseType = 'partial' | 'final' | 'bonus' | 'reimbursement';

export type PaymentStage =
  | 'agreement_active'
  | 'deliverables_submitted'
  | 'under_review'
  | 'approved'
  | 'processing'
  | 'get_paid'
  | 'delayed'
  | 'paid';

export interface PaymentSafe {
  id: string;
  worker_id: string;
  assignment_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  expected_release_date?: string;
  delay_reason?: string;
  delay_title?: string;
  delay_category?: DelayCategory | '';
  delay_description?: string;
  delay_requires_worker_action?: boolean;
  release_type?: ReleaseType;
  stage?: PaymentStage;
  compliance_contract_signed: boolean;
  compliance_w9_submitted: boolean;
  compliance_invoice_submitted: boolean;
  compliance_ach_connected: boolean;
  compliance_deliverables_approved: boolean;
  approved_by?: string;
  approved_at?: string;
  paid_at?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentDelayLog {
  id: string;
  payment_safe_id: string;
  worker_id: string;
  reason: string;
  logged_by?: string;
  created_at: string;
}

export interface WorkerWithRelations extends ProjectWorker {
  assignments: ProjectAssignment[];
  payment_safe?: PaymentSafe;
  all_safes: PaymentSafe[];
}

export async function fetchWorkers(system: WorkerSystem): Promise<WorkerWithRelations[]> {
  const { data: workers, error } = await supabase
    .from('project_workers')
    .select('*')
    .eq('system', system)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !workers) return [];

  const workerIds = workers.map(w => w.id);

  const [{ data: assignments }, { data: safes }] = await Promise.all([
    supabase.from('project_assignments').select('*').in('worker_id', workerIds).order('sort_order'),
    supabase.from('payment_safes').select('*').in('worker_id', workerIds),
  ]);

  return workers.map(w => ({
    ...w,
    assignments: (assignments ?? []).filter(a => a.worker_id === w.id),
    payment_safe: (safes ?? []).find(s => s.worker_id === w.id),
    all_safes: (safes ?? []).filter(s => s.worker_id === w.id),
  }));
}

export async function fetchWorkerById(id: string): Promise<WorkerWithRelations | null> {
  const { data: worker, error } = await supabase
    .from('project_workers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !worker) return null;

  const [{ data: assignments }, { data: safes }] = await Promise.all([
    supabase.from('project_assignments').select('*').eq('worker_id', id).order('sort_order'),
    supabase.from('payment_safes').select('*').eq('worker_id', id),
  ]);

  return {
    ...worker,
    assignments: assignments ?? [],
    payment_safe: safes?.[0],
    all_safes: safes ?? [],
  };
}

export async function updateWorkerCompliance(
  workerId: string,
  fields: Partial<Pick<ProjectWorker, 'ach_status' | 'w9_status' | 'invoice_status' | 'agreement_status'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('project_workers')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', workerId);
  return !error;
}

export async function updatePaymentSafeStatus(
  safeId: string,
  status: PaymentStatus,
  fields?: Partial<PaymentSafe>
): Promise<boolean> {
  const { error } = await supabase
    .from('payment_safes')
    .update({ status, ...fields, updated_at: new Date().toISOString() })
    .eq('id', safeId);
  return !error;
}

export async function logPaymentDelay(
  paymentSafeId: string,
  workerId: string,
  reason: string,
  loggedBy?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('payment_delay_log')
    .insert({ payment_safe_id: paymentSafeId, worker_id: workerId, reason, logged_by: loggedBy });
  return !error;
}

export async function updateAssignmentStatus(
  assignmentId: string,
  status: AssignmentStatus,
  notes?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('project_assignments')
    .update({ status, ...(notes ? { notes } : {}), updated_at: new Date().toISOString() })
    .eq('id', assignmentId);
  return !error;
}

export async function fetchWorkerByEmail(email: string, system: WorkerSystem): Promise<WorkerWithRelations | null> {
  const { data: worker, error } = await supabase
    .from('project_workers')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .eq('system', system)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !worker) return null;

  const [{ data: assignments }, { data: safes }] = await Promise.all([
    supabase.from('project_assignments').select('*').eq('worker_id', worker.id).order('sort_order'),
    supabase.from('payment_safes').select('*').eq('worker_id', worker.id),
  ]);

  return {
    ...worker,
    assignments: assignments ?? [],
    payment_safe: safes?.[0],
    all_safes: safes ?? [],
  };
}

export async function fetchDelayLog(paymentSafeId: string): Promise<PaymentDelayLog[]> {
  const { data, error } = await supabase
    .from('payment_delay_log')
    .select('*')
    .eq('payment_safe_id', paymentSafeId)
    .order('created_at', { ascending: false });
  return error ? [] : (data ?? []);
}

export function isPaymentReleasable(safe: PaymentSafe): boolean {
  return (
    safe.compliance_contract_signed &&
    safe.compliance_w9_submitted &&
    safe.compliance_invoice_submitted &&
    safe.compliance_ach_connected &&
    safe.compliance_deliverables_approved
  );
}

export function getMissingComplianceItems(worker: ProjectWorker, safe?: PaymentSafe): string[] {
  const missing: string[] = [];
  if (worker.agreement_status !== 'signed') missing.push('Contract must be signed');
  if (worker.w9_status === 'missing') missing.push('W9 / EIN must be submitted');
  if (worker.invoice_status === 'missing') missing.push('Invoice must be submitted');
  if (worker.ach_status === 'missing') missing.push('ACH banking info must be connected');
  if (safe && !safe.compliance_deliverables_approved) missing.push('Deliverables must be approved by manager');
  return missing;
}
