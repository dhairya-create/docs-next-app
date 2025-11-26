// app/documents/[documentId]/DocumentRoom.tsx
"use client";

import { ReactNode } from "react";
import { Room } from "./Room";

export default function DocumentRoom({ users, children }: any) {
  return <Room users={users}>{children}</Room>;
}
