import { User } from "firebase/auth";
import React, { createContext } from "react";

// TODO: Subscribe to auth state using firebase and update this context accordingly!
export const AuthUserContext = createContext({
  user: null as User | null,
  setUser: (user: User) => {},
});
