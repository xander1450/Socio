import { createContext } from "react";

export const AuthContext = createContext<{
  user: any;
  setUser: (u: any) => void;
}>({
  user: null,
  setUser: () => {},
});
