import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Chat from "./chat";
import Code from "./code";
import styles from "./path.module.css";
import Resources from "./resources";

const Explorer: NextPage = () => {
  const router = useRouter();
  const [code, setCode] = useState<string[]>([]);
  const { owner, path } = router.query;
  return (
    <div className={styles.container}>
      <Resources
        owner={owner as string}
        path={path as string[]}
        setCode={setCode}
      />
      <Code code={code} />
      <Chat owner={owner as string} path={path as string[]} />
    </div>
  );
};

export default Explorer;
