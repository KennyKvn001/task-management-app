import { createContext, useContext, type ReactNode } from 'react';

type ViewContextType = 'assigned' | 'created' | 'upcoming' | null;

interface ViewContextProviderProps {
  children: ReactNode;
  viewType: ViewContextType;
}

const ViewContext = createContext<ViewContextType>(null);

export function ViewContextProvider({ children, viewType }: ViewContextProviderProps) {
  return (
    <ViewContext.Provider value={viewType}>
      {children}
    </ViewContext.Provider>
  );
}

export function useViewContext() {
  return useContext(ViewContext);
}

