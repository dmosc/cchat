import { Schema, model, Types } from "mongoose";

const Chat = new Schema<ChatType>({
  owner: { type: String, required: true },
  repo: { type: String, required: true }
});

export default model<ChatType>("Chat", Chat, undefined, {
  overwriteModels: true
});
