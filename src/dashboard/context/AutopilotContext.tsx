import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export type AutopilotMode = 'manual' | 'assisted' | 'autopilot';

export interface ExecutedAction {
  id: string;
  label: string;
  artist: string;
  timestamp: number;
  mode: AutopilotMode;
}

export interface QueuedAction {
  id: string;
  label: string;
  artist: string;
  trigger: string;
  scheduledAt: number;
  confidence: number;
}

interface AutopilotState {
  mode: AutopilotMode;
  liveSignals: number;
  nextExecutionIn: number;
  lastExecutedAgo: number | null;
  executionLog: ExecutedAction[];
  queuedActions: QueuedAction[];
  isExecuting: boolean;
  executedToday: number;
  awaitingApproval: number;
  weeklyLiftStreams: number;
  weeklyProjectedValue: { low: number; high: number };
  lastScanTs: number;
  weeklyActionsApproved: number;
  weeklyActionsAutonomous: number;
  weeklyActionsSurfaced: number;
  weeklyRisksPrevented: number;
}

interface AutopilotContextValue extends AutopilotState {
  setMode: (mode: AutopilotMode) => void;
  logExecution: (action: Omit<ExecutedAction, 'timestamp' | 'mode'>) => void;
  enqueueAction: (action: Omit<QueuedAction, 'scheduledAt'>) => void;
  clearQueue: () => void;
}

const AutopilotContext = createContext<AutopilotContextValue | null>(null);

const SIGNAL_COUNTS: Record<AutopilotMode, number> = {
  manual: 0,
  assisted: 14,
  autopilot: 31,
};

const EXECUTION_INTERVAL_MS = 8 * 60 * 1000;

const DEMO_QUEUE: QueuedAction[] = [
  { id: 'q1', label: 'Scale Brazil paid media +$150 — geo conversion window active', artist: 'All American Rejects', trigger: 'São Paulo velocity +340% · 2.1× ROI threshold crossed', scheduledAt: Date.now() + 4 * 60 * 1000, confidence: 94 },
  { id: 'q2', label: 'Submit "Flagpole Sitta" to Spotify editorial — deadline in 3 days', artist: 'All American Rejects', trigger: 'Pre-save pace hit submission threshold · editorial window open', scheduledAt: Date.now() + 9 * 60 * 1000, confidence: 88 },
  { id: 'q3', label: 'Deploy TikTok creator seed pack — 6 matched creators queued', artist: 'All American Rejects', trigger: 'Momentum score 87 · sound velocity active · window expires 6h', scheduledAt: Date.now() + 15 * 60 * 1000, confidence: 79 },
];

const WEEKLY_STATS_BY_MODE: Record<AutopilotMode, {
  executedToday: number; awaitingApproval: number; weeklyLiftStreams: number;
  weeklyProjectedValue: { low: number; high: number };
  weeklyActionsApproved: number; weeklyActionsAutonomous: number;
  weeklyActionsSurfaced: number; weeklyRisksPrevented: number;
}> = {
  manual: {
    executedToday: 0, awaitingApproval: 0, weeklyLiftStreams: 0,
    weeklyProjectedValue: { low: 0, high: 0 },
    weeklyActionsApproved: 0, weeklyActionsAutonomous: 0,
    weeklyActionsSurfaced: 4, weeklyRisksPrevented: 0,
  },
  assisted: {
    executedToday: 2, awaitingApproval: 2, weeklyLiftStreams: 18400,
    weeklyProjectedValue: { low: 12000, high: 22000 },
    weeklyActionsApproved: 3, weeklyActionsAutonomous: 0,
    weeklyActionsSurfaced: 7, weeklyRisksPrevented: 1,
  },
  autopilot: {
    executedToday: 4, awaitingApproval: 0, weeklyLiftStreams: 31200,
    weeklyProjectedValue: { low: 18000, high: 34000 },
    weeklyActionsApproved: 3, weeklyActionsAutonomous: 2,
    weeklyActionsSurfaced: 7, weeklyRisksPrevented: 1,
  },
};

