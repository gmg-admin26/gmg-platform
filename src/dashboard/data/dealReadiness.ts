export interface DealReadinessBreakdown {
  momentum: 'Very High' | 'High' | 'Moderate' | 'Low';
  aiScoutConsensus: number;
  humanCoSigns: number;
  contactConfidence: number | null;
  responseLikelihood: number | null;
  pipelineStage: string;
  marketHeat: 'Hot' | 'Warm' | 'Developing';
}

export interface DealReadiness {
  score: number;
  tier: 'High Priority' | 'Strong Opportunity' | 'Developing' | 'Early';
  tierColor: string;
  tierBg: string;
  tierBorder: string;
  bestAction: string;
  breakdown: DealReadinessBreakdown;
}

const PIPELINE_STAGE_SCORES: Record<string, number> = {
  'Signed':               100,
  'Contract In Progress': 90,
  'Agreement Sent':       85,
  'Agreement Ready':      82,
  'Meeting Scheduled':    78,
  'Meeting Requested':    72,
  'Escalated to A&R':     68,
  'Awaiting Reply':       60,
  'Outreach Sent':        52,
  'Under Review':         40,
  'Surfaced':             25,
  'Closed / Passed':      0,
};

export function computeDealReadiness(params: {
  velocityScore?: number;
  aiScoutCount: number;
  humanCoSignCount: number;
  contactConfidence?: number;
  responseLikelihood?: number;
  pipelineStage?: string;
  contactReadiness?: 'Hot' | 'Warm' | 'Cold';
  confidence?: number;
}): DealReadiness {
  const {
    velocityScore = 50,
    aiScoutCount,
    humanCoSignCount,
    contactConfidence,
    responseLikelihood,
    pipelineStage,
    contactReadiness,
    confidence = 70,
  } = params;

  const momentumScore = Math.min(velocityScore, 100) * 0.25;

  const scoutScore = Math.min(aiScoutCount / 5, 1) * 20;

  const humanScore = Math.min(humanCoSignCount / 3, 1) * 15;

  const contactScore = (contactConfidence ?? confidence * 0.8) / 100 * 15;

  const responseScore = (responseLikelihood ?? 55) / 100 * 10;

  const stageScore = pipelineStage ? (PIPELINE_STAGE_SCORES[pipelineStage] ?? 25) / 100 * 10 : 2.5;

  const heatBonus = contactReadiness === 'Hot' ? 5 : contactReadiness === 'Warm' ? 2.5 : 0;

  const raw = momentumScore + scoutScore + humanScore + contactScore + responseScore + stageScore + heatBonus;
  const score = Math.round(Math.min(Math.max(raw, 1), 100));

  let tier: DealReadiness['tier'];
  let tierColor: string;
  let tierBg: string;
  let tierBorder: string;
  let bestAction: string;

  if (score >= 85) {
    tier = 'High Priority';
    tierColor = '#EF4444';
    tierBg = 'bg-[#EF4444]/10';
    tierBorder = 'border-[#EF4444]/25';
    bestAction = contactReadiness === 'Hot' ? 'Initiate outreach immediately' : 'Assign senior A&R and prepare offer terms';
  } else if (score >= 70) {
    tier = 'Strong Opportunity';
    tierColor = '#F59E0B';
    tierBg = 'bg-[#F59E0B]/10';
    tierBorder = 'border-[#F59E0B]/25';
    bestAction = 'Engage via management — schedule intro call';
  } else if (score >= 50) {
    tier = 'Developing';
    tierColor = '#06B6D4';
    tierBg = 'bg-[#06B6D4]/10';
    tierBorder = 'border-[#06B6D4]/25';
    bestAction = 'Monitor signals — prepare discovery brief';
  } else {
    tier = 'Early';
    tierColor = '#6B7280';
    tierBg = 'bg-white/[0.04]';
    tierBorder = 'border-white/[0.08]';
    bestAction = 'Watch for velocity catalyst';
  }

  const momentumLabel: DealReadinessBreakdown['momentum'] =
    velocityScore >= 85 ? 'Very High' :
    velocityScore >= 65 ? 'High' :
    velocityScore >= 45 ? 'Moderate' : 'Low';

  const marketHeat: DealReadinessBreakdown['marketHeat'] =
    contactReadiness === 'Hot' ? 'Hot' :
    contactReadiness === 'Warm' ? 'Warm' : 'Developing';

  return {
    score,
    tier,
    tierColor,
    tierBg,
    tierBorder,
    bestAction,
    breakdown: {
      momentum: momentumLabel,
      aiScoutConsensus: aiScoutCount,
      humanCoSigns: humanCoSignCount,
      contactConfidence: contactConfidence ?? null,
      responseLikelihood: responseLikelihood ?? null,
      pipelineStage: pipelineStage ?? 'Not in pipeline',
      marketHeat,
    },
  };
}

export function getDealReadinessTierStyle(tier: DealReadiness['tier']) {
  switch (tier) {
    case 'High Priority':      return { color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/25' };
    case 'Strong Opportunity': return { color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/25' };
    case 'Developing':         return { color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/25' };
    default:                   return { color: '#6B7280', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]' };
  }
}
