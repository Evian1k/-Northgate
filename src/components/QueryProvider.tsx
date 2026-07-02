"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientDefaults } from "@/lib/api-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: queryClientDefaults,
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
