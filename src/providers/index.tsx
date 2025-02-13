import React from "react";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="code-snippet-extension-theme"
    >
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}

export default Providers;
