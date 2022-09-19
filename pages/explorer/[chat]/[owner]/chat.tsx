import TextEditor from "components/text-editor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import socketClient from "services/socket-client";
import ErrorManager from "utils/error-manager";
import styles from "./chat.module.css";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const chat = router.query["chat"] as string;
  const CHAT_EVENT = `__chat__${chat}`;

  useEffect(() => {
    fetch(`/api/messages?chat=${chat}`)
      .then((res) => res.json())
      .then((res) => setMessages(res.messages))
      .catch((error) => {
        ErrorManager.log(error);
        router.replace("/");
      });
  }, [chat, router]);

  useEffect(() => {
    socketClient.on(CHAT_EVENT, (data: MessageType) => {
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
                event: CHAT_EVENT,
                message: { content, from: session?.user.name, chat }
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
