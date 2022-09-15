import { Endpoints } from "@octokit/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import github from "services/github";
import ErrorManager from "utils/error-manager";
import styles from "./resources.module.css";

interface Props {
  owner: string;
  path: string[];
  setCode: React.Dispatch<React.SetStateAction<string[]>>;
}

const Resources: React.FC<Props> = ({ owner, path, setCode }) => {
  const router = useRouter();
  const [resources, setResources] = useState<
    Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"][]
  >([]);
  useEffect(() => {
    const [repo, ...rest] = path as string[];
    github
      .query(`/repos/${owner}/${repo}/contents/${rest.join("/")}`)
      .then(({ data }) => {
        setResources(data);
      })
      .catch(ErrorManager.log);
  }, [owner, path]);
  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <h2 className={styles.containerTitle}>File explorer</h2>
        <span className="material-icons-outlined" onClick={() => router.back()}>
          arrow_back
        </span>
      </div>
      {resources.map((resource) => {
        /*
          TypeScript compiler does static Union resolution using surrounding boolean logic.
          Github's response type for this endpoint can be a resource object or an array of these
          resource objects. We need the TypeScript compiler to discard the array interface option
          with an !Array.isArray(resource).
        */
        if (!Array.isArray(resource)) {
          return (
            <div
              key={resource.sha}
              className={styles.resource}
              onClick={() => {
                if (resource.type === "file") {
                  const [repo] = path as string[];
                  github
                    .query(`/repos/${owner}/${repo}/git/blobs/${resource.sha}`)
                    .then(({ data }) => {
                      setCode(atob(data.content).split("\n"));
                    })
                    .catch(ErrorManager.log);
                } else {
                  router.push(`${router.asPath}/${resource.name}`);
                }
              }}
            >
              {resource.name}
            </div>
          );
        }
      })}
    </div>
  );
};

export default Resources;
