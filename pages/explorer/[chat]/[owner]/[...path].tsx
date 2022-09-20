import { NextPage } from "next";
import { useState } from "react";
import Chat from "./chat";
import Code from "./code";
import styles from "./path.module.css";
import Resources from "./resources";

const Explorer: NextPage = () => {
  const [code, setCode] = useState<string[]>([]);
  /*
    Forces a full rerender for the <Code /> component to reset its entire
    state. This is the current solution to repaint selected lines when
    switching between code snippets.
  */
  const [uniqueId] = useState(String(Math.random()));

  return (
    <div className={styles.container}>
      <Resources setCode={setCode} />
      <Code key={uniqueId} code={code} />
      <Chat />
    </div>
  );
};

export default Explorer;
