"use client";
import { createContext, useContext, useMemo, useState, ReactNode } from "react";

/* ------------------ Types ------------------ */

type LayoutState = {
  chat: boolean;
  explorer: boolean;
  terminal: boolean;
};

type LayoutContextType = {
  isCollapse: LayoutState;
  toggle: (key: keyof LayoutState) => void;
  setCollapse: React.Dispatch<React.SetStateAction<LayoutState>>;
};

type LayoutProviderProps = {
  children: ReactNode;
};

/* ------------------ Context ------------------ */

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

/* ------------------ Provider ------------------ */

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [isCollapse, setCollapse] = useState<LayoutState>({
    chat: false,
    explorer: false,
    terminal: false,
  });

  const toggle = (key: keyof LayoutState) => {
    setCollapse((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const methods = useMemo(
    () => ({
      isCollapse,
      toggle,
      setCollapse,
    }),
    [isCollapse],
  );

  return (
    <LayoutContext.Provider value={methods}>{children}</LayoutContext.Provider>
  );
}

/* ------------------ Custom Hook ------------------ */

export function useLayout(): LayoutContextType {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("useLayout must be used inside LayoutProvider");
  }

  return context;
}
