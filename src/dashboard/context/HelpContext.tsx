import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type HelpView = 'faq' | 'bug';

interface HelpContextValue {
  isOpen: boolean;
  view: HelpView;
  pageContext: string;
  openHelp: (view?: HelpView, page?: string) => void;
  openFAQ: (page?: string) => void;
  openBugReport: (page?: string) => void;
  close: () => void;
}

const HelpContext = createContext<HelpContextValue | null>(null);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<HelpView>('faq');
  const [pageContext, setPageContext] = useState('');

  const openHelp = useCallback((v: HelpView = 'faq', page = '') => {
    setView(v);
    setPageContext(page);
    setIsOpen(true);
  }, []);

  const openFAQ = useCallback((page = '') => {
    setView('faq');
    setPageContext(page);
    setIsOpen(true);
  }, []);

  const openBugReport = useCallback((page = '') => {
    setView('bug');
    setPageContext(page);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <HelpContext.Provider value={{ isOpen, view, pageContext, openHelp, openFAQ, openBugReport, close }}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp(): HelpContextValue {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error('useHelp must be used inside HelpProvider');
  return ctx;
}
