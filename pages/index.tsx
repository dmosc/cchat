import { Endpoints } from "@octokit/types";
import github from "services/github";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

const Home: NextPage = () => {
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
        <Link key={repo.id} href={`/explorer/${repo.owner.login}/${repo.name}`}>
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
