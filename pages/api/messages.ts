import { Message } from "models";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chat } = req.query;
  const messages = await Message.find({ chat });
  res.status(200).json({ messages });
}
