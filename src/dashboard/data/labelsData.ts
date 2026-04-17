export type LabelType = 'Partner' | 'Distribution' | 'Internal';
export type LabelStatus = 'Active' | 'Inactive';
export type LabelCategory = 'Brand Imprint' | 'Campus Label' | 'Wellness Label' | 'Indie Label';

export const LABEL_CATEGORIES: LabelCategory[] = [
  'Brand Imprint',
  'Campus Label',
  'Wellness Label',
  'Indie Label',
];

export const LABEL_CATEGORY_META: Record<LabelCategory, { color: string; bg: string; border: string }> = {
  'Brand Imprint':  { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)'  },
  'Campus Label':   { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)'   },
  'Wellness Label': { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)'  },
  'Indie Label':    { color: '#EC4899', bg: 'rgba(236,72,153,0.1)',  border: 'rgba(236,72,153,0.25)'  },
};

export interface LabelRecord {
  id: string;
  name: string;
  type: LabelType;
  status: LabelStatus;
  color: string;
  labelCategory?: LabelCategory;
  description?: string;
  ar_rep?: string;
  point_person?: string;
}

export const labelsData: LabelRecord[] = [
  { id: 'gmg',                         name: 'GMG',                         type: 'Internal',     status: 'Active', color: '#06B6D4', labelCategory: 'Brand Imprint',  description: 'Greater Music Group house label. Direct GMG signings.' },
  { id: 'spin-records',                name: 'SPIN Records',                type: 'Partner',      status: 'Active', color: '#F59E0B', labelCategory: 'Brand Imprint'  },
  { id: 'alabama-sound-company',       name: 'Alabama Sound Company',       type: 'Partner',      status: 'Active', color: '#EC4899', labelCategory: 'Indie Label'    },
  { id: 'self-realization-fellowship', name: 'Self-Realization Fellowship', type: 'Partner',      status: 'Active', color: '#10B981', labelCategory: 'Wellness Label' },
  { id: 'quatorze-recordings',         name: 'Quatorze Recordings',         type: 'Distribution', status: 'Active', color: '#06B6D4', labelCategory: 'Indie Label'    },
  { id: 'snbjr-records',               name: 'SNBJR Records',               type: 'Partner',      status: 'Active', color: '#8B5CF6', labelCategory: 'Campus Label',  description: 'Chicago-based partner label.' },
];

export function getLabelById(id: string): LabelRecord | undefined {
  return labelsData.find(l => l.id === id);
}

export function syncLabelFromSupabase(record: {
  id: string;
  slug: string;
  name: string;
  type: string;
  status: string;
  color: string;
  notes?: string;
  ar_rep?: string;
  point_person?: string;
  label_category?: string | null;
}): LabelRecord {
  const typeMap: Record<string, LabelType> = {
    internal: 'Internal',
    partner: 'Partner',
    distribution: 'Distribution',
  };
  const statusMap: Record<string, LabelStatus> = {
    active: 'Active',
    inactive: 'Inactive',
  };

  const entry: LabelRecord = {
    id: record.slug || record.id,
    name: record.name,
    type: typeMap[record.type] ?? 'Partner',
    status: statusMap[record.status] ?? 'Active',
    color: record.color,
    labelCategory: (record.label_category as LabelCategory) ?? undefined,
    description: record.notes ?? '',
    ar_rep: record.ar_rep ?? '',
    point_person: record.point_person ?? '',
  };

  const existing = labelsData.findIndex(l => l.id === entry.id);
  if (existing >= 0) {
    labelsData[existing] = entry;
  } else {
    labelsData.push(entry);
  }
  return entry;
}

export const LABEL_TYPE_COLORS: Record<LabelType, { color: string; bg: string }> = {
  Partner:      { color: '#10B981', bg: 'rgba(16,185,129,0.1)'  },
  Distribution: { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)'   },
  Internal:     { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
};
