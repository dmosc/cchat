import TextEditor from "components/text-editor";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import socketClient from "services/socket-client";
import ErrorManager from "utils/error-manager";
import styles from "./chat.module.css";

const computeMessageColor = (path?: string) => {
  if (!path) return undefined;
  let hash = path
    .split("")
    .reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);
  return `hsl(${hash % 360}, 90%, 15%)`;
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { chat, lines } = router.query;
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const CHAT_EVENT = `__chat__${chat}`;

  useEffect(() => {
    fetch(`/api/messages?chat=${chat}`)
      .then((res) => res.json())
      .then((res) => setMessages(res.messages))
      .catch((error) => {
        ErrorManager.log(error);
        router.replace("/");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketClient.on(CHAT_EVENT, (data: MessageType) => {
      setMessages((messages) => [...messages, data]);
    });
    return () => socketClient.off(CHAT_EVENT);
  }, [CHAT_EVENT]);

  useEffect(() => {
    /*
      Wait a bit until DOM finishes painting so we can try to scroll the chat container
      on first load. Not sure if this is the 'ideal' way to approach this, but it works.
    */
    setTimeout(() => {
      const container = messagesContainerRef.current!;
      container.scrollTop = container.scrollHeight;
    }, 500);
  }, []);

  return (
    <div className={styles.container}>
      <div ref={messagesContainerRef} className={styles.messagesContainer}>
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
            <div
              className={styles.message}
              style={{ backgroundColor: computeMessageColor(message.path) }}
            >
              <div className={styles.messageFrom}>{message.from}</div>
              {(() => {
                let isCodeSection = false;
                return message.content.split(/\n/).map((line) => {
                  const key = String(Math.random());
                  if (line.includes("```")) {
                    isCodeSection = !isCodeSection;
                    return (
                      <span key={key} className={styles.codeSectionLimit}>
                        &nbsp;
                      </span>
                    );
                  }
                  return (
                    <span
                      key={key}
                      className={isCodeSection ? styles.codeSection : ""}
                    >
                      {line}&nbsp;
                    </span>
                  );
                });
              })()}
              {message.path && (
                <div className={styles.messageCodeLink}>
                  <Link href={message.path}>Code reference</Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <TextEditor
          callback={(content: string) => {
            if (!!content) {
              const [min, max] =
                (lines as string)?.split("-").map(Number) ?? [];
              const message: MessageType = {
                content,
                from: session?.user.name,
                chat
              };
              /*
                If there's a single line selected, `max` is undefined;
                only checking for `min` should suffice.
              */
              if (min >= 0) {
                message.path = router.asPath;
              }
              fetch("/api/message", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
