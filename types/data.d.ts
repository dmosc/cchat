type MessageType = {
  from: string;
  content: string;
  chat: Types.ObjectId;
};

type ChatType = {
  owner: string;
  repo: string;
};

type CodeSyncEventType = {
  path: string;
};
