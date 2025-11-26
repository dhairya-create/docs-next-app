"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Navbar from "./Navbar";
import ToolBar from "./toolbar";
import { Editor } from "./editor";
import { Room } from "./Room";

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
  users: any[];
}

export default function Document({ preloadedDocument, users }: DocumentProps) {
  const document = usePreloadedQuery(preloadedDocument);
  return (
    <Room users={users}>
      <div className="min-h-screen bg-[#FAFBFB]">
        <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
          <Navbar data={document} />
          <ToolBar />
        </div>

        <div className="pt-[114px] print:pt-0">
          <Editor initialContent={document.initialContent} />
        </div>
      </div>
    </Room>
  );
}
