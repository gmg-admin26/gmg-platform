import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  CatalogClient, CatalogClientWithRoster, fetchAllClients, fetchClientById,
} from '../data/catalogClientService';

const STORAGE_KEY = 'gmg_catalog_client_id';

interface CatalogClientContextValue {
  clients: CatalogClient[];
  activeClient: CatalogClientWithRoster | null;
  loading: boolean;
  switchClient: (id: string) => void;
}

const CatalogClientContext = createContext<CatalogClientContextValue>({
  clients: [],
  activeClient: null,
  loading: true,
  switchClient: () => {},
});

export function CatalogClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<CatalogClient[]>([]);
  const [activeClient, setActiveClient] = useState<CatalogClientWithRoster | null>(null);
  const [loading, setLoading] = useState(true);

  const loadClient = useCallback(async (id: string) => {
    const c = await fetchClientById(id);
    if (c) {
      setActiveClient(c);
      localStorage.setItem(STORAGE_KEY, id);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await fetchAllClients();
      setClients(all);
      const authRole = localStorage.getItem('catalogos_role') || sessionStorage.getItem('catalogos_role') || '';
      const authClientId = localStorage.getItem('catalogos_client_id') || sessionStorage.getItem('catalogos_client_id') || '';
      // Admins have no per-client context — skip auto-loading any active client
      if (authRole !== 'catalog_admin') {
        if (all.length > 0) {
          const saved = localStorage.getItem(STORAGE_KEY);
          const preferredId = authClientId || saved;
          const match = preferredId ? all.find(c => c.id === preferredId) : null;
          if (match) await loadClient(match.id);
        }
      }
      setLoading(false);
    })();
  }, [loadClient]);

  const switchClient = useCallback(async (id: string) => {
    setLoading(true);
    await loadClient(id);
    setLoading(false);
  }, [loadClient]);

  return (
    <CatalogClientContext.Provider value={{ clients, activeClient, loading, switchClient }}>
      {children}
    </CatalogClientContext.Provider>
  );
}

export function useCatalogClient() {
  return useContext(CatalogClientContext);
}
