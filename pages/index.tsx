import { Endpoints } from "@octokit/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import github from "services/github";
import ErrorManager from "utils/error-manager";
import styles from "./index.module.css";

const Home: NextPage = () => {
  const router = useRouter();
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
        <div
          key={repo.id}
          className={styles.card}
          onClick={() => {
            fetch("/api/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ owner: repo.owner.login, repo: repo.name })
            })
              .then((res) => res.json())
              .then((res) => {
                router.push(
                  `/explorer/${res.chat}/${repo.owner.login}/${repo.name}`
                );
              })
              .catch(ErrorManager.log);
          }}
        >
          <div className={styles.cardTitle}>{repo.name}</div>
          <div>{repo.description ?? "..."}</div>
        </div>
      ))}
    </div>
  );
};

export default Home;
