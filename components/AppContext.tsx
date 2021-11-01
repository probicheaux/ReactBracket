import React from "react";

const AppContext = React.createContext({
  token: "" as string | null | undefined,
  scheme: "",
});

export default AppContext;
