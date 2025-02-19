// PopupContext.tsx
import { enqueueSnackbar } from "notistack";
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";

interface PopupContextType {
  isPopupOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = useCallback(() => {
    setIsPopupOpen(true);
    window.history.pushState({ popup: true }, "");
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    if (window.history.state && window.history.state.popup) {
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const handlePopstate = (event: PopStateEvent) => {
      if (event.state && !event.state.popup) {
        setIsPopupOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  return (
    <PopupContext.Provider value={{ isPopupOpen, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};
