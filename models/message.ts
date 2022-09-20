import { model, Schema } from "mongoose";

const Message = new Schema<MessageType>({
  chat: { type: Schema.Types.ObjectId, required: true, ref: "Chat" },
  from: { type: String, required: true },
  content: { type: String, required: true },
  path: { type: String }
});

export default model<MessageType>("Message", Message, undefined, {
  overwriteModels: true
});
