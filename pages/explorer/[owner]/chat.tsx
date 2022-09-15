import TextEditor from "components/text-editor";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import socketClient from "services/socket-client";
import styles from "./chat.module.css";

interface Props {
  owner: string;
  path: string[];
}

const Chat: React.FC<Props> = ({ owner, path }) => {
  const chatId = `${owner}${path!.join("")}`;
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    socketClient.on(chatId, (data) => {
      setMessages([...messages, data]);
    });
  });
  return (
    <div className={styles.container}>
      <div className={styles.messagesContainer}>
        {!messages.length && "Send a message to start a conversation..."}
        {messages.map((message, i) => (
          <div
            key={i}
            className={styles.messageContainer}
            style={{
              justifyContent:
                message.from === session?.user.name ? "right" : "left"
            }}
          >
            <div className={styles.message}>
              <div className={styles.messageFrom}>{message.from}</div>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <TextEditor
          callback={(content: string) => {
            if (!!content) {
              socketClient.emit({
                event: chatId,
                message: { content, from: session?.user.name }
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
