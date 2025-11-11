"use client";

import { ReactNode, useEffect, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { useConvexAuthBridge } from "./useConvexAuthBridge";

export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <FullScreenLoader label="Starting app..." />;

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useConvexAuthBridge}>
        <NuqsAdapter>
          {children}
          <Toaster position="top-center" />
        </NuqsAdapter>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
