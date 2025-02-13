import React from "react";
import QueryProvider from "./query-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}

export default Providers;
