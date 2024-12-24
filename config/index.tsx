import React from "react";

export const config = {
  isProduction: process.env.NODE_ENV === "production",
};

export const Index: Record<string, any> = {
  "status-button": {
    registryDependencies: undefined,
    component: React.lazy(() => import("@/docs/buttons/status-button")),
  },
};
