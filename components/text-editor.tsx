import { Button } from "antd";
import { FormEvent, KeyboardEvent, useState } from "react";
import styles from "./text-editor.module.css";

const processSpecialChars = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  const element = event.currentTarget;
  if (event.key === "Tab") {
    event.preventDefault();
    element.setRangeText(
      "\t",
      element.selectionStart,
      element.selectionEnd,
      "end"
    );
  }
};

const verticalResize = (event: FormEvent<HTMLTextAreaElement>) => {
  const element = event.currentTarget;
  element.style.setProperty("height", "0px");
  element.style.setProperty(
    "height",
    `${element.style.minHeight + element.scrollHeight}px`
  );
};

const dispatchContent = (id: string, callback: (data: string) => void) => {
  const content = document.getElementById(id) as HTMLTextAreaElement;
  callback(content.value);
  content.value = "";
  content.style.setProperty("height", "0px");
};

type Props = {
  /** Callback from parent to dispatch current textarea content */
  callback: (content: string) => void;
};

const TextEditor: React.FC<Props> = ({ callback }) => {
  const [id] = useState(String(Math.random()));
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  return (
    <div className={styles.container}>
      <textarea
        id={id}
        placeholder="Type a message"
        className={styles.content}
        onKeyDown={(event) => {
          processSpecialChars(event);
          if (event.ctrlKey && event.key === "Enter" && isButtonEnabled) {
            dispatchContent(id, callback);
          }
        }}
        onInput={(event) => {
          verticalResize(event);
          const value = event.currentTarget.value;
          const isEmpty = value.match(/[^\n\t]/);
          setIsButtonEnabled(!!value && !!isEmpty);
        }}
      />
      <Button
        type="primary"
        disabled={!isButtonEnabled}
        className={styles.sendButton}
        onClick={() => {
          dispatchContent(id, callback);
        }}
      >
        Send
      </Button>
    </div>
  );
};

export default TextEditor;
