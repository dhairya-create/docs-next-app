"use client";

import { useAuth, useOrganization } from "@clerk/nextjs";
import { useEffect } from "react";
import { convex } from "./providers"; // or import your Convex client if exported elsewhere

export function useConvexAuthBridge() {
  const auth = useAuth();
  const { organization } = useOrganization();

  useEffect(() => {
    // Refresh token whenever org changes
    convex.setAuth(async () => {
      try {
        return await auth.getToken({ template: "convex" });
      } catch {
        return null;
      }
    });
  }, [organization, auth]);

  return auth; // ConvexProviderWithClerk will use this
}
