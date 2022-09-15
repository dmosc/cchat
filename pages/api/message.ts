import type { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/socket-io";

type BodyPayload = {
  event: string;
  message: Message;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  const { event, message } = req.body as BodyPayload;
  res.socket.server.io.emit(event, message);
  res.end();
}
