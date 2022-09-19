import type { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/socket-io";

type BodyPayload = {
  event: string;
  payload: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  const { event, payload } = req.body as BodyPayload;
  res.socket.server.io.emit(event, payload);
  res.end();
}
