// app/documents/[documentId]/page.tsx

import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { getUsers } from "./actions";
import Document from "./Document";

interface PageProps {
  params: {
    documentId: string; // comes in as string from URL
  };
}

export default async function DocumentPage({ params }: PageProps) {
  const { documentId } = params;

  // Cast string → Convex Document ID
  const convexId = documentId as Id<"documents">;

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: convexId }
  );

  const users = await getUsers();

  return (
    <Document
      preloadedDocument={preloadedDocument}
      users={users}
    />
  );
}
