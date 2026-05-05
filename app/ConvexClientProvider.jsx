"use client";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useStoreUser } from "@/hooks/use-store-user";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Separate component so it can use Convex hooks inside the provider
function StoreUserWrapper({ children }) {
  const { isLoading } = useStoreUser();
  if (isLoading) return null; // wait until user is stored
  return children;
}

export function ConvexClientProvider({ children }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <StoreUserWrapper>
        {children}
      </StoreUserWrapper>
    </ConvexProviderWithClerk>
  );
}