import React, { createContext, useContext } from "react";
import { useSearch } from "./useSearch";

const SearchContext = createContext<ReturnType<typeof useSearch> | null>(null);

export const SearchProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const searchData = useSearch();
  return (
    <SearchContext.Provider value={searchData}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
