import { FolderOpenOutlined, PlusOutlined } from "@ant-design/icons";
import { Endpoints } from "@octokit/types";
import { Card, Col, Divider, Row, Typography } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import github from "services/github";
import type { ChatType } from "types/data";
import ErrorManager from "utils/error-manager";
import styles from "./index.module.css";

const { Title } = Typography;

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
    <div className={styles.container}>
      <Divider orientation="left">
        <Title level={4} style={{ margin: 0 }}>
          Recent chats
        </Title>
      </Divider>
      <Row gutter={[32, 32]}>
        {chats.map((chat) => {
          const date = new Date(
            parseInt(chat._id.toString().slice(0, 8), 16) * 1000
          ).toLocaleString();
          const chatId = chat._id.toString();
          return (
            <Col key={chatId} span={6}>
              <Card
                actions={[
                  <FolderOpenOutlined
                    key="view"
                    onClick={() => {
                      router.push(
                        `/explorer/${chatId}/${chat.owner}/${chat.repo}`
                      );
                    }}
                  />
                ]}
              >
                <Card.Meta
                  title={`${chat.owner}/${chat.repo}`}
                  description={date}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
      <Divider orientation="left">
        <Title level={4} style={{ margin: 0 }}>
          Recent changes
        </Title>
      </Divider>
      <Row gutter={[32, 32]}>
        {repos.map((repo) => {
          return (
            <Col key={repo.id} span={6}>
              <Card
                actions={[
                  <PlusOutlined
                    key="view"
                    onClick={() => {
                      fetch("/api/chat", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                          owner: repo.owner.login,
                          repo: repo.name
                        })
                      })
                        .then((res) => res.json())
                        .then((res) => {
                          router.push(
                            `/explorer/${res.chat}/${repo.owner.login}/${repo.name}`
                          );
                        })
                        .catch(ErrorManager.log);
                    }}
                  />
                ]}
              >
                <Card.Meta
                  title={repo.name}
                  description={repo.description ?? "..."}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Home;
