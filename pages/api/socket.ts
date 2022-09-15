import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/socket-io";

/*
  This endpoint is only used to attach a Socket.io server into a client's
  communication with the Next.js server.
*/
export default function handler(
  _: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, { path: "/api/socket" });
    res.socket.server.io = io;
  }
  res.end();
}
