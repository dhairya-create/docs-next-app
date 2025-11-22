import { ReactNode } from "react";
import { getUsers } from "./actions";
import { Room } from "./Room";

interface DocumentRoomProps {
  children: ReactNode;
}

export default async function DocumentRoom({ children }: DocumentRoomProps) {
  const users = await getUsers(); // SERVER SAFE

  

console.log(users);

  return <Room users={users}>{children}</Room>;
}
