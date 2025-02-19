// contexts/ui/UIContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

interface UIState {
  showRegisterPremium: boolean;
  showFilter: boolean;
  showSearch: boolean;
  showMoreOption: boolean;
  showLocationFilter: boolean;
  showStoreList: boolean;
  isScrolled: boolean;
}

interface UIContextType extends UIState {
  toggleShowList: () => void;
  setShowRegisterPremium: (show: boolean) => void;
  setShowFilter: (show: boolean) => void;
  setShowSearch: (show: boolean) => void;
  setShowMoreOption: (show: boolean) => void;
  setShowLocationFilter: (show: boolean) => void;
  setShowStoreList: (show: boolean) => void;
  setIsScrolled: (scrolled: boolean) => void;
}

interface UIProviderProps extends React.PropsWithChildren {
  initialShowSearch?: boolean;
}

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider: React.FC<UIProviderProps> = ({
  children,
  initialShowSearch = false,
}) => {
  const history = useHistory();
  const location = useLocation();

  const [state, setState] = useState<UIState>({
    showRegisterPremium: false,
    showFilter: false,
    showSearch: initialShowSearch,
    showMoreOption: false,
    showLocationFilter: false,
    showStoreList: true,
    isScrolled: false,
  });

  const setShowRegisterPremium = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showRegisterPremium: show }));
  }, []);

  const setShowFilter = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showFilter: show }));
  }, []);

  const setShowSearch = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showSearch: show }));
  }, []);

  const setShowMoreOption = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showMoreOption: show }));
  }, []);

  const setShowLocationFilter = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showLocationFilter: show }));
  }, []);

  const setShowStoreList = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showStoreList: show }));
  }, []);

  const setIsScrolled = useCallback((scrolled: boolean) => {
    setState((prev) => ({ ...prev, isScrolled: scrolled }));
  }, []);

  const toggleShowList = useCallback(() => {
    setState((prev) => {
      const newShowStoreList = !prev.showStoreList;

      // view 쿼리 파라미터 업데이트
      const newQuery = new URLSearchParams(location.search);
      newQuery.set("view", newShowStoreList ? "list" : "map");

      // history 업데이트
      history.replace({
        pathname: location.pathname,
        search: newQuery.toString(),
        state: location.state,
      });

      return { ...prev, showStoreList: newShowStoreList };
    });
  }, [history, location]);

  const value = {
    ...state,
    setShowRegisterPremium,
    setShowFilter,
    setShowSearch,
    setShowMoreOption,
    setShowLocationFilter,
    setShowStoreList,
    setIsScrolled,
    toggleShowList,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
};
