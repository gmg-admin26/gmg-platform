export interface ReportArtist {
  rank: number;
  name: string;
  genre: string;
  market: string;
  momentum: string;
  labelStatus: string;
  arScore: number;
  accuracy: number;
  opportunity: string;
  contactPoint: string;
  contactEmail?: string;
  socialLink: string;
  streamingLink: string;
  linktreeLink?: string;
  contactConfidence?: number;
  responseLikelihood?: number;
  responseRisk?: 'Low' | 'Medium' | 'High';
  aiScouts?: string[];
  humanCoSigns?: string[];
  dealReadinessScore?: number;
}

export interface ParagonDailyReport {
  date: string;
  subtitle: string;
  coverage: string;
  metricsCovered: string[];
  topPick: {
    artist: string;
    market: string;
    genre: string;
    arScore: number;
    headline: string;
    summary: string;
    audienceNote: string;
    recommendation: string;
    window: string;
  };
  artists: ReportArtist[];
  footerText: string;
  footerNote: string;
}

export const PARAGON_TODAY_REPORT: ParagonDailyReport = {
  date: 'April 9, 2026',
  subtitle: 'Daily Trending Artists Report — April 9, 2026',
  coverage: '10 artists scored',
  metricsCovered: [
    'Streaming Momentum',
    'Social Growth',
    'Press Activity',
    'Playlist Placements',
    'Label Status',
  ],
  topPick: {
    artist: 'Lamb',
    market: 'Venice Beach, USA',
    genre: 'Jersey Club-Indie / Electronic Pop',
    arScore: 91,
    headline: 'Pre-viral window is open now. Co-signs from Drake, SZA, and Russ confirm breakout trajectory.',
    summary:
      'Lamb is an unsigned Los Angeles–based artist operating in a high-velocity Jersey Club-Indie space with a growing TikTok audience and top-tier cultural co-signs. Direct digital funnel is active. Management is reachable. Pre-viral window is open — estimate 14–21 days before major label attention accelerates.',
    audienceNote:
      'Young crossover audience, 18–28 core, LA-dominant with national digital spread. High engagement rate on TikTok. Linktree active with all streaming and social consolidated.',
    recommendation:
      'Initiate contact via management email immediately. Lead with GMG platform capabilities and digital distribution infrastructure. Move before the bidding war starts.',
    window: '14-day opportunity window',
  },
  artists: [
    {
      rank: 1,
      name: 'Lamb',
      genre: 'Jersey Club-Indie / Electronic Pop',
      market: 'Venice Beach, USA',
      momentum: '100K+ monthly listeners, early 2026 breakthrough, Drake/SZA/Russ co-signs, TikTok acceleration',
      labelStatus: 'Unsigned / Independent',
      arScore: 91,
      accuracy: 92,
      opportunity: 'Pre-viral window is open. Sign before the bidding war starts.',
      contactPoint: 'Management — direct email confirmed',
      contactEmail: 'unitcmanagement@gmail.com',
      socialLink: 'tiktok.com/@lamb.wav',
      streamingLink: 'open.spotify.com/artist/lamb',
      linktreeLink: 'link.me/lamb.wavv',
      contactConfidence: 94,
      responseLikelihood: 72,
      responseRisk: 'Low',
      aiScouts: ['Paragon', 'Nova', 'Rift'],
      humanCoSigns: ['Randy Jackson', 'Latie'],
      dealReadinessScore: 91,
    },
    {
      rank: 2,
      name: 'Zaylevelten',
      genre: 'Afro-fusion / Alté Rap',
      market: 'Nigeria',
      momentum: '724,827 monthly listeners, +2,071% growth after Fresh Finds Africa placement',
      labelStatus: 'Unsigned / Independent',
      arScore: 87,
      accuracy: 94,
      opportunity:
        'Fastest-growing unsigned Afro-fusion act in Africa right now. Sign before a major moves after next single.',
      contactPoint: 'Via management — Instagram DM',
      socialLink: 'instagram.com/zaylevelten',
      streamingLink: 'open.spotify.com/artist/zaylevelten',
      contactConfidence: 78,
      responseLikelihood: 65,
      responseRisk: 'Medium',
      aiScouts: ['Paragon', 'Nova', 'Prism', 'Flare', 'Rift'],
      humanCoSigns: ['Randy Jackson', 'Paula Moore', 'Latie'],
      dealReadinessScore: 100,
    },
    {
      rank: 3,
      name: 'Hemlocke Springs',
      genre: 'Synth-pop / Bedroom Pop / Electropop',
      market: 'Los Angeles, USA',
      momentum: '769,177 monthly listeners, debut album The Apple Tree Under the Sea — Metacritic 81',
      labelStatus: 'Indie (AWAL)',
      arScore: 76,
      accuracy: 88,
      opportunity:
        'AWAL deal may be light-touch. Explore co-sign or joint venture before album tour cycle raises price.',
      contactPoint: 'AWAL A&R — direct label contact',
      socialLink: 'instagram.com/hemlockesprings',
      streamingLink: 'open.spotify.com/artist/hemlockesprings',
      contactConfidence: 71,
      responseLikelihood: 55,
      responseRisk: 'Medium',
      aiScouts: ['Paragon', 'Nova'],
      humanCoSigns: ['Paula Moore'],
      dealReadinessScore: 63,
    },
    {
      rank: 4,
      name: 'Mon Rovia',
      genre: 'Afro-Appalachian Folk / Indie-Folk',
      market: 'Liberia / USA',
      momentum: '2.4M monthly listeners, Bloodline album growth, crooked the road at 52.7M streams',
      labelStatus: 'Indie (Nettwerk Music Group exclusive license)',
      arScore: 81,
      accuracy: 91,
      opportunity: 'Monitor contract window for co-publishing or sync licensing play.',
      contactPoint: 'Nettwerk A&R — licensing inquiry',
      socialLink: 'instagram.com/monrovia',
      streamingLink: 'open.spotify.com/artist/monrovia',
      contactConfidence: 80,
      responseLikelihood: 60,
      responseRisk: 'Medium',
      aiScouts: ['Paragon', 'Nexus', 'Nova'],
      humanCoSigns: ['Randy Jackson', 'Paula Moore'],
      dealReadinessScore: 74,
    },
    {
      rank: 5,
      name: 'Sung Holly',
      genre: 'Bedroom Pop / Indie R&B',
      market: 'Dallas, USA',
      momentum: 'YouTube 258K subscribers, 18.29M monthly views, 5.17% engagement',
      labelStatus: 'Unsigned / Independent',
      arScore: 68,
      accuracy: 79,
      opportunity: 'Strong development deal candidate.',
      contactPoint: 'Via YouTube community / email',
      socialLink: 'youtube.com/@sungholy',
      streamingLink: 'open.spotify.com/artist/sungholy',
      contactConfidence: 62,
      responseLikelihood: 58,
      responseRisk: 'Medium',
      aiScouts: ['Paragon'],
      humanCoSigns: [],
      dealReadinessScore: 44,
    },
    {
      rank: 6,
      name: 'Fcukers',
      genre: 'Electro-Indie / Club-Rock',
      market: 'New York City, USA',
      momentum: '476K monthly listeners, debut album O, Bon Bon at 4.2M streams',
      labelStatus: 'Indie (Ninja Tune / Technicolour)',
      arScore: 70,
      accuracy: 82,
      opportunity: 'Monitor for sync and brand partnership pipeline.',
      contactPoint: 'Ninja Tune / Technicolour A&R',
      socialLink: 'instagram.com/fcukers',
      streamingLink: 'open.spotify.com/artist/fcukers',
      contactConfidence: 74,
      responseLikelihood: 50,
      responseRisk: 'Medium',
      aiScouts: ['Rift', 'Cipher', 'Drift'],
      humanCoSigns: ['Latie'],
      dealReadinessScore: 62,
    },
    {
      rank: 7,
      name: 'Lila Daye',
      genre: 'Alt-R&B / Bedroom Soul',
      market: 'Houston, USA',
      momentum: '188K monthly listeners, +640% in 60 days, Spotify Fresh Finds add, no label',
      labelStatus: 'Unsigned / Independent',
      arScore: 79,
      accuracy: 84,
      opportunity: 'Emerging bedroom soul act with rapid Spotify acceleration. Pre-signing window wide open.',
      contactPoint: 'Direct artist — Instagram / SubmitHub inquiry',
      socialLink: 'instagram.com/liladaye',
      streamingLink: 'open.spotify.com/artist/liladaye',
      contactConfidence: 55,
      responseLikelihood: 62,
      responseRisk: 'Low',
      aiScouts: ['Paragon', 'Nova'],
      humanCoSigns: [],
      dealReadinessScore: 58,
    },
    {
      rank: 8,
      name: 'Cato Strand',
      genre: 'Dark Folk / Ambient Pop',
      market: 'Oslo, Norway',
      momentum: '312K monthly listeners, European blog coverage, Tidal editorial add',
      labelStatus: 'Indie (self-distributed)',
      arScore: 72,
      accuracy: 81,
      opportunity: 'Nordic breakout with strong European tastemaker alignment. Low competition window.',
      contactPoint: 'Via booking agent — email in press kit',
      socialLink: 'instagram.com/catostrand',
      streamingLink: 'open.spotify.com/artist/catostrand',
      contactConfidence: 68,
      responseLikelihood: 55,
      responseRisk: 'Medium',
      aiScouts: ['Drift', 'Paragon'],
      humanCoSigns: [],
      dealReadinessScore: 55,
    },
    {
      rank: 9,
      name: 'Ayra Jae',
      genre: 'Afrobeats / Contemporary R&B',
      market: 'Accra, Ghana',
      momentum: '540K monthly listeners, +1,100% in 90 days, YouTube crossover building',
      labelStatus: 'Unsigned / Independent',
      arScore: 81,
      accuracy: 88,
      opportunity: 'Breakout Ghanaian Afrobeats act with diaspora appeal in UK and Canada. Sign window: 45 days.',
      contactPoint: 'Via management — WhatsApp / email in bio',
      socialLink: 'instagram.com/ayrajae',
      streamingLink: 'open.spotify.com/artist/ayrajae',
      contactConfidence: 72,
      responseLikelihood: 60,
      responseRisk: 'Low',
      aiScouts: ['Paragon', 'Prism', 'Flare'],
      humanCoSigns: ['Latie'],
      dealReadinessScore: 86,
    },
    {
      rank: 10,
      name: 'Makaio Huizar',
      genre: 'Alternative Pop',
      market: 'Arizona, USA',
      momentum: '20K monthly listeners, debut EP dropping April 24, 2026',
      labelStatus: 'Unsigned / Independent',
      arScore: 56,
      accuracy: 71,
      opportunity: 'Sign-before-the-EP play with a 30-day post-release bidding risk.',
      contactPoint: 'Direct artist — Instagram / email',
      socialLink: 'instagram.com/makaiohuizar',
      streamingLink: 'open.spotify.com/artist/makaiohuizar',
      contactConfidence: 60,
      responseLikelihood: 70,
      responseRisk: 'Low',
      aiScouts: ['Paragon'],
      humanCoSigns: [],
      dealReadinessScore: 52,
    },
  ],
  footerText: 'Report covers April 9, 2026. Generated by Paragon A&R Scout.',
  footerNote: 'Compiled from internal scouting inputs and referenced source tracking.',
};
