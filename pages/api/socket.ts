import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/socket-io";

/*
  This endpoint is only used to attach a Socket.io server into a client's
  communication with the Next.js server.

  When a io("https://...") object is instantiated, it tries to query this endpoint
  behind the scenes.
*/
export default function handler(
  _: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    res.socket.server.io = new Server(res.socket.server, { path: "/api/socket" });
  }
  res.end();
}
