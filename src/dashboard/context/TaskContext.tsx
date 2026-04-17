import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { Task, TaskSystem, CreateTaskInput, TaskStatus } from '../data/taskService';
import {
  fetchTasks, createTask, updateTaskStatus, updateTask, MOCK_TASKS,
} from '../data/taskService';

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  submitOpen: boolean;
  submitSystem: TaskSystem;
  submitEntityName: string;
  detailTaskId: string | null;
  loadTasks: (system?: TaskSystem) => Promise<void>;
  openSubmit: (system?: TaskSystem, entityName?: string) => void;
  closeSubmit: () => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  addTask: (input: CreateTaskInput) => Promise<Task>;
  changeStatus: (id: string, status: TaskStatus, by: string, note?: string) => Promise<void>;
  patchTask: (id: string, patch: Partial<Task>) => Promise<void>;
  useMock: boolean;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitSystem, setSubmitSystem] = useState<TaskSystem>('catalog_os');
  const [submitEntityName, setSubmitEntityName] = useState('');
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);
  const fetchedRef = useRef(false);

  const seedMock = useCallback(() => {
    const mockWithIds: Task[] = MOCK_TASKS.map((t, i) => ({
      ...t,
      id: `mock-${i}`,
      created_at: new Date(Date.now() - i * 3_600_000).toISOString(),
      updated_at: new Date(Date.now() - i * 1_800_000).toISOString(),
    }));
    setTasks(mockWithIds);
    setUseMock(true);
  }, []);

  const loadTasks = useCallback(async (system?: TaskSystem) => {
    if (fetchedRef.current && !system) return;
    setLoading(true);
    try {
      const data = await fetchTasks(system);
      if (data.length === 0 && !system) {
        seedMock();
      } else {
        setTasks(data);
        setUseMock(false);
      }
      fetchedRef.current = true;
    } catch {
      seedMock();
    } finally {
      setLoading(false);
    }
  }, [seedMock]);

  const openSubmit = useCallback((system: TaskSystem = 'catalog_os', entityName = '') => {
    setSubmitSystem(system);
    setSubmitEntityName(entityName);
    setSubmitOpen(true);
  }, []);

  const closeSubmit = useCallback(() => setSubmitOpen(false), []);
  const openDetail  = useCallback((id: string) => setDetailTaskId(id), []);
  const closeDetail = useCallback(() => setDetailTaskId(null), []);

  const addTask = useCallback(async (input: CreateTaskInput): Promise<Task> => {
    if (useMock) {
      const t: Task = {
        ...input,
        id: `mock-${Date.now()}`,
        assignee_name: input.assignee_name ?? 'Unassigned',
        assignee_type: input.assignee_type ?? 'human_team',
        priority: input.priority ?? 'medium',
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTasks(prev => [t, ...prev]);
      return t;
    }
    const t = await createTask(input);
    setTasks(prev => [t, ...prev]);
    return t;
  }, [useMock]);

  const changeStatus = useCallback(async (id: string, status: TaskStatus, by: string, note?: string) => {
    if (!useMock) {
      await updateTaskStatus(id, status, by, note);
    }
    setTasks(prev => prev.map(t => t.id === id
      ? { ...t, status, updated_at: new Date().toISOString(), ...(status === 'completed' ? { completed_by: by, completed_at: new Date().toISOString() } : {}) }
      : t
    ));
  }, [useMock]);

  const patchTask = useCallback(async (id: string, patch: Partial<Task>) => {
    if (!useMock) {
      await updateTask(id, patch);
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch, updated_at: new Date().toISOString() } : t));
  }, [useMock]);

  return (
    <TaskContext.Provider value={{
      tasks, loading,
      submitOpen, submitSystem, submitEntityName,
      detailTaskId,
      loadTasks, openSubmit, closeSubmit,
      openDetail, closeDetail,
      addTask, changeStatus, patchTask,
      useMock,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider');
  return ctx;
}