export function AutopilotProvider({ children }: { children: React.ReactNode }) {
  const storedMode = (localStorage.getItem('autopilot_mode') as AutopilotMode) || 'manual';

  const [mode, setModeState] = useState<AutopilotMode>(storedMode);
  const [liveSignals, setLiveSignals] = useState(SIGNAL_COUNTS[storedMode]);
  const [nextExecutionIn, setNextExecutionIn] = useState(6 * 60);
  const [lastExecutedAgo, setLastExecutedAgo] = useState<number | null>(null);
  const [executionLog, setExecutionLog] = useState<ExecutedAction[]>([]);
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastScanTs, setLastScanTs] = useState(Date.now() - 47000);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextExecRef = useRef(nextExecutionIn);
  nextExecRef.current = nextExecutionIn;

  const setMode = useCallback((next: AutopilotMode) => {
    setModeState(next);
    localStorage.setItem('autopilot_mode', next);
    setLiveSignals(SIGNAL_COUNTS[next]);
    if (next === 'autopilot') {
      setQueuedActions(DEMO_QUEUE);
      setNextExecutionIn(6 * 60);
    } else if (next === 'assisted') {
      setQueuedActions(DEMO_QUEUE.slice(0, 2));
      setNextExecutionIn(12 * 60);
    } else {
      setQueuedActions([]);
    }
  }, []);

  const logExecution = useCallback((action: Omit<ExecutedAction, 'timestamp' | 'mode'>) => {
    const entry: ExecutedAction = { ...action, timestamp: Date.now(), mode };
    setExecutionLog(prev => [entry, ...prev].slice(0, 50));
    setLastExecutedAgo(0);
  }, [mode]);

  const enqueueAction = useCallback((action: Omit<QueuedAction, 'scheduledAt'>) => {
    const entry: QueuedAction = { ...action, scheduledAt: Date.now() + nextExecRef.current * 1000 };
    setQueuedActions(prev => [...prev, entry]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueuedActions([]);
  }, []);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setNextExecutionIn(prev => {
        if (prev <= 1) {
          if (mode === 'autopilot') {
            setIsExecuting(true);
            setTimeout(() => {
              setIsExecuting(false);
              setQueuedActions(q => {
                if (q.length > 0) {
                  const [first, ...rest] = q;
                  logExecution({ id: first.id, label: first.label, artist: first.artist });
                  return rest;
                }
                return q;
              });
            }, 1800);
          }
          return Math.floor(EXECUTION_INTERVAL_MS / 1000);
        }
        return prev - 1;
      });

      setLastExecutedAgo(prev => (prev !== null ? prev + 1 : null));

      setLiveSignals(base => {
        const target = SIGNAL_COUNTS[mode];
        if (target === 0) return 0;
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(target - 4, Math.min(target + 4, base + delta));
      });

      setLastScanTs(prev => {
        const age = (Date.now() - prev) / 1000;
        if (age > 90 + Math.random() * 60) return Date.now();
        return prev;
      });
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [mode, logExecution]);

  const ws = WEEKLY_STATS_BY_MODE[mode];

  return (
    <AutopilotContext.Provider value={{
      mode, liveSignals, nextExecutionIn, lastExecutedAgo, executionLog,
      queuedActions, isExecuting, lastScanTs,
      executedToday: ws.executedToday,
      awaitingApproval: ws.awaitingApproval,
      weeklyLiftStreams: ws.weeklyLiftStreams,
      weeklyProjectedValue: ws.weeklyProjectedValue,
      weeklyActionsApproved: ws.weeklyActionsApproved,
      weeklyActionsAutonomous: ws.weeklyActionsAutonomous,
      weeklyActionsSurfaced: ws.weeklyActionsSurfaced,
      weeklyRisksPrevented: ws.weeklyRisksPrevented,
      setMode, logExecution, enqueueAction, clearQueue,
    }}>
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot() {
  const ctx = useContext(AutopilotContext);
  if (!ctx) throw new Error('useAutopilot must be used within AutopilotProvider');
  return ctx;
}
