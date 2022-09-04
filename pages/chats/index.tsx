import { NextPage } from "next";
import { useEffect, useState } from "react";
import github from "../../services/github";
import { Endpoints } from "@octokit/types";
import styles from "./chats.module.css";

const Chats: NextPage = () => {
  const [repos, setRepos] = useState<
    Endpoints["GET /user/repos"]["response"]["data"]
  >([]);
  useEffect(() => {
    github.query("/user/repos?sort=updated").then(({ data }) => setRepos(data));
  }, []);
  return (
    <div className={styles.grid}>
      <h1 className={styles.gridTitle}>Recent changes</h1>
      {repos.map((repo) => (
        <div key={repo.id} className={styles.card}>
          <div className={styles.cardTitle}>{repo.name}</div>
          <div>{repo.description ?? "..."}</div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
