type MessageType = {
  from: string;
  content: string;
  chat: Types.ObjectId;
  path?: string;
};

type ChatType = {
  owner: string;
  repo: string;
};

type CodeSyncEventType = {
  path: string;
};
