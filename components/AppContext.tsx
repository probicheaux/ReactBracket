import React from "react";

type ColorScheme = "light" | "dark";

const AppContext = React.createContext({
  scheme: "dark" as ColorScheme,
  setScheme: (scheme: ColorScheme) => {},
});

export default AppContext;
