import { FolderOpenOutlined } from "@ant-design/icons";
import { Endpoints } from "@octokit/types";
import { Card, Col, Divider, Row, Tag, Typography } from "antd";
import CardChat from "components/card-chat";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import github from "services/github";
import type { ChatType } from "types/data";
import ErrorManager from "utils/error-manager";
import styles from "./index.module.css";

const { Title } = Typography;

const Home: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [repos, setRepos] = useState<Endpoints["GET /user/repos"]["response"]["data"]>([]);

  useEffect(() => {
    if (session.data) {
      github.query("/user/repos?sort=updated").then(({ data }) => setRepos(data)).catch(ErrorManager.log);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data]);

  useEffect(() => {
    if (session.data) {
      fetch("/api/chats")
        .then((res) => res.json())
        .then((res) => setChats(res.chats))
        .catch(ErrorManager.log);
    }
  }, [session.data]);

  if (session.status === "unauthenticated") {
    router.replace("/auth/signin");
  }

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
                        `/explorer/${chatId}/${chat.owner}/${chat.repo}/${chat.branch}`
                      );
                    }}
                  />
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{display: "flex", flexDirection: "column"}}>
                      <Typography.Text>
                        {`${chat.owner}/${chat.repo}`}
                      </Typography.Text>
                      <Typography.Text>
                        <Tag color={getComputedStyle(document.documentElement).getPropertyValue("--primary-color")}>
                          {chat.branch}
                        </Tag>
                      </Typography.Text>
                    </div>
                  }
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
              <CardChat repo={repo} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Home;
