import { NextPage } from "next";
import { useState } from "react";
import Chat from "./chat";
import Code from "./code";
import styles from "./path.module.css";
import Resources from "./resources";

const Explorer: NextPage = () => {
  const [code, setCode] = useState<string[]>([]);
  return (
    <div className={styles.container}>
      <Resources setCode={setCode} />
      <Code code={code} />
      <Chat />
    </div>
  );
};

export default Explorer;
