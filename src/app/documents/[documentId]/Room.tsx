"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import { useOrganization, useUser } from "@clerk/nextjs";
import { getDocuments } from "./actions";
import { Id } from "../../../../convex/_generated/dataModel";

type User = {
  id: string;
  name: string;
  avatar: string;
};

export function Room({
  children,
  users,
}: {
  children: ReactNode;
  users: User[];
}) {
  const params = useParams();
   const user = useUser();
  const org = useOrganization();

  return (
    <LiveblocksProvider
      authEndpoint={async () => {
        const endPoint = "/api/liveblocks-auth";
        const room = params.documentId as string;

        const response = await fetch(endPoint,{
          method:"POST",
          body:JSON.stringify({room})
        })

        return await response.json();

      }}
      resolveUsers={({ userIds }) =>
        userIds.map((id) => users.find((u) => u.id === id) as User)
      }
      resolveMentionSuggestions={({ text }) => {
        let filtered = users;

        if (text) {
          filtered = users.filter((u) =>
            u.name.toLowerCase().includes(text.toLowerCase())
          );
        }

        return filtered.map((u) => u.id);
      }}

      resolveRoomsInfo={async ({roomIds}) => {
        const documents = await getDocuments(roomIds as Id<"documents">[])
        return documents.map((document) => ({
          id:document.id,
          name:document.name
        }))
      }}
    >
      <RoomProvider id={params.documentId as string} initialStorage={{leftMargin:56,rightMargin:56}}>
        <ClientSideSuspense fallback={<FullScreenLoader label="Room Loading" />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

