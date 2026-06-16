"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type PanelName = "terminal" | "explorer" | "chat";

type LayoutState = {
  terminal: boolean;
  explorer: boolean;
  chat: boolean;
};

type LayoutContextType = {
  panels: LayoutState;
  toggle: (panel: PanelName) => void;
  open: (panel: PanelName) => void;
  close: (panel: PanelName) => void;
  setPanel: (panel: PanelName, value: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [panels, setPanels] = useState<LayoutState>({
    terminal: false,
    explorer: false,
    chat: false,
  });

  const toggle = (panel: PanelName) => {
    setPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  const open = (panel: PanelName) => {
    setPanels((prev) => ({
      ...prev,
      [panel]: true,
    }));
  };

  const close = (panel: PanelName) => {
    setPanels((prev) => ({
      ...prev,
      [panel]: false,
    }));
  };

  const setPanel = (panel: PanelName, value: boolean) => {
    setPanels((prev) => ({
      ...prev,
      [panel]: value,
    }));
  };

  return (
    <LayoutContext.Provider
      value={{
        panels,
        toggle,
        open,
        close,
        setPanel,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("useLayout must be used inside LayoutProvider");
  }

  return context;
}
