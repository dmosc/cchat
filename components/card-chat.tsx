import { PlusOutlined } from "@ant-design/icons";
import { Endpoints } from "@octokit/types";
import { Card, Select } from "antd";
import router from "next/router";
import { useEffect, useState } from "react";
import github from "services/github";
import ErrorManager from "utils/error-manager";

type PropTypes = {
  repo: Endpoints["GET /user/repos"]["response"]["data"][0];
}

const COMMON_DEFAULT_BRANCHES = new Set(["main", "master"]);

const CardChat: React.FC<PropTypes> = ({ repo }) => {
  const [branches, setBrances] = useState<{label: string, value: string}[]>([]);
  const [defaultBranch, setDefaultBranch] = useState<string>();

  useEffect(() => {
    github
      .query(`/repos/${repo.owner.login}/${repo.name}/branches?per_page=5`)
      .then(({ data }) => {
        setBrances((data as Endpoints["GET /repos/{owner}/{repo}/branches"]["response"]["data"]).map(({ name }) => ({ label: name, value: name })))
      });
  }, [repo.name, repo.owner.login]);

  useEffect(() => {
    let defaultBranchToSet = branches[0];
    for (const branch of branches) {
      if (COMMON_DEFAULT_BRANCHES.has(branch.value)) {
        defaultBranchToSet = branch;
        break;
      }
    }
    setDefaultBranch(defaultBranchToSet?.value);
  }, [branches]);

  return (
    <Card
      extra={
        <Select
          value={defaultBranch}
          onSelect={(branch: string) => setDefaultBranch(branch)}
          style={{width: 150}}
          options={branches}
        />
      }
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
                repo: repo.name,
                branch: defaultBranch
              })
            })
              .then((res) => res.json())
              .then((res) => {
                router.push(
                  `/explorer/${res.chat}/${repo.owner.login}/${repo.name}/${defaultBranch}`
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
  );
};

export default CardChat;