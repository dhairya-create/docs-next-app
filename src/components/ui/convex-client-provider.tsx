"use client";

import { ReactNode } from "react";
import { ClerkProvider, SignIn, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  ConvexReactClient,
  AuthLoading,
  Authenticated,
  Unauthenticated,
} from "convex/react";
import FullScreenLoader from "./FullScreenLoader";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk 
      useAuth={useAuth}
      client={convex} 
      >
        <Authenticated>
        {children}
        </Authenticated>
        <Unauthenticated>
        <SignIn routing="hash"/>
        </Unauthenticated>
        <AuthLoading>
          <FullScreenLoader label="Auth loading"/>
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
