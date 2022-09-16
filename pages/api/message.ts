import { Message } from "models";
import type { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/socket-io";

type BodyPayload = {
  event: string;
  message: MessageType;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  const { event, message: _message } = req.body as BodyPayload;
  res.socket.server.io.emit(event, _message);
  const message = new Message(_message);
  message.save();
  res.end();
}
