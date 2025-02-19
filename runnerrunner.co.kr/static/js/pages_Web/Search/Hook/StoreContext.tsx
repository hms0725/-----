// contexts/store/StoreContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { Cafe } from "../../../../api/types";

interface StoreState {
  cityText: string;
  selectedStore: Cafe | null;
}

interface StoreContextType extends StoreState {
  setCityText: (text: string) => void;
  setSelectedStore: (store: Cafe | null) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<StoreState>({
    cityText: "서울특별시 강남구",
    selectedStore: null,
  });

  const setCityText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, cityText: text }));
  }, []);

  const setSelectedStore = useCallback((store: Cafe | null) => {
    setState((prev) => ({ ...prev, selectedStore: store }));
  }, []);

  const value = {
    ...state,
    setCityText,
    setSelectedStore,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};
