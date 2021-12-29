import { initializeApp } from "firebase/app";
import { User, getAuth, Auth } from "firebase/auth";
import React, { createContext } from "react";

import { FIREBASE_KEY } from "@env";
const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: "personal-261304.firebaseapp.com",
  projectId: "personal-261304",
  storageBucket: "personal-261304.appspot.com",
  messagingSenderId: "1076294747951",
  appId: "1:1076294747951:web:e9dc5db7f65cdfaa3343da",
  measurementId: "G-KGZGCMVZKM",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();

interface AuthContext {
  user?: User
  setUser: (user: User) => void
  username?: String
  setUserName: (username: string) => void
  auth: Auth
}

// TODO: Subscribe to auth state using firebase and update this context accordingly!
export const AuthUserContext = createContext<AuthContext>({
  user: undefined,
  setUser: (user: User) => {},
  username: undefined,
  setUserName: (username: string) => {},
  auth: auth,
});
