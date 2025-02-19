import { createContext } from "react";
import { Cafe } from "../../../api/types";

export const StoreContext = createContext<{
  data: Cafe;
  update: () => void;
}>({
  data: {} as Cafe,
  update: () => {},
});
