import TextEditor from "components/text-editor";
import { useState } from "react";
import styles from "./chat.module.css";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [content, setContent] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.messagesContainer}>
        {!messages.length && "Send a message to start a conversation..."}
      </div>
      <div className={styles.inputContainer}>
        <TextEditor callback={setContent} />
      </div>
    </div>
  );
};

export default Chat;
