import { Endpoints } from "@octokit/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import github from "services/github";
import type { ChatType } from "types/data";
import ErrorManager from "utils/error-manager";
import styles from "./index.module.css";

const Home: NextPage = () => {
  const router = useRouter();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [repos, setRepos] = useState<
    Endpoints["GET /user/repos"]["response"]["data"]
  >([]);

  useEffect(() => {
    github.query("/user/repos?sort=updated").then(({ data }) => setRepos(data));
  }, []);

  useEffect(() => {
    fetch("/api/chats")
      .then((res) => res.json())
      .then((res) => setChats(res.chats))
      .catch(ErrorManager.log);
  }, []);

  return (
    <div className={styles.grid}>
      <h1 className={styles.gridTitle}>Recent chats</h1>
      {chats.map((chat) => {
        const date = new Date(
          parseInt(chat._id.toString().slice(0, 8), 16) * 1000
        ).toLocaleDateString();
        const chatId = chat._id.toString();
        return (
          <div
            className={styles.card}
            key={chatId}
            onClick={() => {
              router.push(`/explorer/${chatId}/${chat.owner}/${chat.repo}`);
            }}
          >
            <div
              className={styles.cardTitle}
            >{`${chat.owner}/${chat.repo}`}</div>
            <div>{date}</div>
          </div>
        );
      })}
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
