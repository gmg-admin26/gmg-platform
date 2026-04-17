export type AssigneeType = 'human' | 'scout' | 'ai_operator';

export interface Assignee {
  name: string;
  type: AssigneeType;
  role?: string;
}

export const INTERNAL_ASSIGNEES: Assignee[] = [
  { name: 'Paula Moore',   type: 'human',       role: 'CEO' },
  { name: 'Randy Jackson', type: 'human',       role: 'Co-Founder' },
  { name: 'Nick Terzo',    type: 'human',       role: 'Catalog Rep' },
  { name: 'GMG AI Operator', type: 'ai_operator', role: 'AI Ops Agent' },
  { name: 'GMG Licensing',   type: 'ai_operator', role: 'Licensing Agent' },
  { name: 'GMG Marketing',   type: 'ai_operator', role: 'Marketing Agent' },
  { name: 'GMG Legal',       type: 'ai_operator', role: 'Legal Agent' },
  { name: 'GMG Finance',     type: 'ai_operator', role: 'Finance Agent' },
  { name: 'GMG Ops',         type: 'ai_operator', role: 'Operations Agent' },
  { name: 'GMG Product',     type: 'ai_operator', role: 'Product Agent' },
  { name: 'Paragon', type: 'scout' },
  { name: 'Rift',    type: 'scout' },
  { name: 'Nova',    type: 'scout' },
  { name: 'Flare',   type: 'scout' },
  { name: 'Prism',   type: 'scout' },
  { name: 'Nexus',   type: 'scout' },
  { name: 'Halo',    type: 'scout' },
  { name: 'Blaze',   type: 'scout' },
  { name: 'Riot',    type: 'scout' },
  { name: 'Vortex',  type: 'scout' },
  { name: 'Frost',   type: 'scout' },
  { name: 'Storm',   type: 'scout' },
  { name: 'Spark',   type: 'scout' },
  { name: 'Vale',    type: 'scout' },
  { name: 'Reign',   type: 'scout' },
  { name: 'Lumen',   type: 'scout' },
  { name: 'Grove',   type: 'scout' },
  { name: 'Cove',    type: 'scout' },
  { name: 'Drift',   type: 'scout' },
  { name: 'Pulse',   type: 'scout' },
  { name: 'Ember',   type: 'scout' },
  { name: 'Slate',   type: 'scout' },
  { name: 'Kairo',   type: 'scout' },
  { name: 'Onyx',    type: 'scout' },
  { name: 'Sol',     type: 'scout' },
  { name: 'Tide',    type: 'scout' },
  { name: 'Quartz',  type: 'scout' },
  { name: 'Aero',    type: 'scout' },
];

export const ASSIGNEE_NAMES: string[] = INTERNAL_ASSIGNEES.map(a => a.name);

export const HUMAN_ASSIGNEES = INTERNAL_ASSIGNEES.filter(a => a.type === 'human');
export const AI_OPERATOR_ASSIGNEES = INTERNAL_ASSIGNEES.filter(a => a.type === 'ai_operator');
export const SCOUT_ASSIGNEES = INTERNAL_ASSIGNEES.filter(a => a.type === 'scout');
