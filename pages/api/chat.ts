import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ chat: randomUUID() });
}
