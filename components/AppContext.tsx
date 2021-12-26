import React from "react";

type ColorScheme = 'light' | 'dark'

const AppContext = React.createContext({
  token: "" as string | null | undefined,
  setToken: (token: string) => {},
  scheme: 'light' as ColorScheme,
});

export default AppContext;
