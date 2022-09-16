import { Endpoints } from "@octokit/types";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import github from "services/github";
import ErrorManager from "utils/error-manager";
import styles from "./index.module.css";

const Home: NextPage = () => {
  const [repos, setRepos] = useState<
    Endpoints["GET /user/repos"]["response"]["data"]
  >([]);
  const [chat, setChat] = useState<string>();
  useEffect(() => {
    github.query("/user/repos?sort=updated").then(({ data }) => setRepos(data));
    fetch("/api/chat")
      .then((res) => res.json())
      .then((res) => setChat(res.chat))
      .catch(ErrorManager.log);
  }, []);
  return (
    <div className={styles.grid}>
      <h1 className={styles.gridTitle}>Recent changes</h1>
      {repos.map((repo) => (
        <Link
          key={repo.id}
          href={`/explorer/${chat}/${repo.owner.login}/${repo.name}`}
        >
          <div className={styles.card}>
            <div className={styles.cardTitle}>{repo.name}</div>
            <div>{repo.description ?? "..."}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Home;
