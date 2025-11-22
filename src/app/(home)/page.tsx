"use client";

import { useEffect, useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { Navbar } from "./navbar";
import TemplateGallery from "./TemplateGallery";
import { api } from "../../../convex/_generated/api";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import DocumentsTable from "./DocumentTable";
import { useSearchparam } from "@/hooks/useSearchParam";

const Home = () => {
  const { isLoaded, userId } = useAuth();
  const [search] = useSearchparam();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Always call the hook in the same order
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.getDocuments,
    // 👉 Pass `undefined` args when not ready — Convex will no-op
    mounted && isLoaded && userId
      ? { search }
      : "skip",
    { initialNumItems: 5 }
  );

  // ✅ Return loaders normally — hook order stays stable
  if (!mounted) return <FullScreenLoader label="Loading App..." />;
  if (!isLoaded) return <FullScreenLoader label="Authenticating..." />;
  if (!userId) return <RedirectToSignIn />;


  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplateGallery />
        {results && (
          <DocumentsTable
            documents={results}
            loadMore={loadMore}
            status={status}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
