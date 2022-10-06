import { Chat } from "models";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const chats = await Chat.find({ owner: session?.user.profileLogin })
    .limit(4) // TODO: Maybe support more as long as it looks good on the frontend.
    .sort({ _id: -1 }); // Sort most recent to least recent.
  res.status(200).send({ chats });
}
