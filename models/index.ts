import { connect } from "mongoose";

connect(process.env.MONGO_URI!);

export { default as Chat } from "./chat";
export { default as Message } from "./message";
