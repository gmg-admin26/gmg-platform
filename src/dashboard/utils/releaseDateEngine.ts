const PLANNING_YEAR_OFFSET = 0;

export const SUBMISSION_WINDOW_DAYS = 14;

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function getPlanningYear(): number {
  const now = new Date();
  const year = now.getFullYear() + PLANNING_YEAR_OFFSET;
  return year < 2026 ? 2026 : year;
}

export type DateType = 'optimal' | 'standard' | 'caution' | 'reserved';

export interface AvailableDateEntry {
  date: string;
  display: string;
  label: string;
  type: DateType;
  submissionDeadline: string;
  submissionDeadlineDisplay: string;
  note: string;
  recommended: boolean;
  warning?: string;
  conflictNote?: string;
}

interface BlackoutRange {
  label: string;
  start: { month: number; day: number };
  end: { month: number; day: number };
}

interface ConflictDate {
  month: number;
  day: number;
  label: string;
}

interface GenerateOptions {
  conflicts?: ConflictDate[];
  startFromDate?: Date;
  count?: number;
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function displayDate(year: number, month: number, day: number): string {
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function nextFriday(from: Date): Date {
  const d = new Date(from);
  const dow = d.getDay();
  const daysUntilFriday = (5 - dow + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilFriday);
  return d;
}

function isInBlackout(date: Date, blackouts: BlackoutRange[], year: number): string | null {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  for (const b of blackouts) {
    const startM = b.start.month, startD = b.start.day;
    const endM   = b.end.month,   endD   = b.end.day;
    const after  = (m > startM) || (m === startM && d >= startD);
    const before = (m < endM)   || (m === endM   && d <= endD);
    const wraps  = startM > endM;
    if (!wraps ? (after && before) : (after || before)) return b.label;
  }
  return null;
}

function getDateIntel(date: Date): { label: string; type: DateType; note: string; recommended: boolean; warning?: string } {
  const m = date.getMonth() + 1;
  const d = date.getDate();

  if (m === 5 && d <= 15)  return { label: 'AI Pick',     type: 'optimal',   note: 'Strong editorial window. Optimal for fan momentum.',             recommended: true  };
  if (m === 5 && d === 29) return { label: 'High Traffic', type: 'caution',   note: 'High listener volume. Risky for editorial support.',             recommended: false, warning: 'Memorial Day weekend — platform traffic peaks but editorial capacity limited.' };
  if (m === 6 && d <= 12)  return { label: 'Recommended', type: 'optimal',   note: 'Summer kickoff window. High fan engagement expected.',           recommended: true  };
  if (m === 6 && d >= 25)  return { label: 'Late June',   type: 'caution',   note: 'Q2 close — catalog spacing risk. Check release cadence.',        recommended: false, warning: 'Q2 close — avoid conflicts with label reporting cycle.' };
  if (m === 7 && d === 4)  return { label: 'Blackout',    type: 'caution',   note: 'July 4th — editorial pause.',                                   recommended: false, warning: 'July 4th holiday — editorial support unavailable.' };
  if (m === 7)             return { label: 'Standard',    type: 'standard',  note: 'Post-holiday window. Solid for streaming.',                     recommended: false };
  if (m === 8 && d <= 14)  return { label: 'Recommended', type: 'optimal',   note: 'Summer peak window. Strong for new material.',                  recommended: true  };
  if (m === 8)             return { label: 'Standard',    type: 'standard',  note: 'Late summer. Solid editorial attention.',                       recommended: false };
  if (m === 9 && d <= 7)   return { label: 'Standard',    type: 'standard',  note: 'Post-summer return. Solid editorial attention. Clean window.',   recommended: false };
  if (m === 9)             return { label: 'Recommended', type: 'optimal',   note: 'Fall kickoff. Strong playlist season.',                         recommended: true  };
  if (m === 10)            return { label: 'Standard',    type: 'standard',  note: 'Fall season. Consistent editorial support.',                    recommended: false };
  if (m === 11 && d <= 21) return { label: 'Standard',    type: 'standard',  note: 'Pre-holiday window. Good playlist placement.',                  recommended: false };
  if (m === 11)            return { label: 'Caution',     type: 'caution',   note: 'Thanksgiving window — editorial capacity reduced.',             recommended: false, warning: 'Thanksgiving period — editorial response time slower.' };
  if (m === 12)            return { label: 'High Traffic', type: 'caution',  note: 'Holiday season — high traffic, reduced editorial capacity.',    recommended: false, warning: 'Holiday window — high streaming traffic but editorial is limited.' };
  if (m === 4)             return { label: 'Recommended', type: 'optimal',   note: 'Spring window. Pre-summer editorial push. Strong DSP support.', recommended: true  };
  if (m === 3)             return { label: 'Standard',    type: 'standard',  note: 'Mid-spring. Solid release window.',                             recommended: false };
  return                          { label: 'Standard',    type: 'standard',  note: 'Standard release window.',                                     recommended: false };
}

export function generateAvailableDates(options: GenerateOptions = {}): AvailableDateEntry[] {
  const year = getPlanningYear();
  const conflicts = options.conflicts ?? [];
  const count = options.count ?? 10;

  const now = options.startFromDate ?? new Date();
  const earliestRelease = addDays(now, SUBMISSION_WINDOW_DAYS + 7);
  let cursor = nextFriday(earliestRelease);

  const BLACKOUTS: BlackoutRange[] = [
    { label: 'July 4',         start: { month: 7,  day: 4  }, end: { month: 7,  day: 4  } },
    { label: 'Thanksgiving',   start: { month: 11, day: 26 }, end: { month: 11, day: 29 } },
    { label: 'Holiday Window', start: { month: 12, day: 11 }, end: { month: 1,  day: 8  } },
  ];

  const results: AvailableDateEntry[] = [];

  while (results.length < count) {
    const m = cursor.getMonth() + 1;
    const d = cursor.getDate();
    const y = cursor.getFullYear();
    const dateStr = isoDate(y, m, d);
    const displayStr = displayDate(y, m, d);

    const blackout = isInBlackout(cursor, BLACKOUTS, y);
    const conflict = conflicts.find(c => c.month === m && c.day === d);
    const intel = getDateIntel(cursor);

    const submissionDate = addDays(cursor, -SUBMISSION_WINDOW_DAYS);
    const sm = submissionDate.getMonth() + 1;
    const sd = submissionDate.getDate();
    const sy = submissionDate.getFullYear();
    const submissionIso = isoDate(sy, sm, sd);
    const submissionDisplay = displayDate(sy, sm, sd);

    if (conflict) {
      results.push({
        date: dateStr,
        display: displayStr,
        label: 'Reserved',
        type: 'reserved',
        submissionDeadline: submissionIso,
        submissionDeadlineDisplay: submissionDisplay,
        note: `Reserved — ${conflict.label} scheduled here.`,
        recommended: false,
        conflictNote: `${conflict.label}`,
      });
    } else if (blackout) {
      results.push({
        date: dateStr,
        display: displayStr,
        label: 'Blackout',
        type: 'caution',
        submissionDeadline: submissionIso,
        submissionDeadlineDisplay: submissionDisplay,
        note: `${blackout} — editorial pause or limited capacity.`,
        recommended: false,
        warning: `${blackout} — release not recommended.`,
      });
    } else {
      results.push({
        date: dateStr,
        display: displayStr,
        label: intel.label,
        type: intel.type,
        submissionDeadline: submissionIso,
        submissionDeadlineDisplay: submissionDisplay,
        note: intel.note,
        recommended: intel.recommended,
        warning: intel.warning,
      });
    }

    cursor = addDays(cursor, 7);
    if (results.length > count * 3) break;
  }

  return results.slice(0, count);
}

export function generateAllFutureFridays(options: GenerateOptions = {}): AvailableDateEntry[] {
  const conflicts = options.conflicts ?? [];
  const count = options.count ?? 104;

  const now = options.startFromDate ?? new Date();
  const earliestRelease = addDays(now, SUBMISSION_WINDOW_DAYS + 7);
  let cursor = nextFriday(earliestRelease);

  const BLACKOUTS: BlackoutRange[] = [
    { label: 'July 4',         start: { month: 7,  day: 4  }, end: { month: 7,  day: 4  } },
    { label: 'Thanksgiving',   start: { month: 11, day: 26 }, end: { month: 11, day: 29 } },
    { label: 'Holiday Window', start: { month: 12, day: 11 }, end: { month: 1,  day: 8  } },
  ];

  const results: AvailableDateEntry[] = [];
  let safetyLimit = 0;

  while (results.length < count && safetyLimit < count * 3) {
    safetyLimit++;
    const m = cursor.getMonth() + 1;
    const d = cursor.getDate();
    const y = cursor.getFullYear();
    const dateStr = isoDate(y, m, d);
    const displayStr = displayDate(y, m, d);

    const blackout = isInBlackout(cursor, BLACKOUTS, y);
    const conflict = conflicts.find(c => c.month === m && c.day === d);
    const intel = getDateIntel(cursor);

    const submissionDate = addDays(cursor, -SUBMISSION_WINDOW_DAYS);
    const sm = submissionDate.getMonth() + 1;
    const sd = submissionDate.getDate();
    const sy = submissionDate.getFullYear();
    const submissionIso = isoDate(sy, sm, sd);
    const submissionDisplay = displayDate(sy, sm, sd);

    if (conflict) {
      results.push({
        date: dateStr, display: displayStr,
        label: 'Reserved', type: 'reserved',
        submissionDeadline: submissionIso, submissionDeadlineDisplay: submissionDisplay,
        note: `Reserved — ${conflict.label} scheduled here.`,
        recommended: false, conflictNote: `${conflict.label}`,
      });
    } else if (blackout) {
      results.push({
        date: dateStr, display: displayStr,
        label: 'Blackout', type: 'caution',
        submissionDeadline: submissionIso, submissionDeadlineDisplay: submissionDisplay,
        note: `${blackout} — editorial pause or limited capacity.`,
        recommended: false, warning: `${blackout} — release not recommended.`,
      });
    } else {
      results.push({
        date: dateStr, display: displayStr,
        label: intel.label, type: intel.type,
        submissionDeadline: submissionIso, submissionDeadlineDisplay: submissionDisplay,
        note: intel.note, recommended: intel.recommended, warning: intel.warning,
      });
    }

    cursor = addDays(cursor, 7);
  }

  return results;
}

export function formatReleaseYear(releaseDate: string): number {
  const y = parseInt(releaseDate.slice(0, 4), 10);
  return isNaN(y) ? getPlanningYear() : y;
}

export function copyrightYear(releaseDate?: string): number {
  if (!releaseDate) return getPlanningYear();
  const match = releaseDate.match(/\b(20\d{2})\b/);
  if (match) return parseInt(match[1], 10);
  return getPlanningYear();
}
