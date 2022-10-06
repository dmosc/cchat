import { Schema, model } from "mongoose";
import type { ChatType } from "types/data";

const Chat = new Schema<ChatType>({
  owner: { type: String, required: true },
  repo: { type: String, required: true }
});

export default model<ChatType>("Chat", Chat, undefined, {
  overwriteModels: true
});
