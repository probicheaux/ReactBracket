import React from "react";

type ColorScheme = 'light' | 'dark'

const AppContext = React.createContext({
  token: "" as string | null | undefined,
  scheme: 'light' as ColorScheme,
});

export default AppContext;
