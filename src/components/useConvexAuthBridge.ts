"use client";

import { useAuth, useOrganization } from "@clerk/nextjs";
import { useEffect } from "react";
import { convex } from "./providers";

export function useConvexAuthBridge() {
  const auth = useAuth();
  const { organization, isLoaded: orgLoaded } = useOrganization();

  useEffect(() => {
    if (!auth.isLoaded || !orgLoaded) return;

    convex.setAuth(async () => {
      const token = await auth.getToken({ template: "convex" });
      return token ?? null;
    });
  }, [auth.isLoaded, orgLoaded, organization?.id]);

  return auth;
}
