import type { ObjectId } from "mongoose";

type MessageType = {
  from: string;
  content: string;
  chat: Types.ObjectId;
  path?: string;
};

type ChatType = {
  _id: ObjectId;
  owner: string;
  repo: string;
};

type CodeSyncEventType = {
  path: string;
};
