import { Chat } from "models";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyPayload = {
  owner: string;
  repo: string;
  branch: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { owner, repo, branch } = req.body as BodyPayload;
  const chat = new Chat({ owner, repo, branch });
  chat.save();
  res.status(200).json({ chat: chat._id });
}
