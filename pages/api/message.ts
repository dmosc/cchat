import { Message } from "models";
import type { NextApiRequest } from "next";
import type { MessageType } from "types/data";
import { NextApiResponseServerIO } from "types/socket-io";

type BodyPayload = {
  event: string;
  message: MessageType;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  const { message: _message } = req.body as BodyPayload;
  const CHAT_EVENT = `__chat__${_message.chat}`;
  res.socket.server.io.emit(CHAT_EVENT, _message);
  const message = new Message(_message);
  message.save();
  res.end();
}
