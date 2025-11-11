"use client"
import { PaginationStatus } from "convex/react";
import { Doc } from "../../../convex/_generated/dataModel";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderIcon } from "lucide-react";
import DocumentRow from "./DocumentRow";
import { Button } from "@/components/ui/button";

interface DocumentstableProps {
  documents: Doc<"documents">[] | undefined;
  loadMore: (nummItems: number) => void;
  status: PaginationStatus;
}

const DocumentsTable = ({
  documents,
  loadMore,
  status,
}: DocumentstableProps) => {
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-5 mt-10">
      <h3 className="font-medium text-[#202124] text-lg">Documents</h3>
      {documents === undefined ? (
        <div className="flex justify-center items-center h-24">
          <LoaderIcon className="animate-spin text-muted-foreground size-5" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-semibold text-[#5f6368] text-sm">
                Name
              </TableHead>
              <TableHead className="text-[#5f6368] text-sm hidden md:table-cell">
                Shared
              </TableHead>
              <TableHead className="text-[#5f6368] text-sm hidden md:table-cell">
                Created at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <DocumentRow key={doc._id} document={doc} />
              ))
            )}
          </TableBody>
        </Table>
      )}
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadMore(5)}
          disabled={status !== "CanLoadMore"}
        >
          {status === "CanLoadMore" ? "Load more" : "End of results"}
        </Button>
      </div>
    </div>
  );
};

export default DocumentsTable;
