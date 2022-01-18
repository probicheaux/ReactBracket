import { User } from "firebase/auth";
import React, { createContext } from "react";
import { fireBaseAuth } from "../firebase/config";

const auth = fireBaseAuth.getAuth();

// TODO: Subscribe to auth state using firebase and update this context accordingly!
export const AuthUserContext = createContext({
  user: null as User | null,
  setUser: (user: User | null) => {},
  username: null as string | null,
  setUserName: (username: string | null) => {},
  auth: auth,
});
