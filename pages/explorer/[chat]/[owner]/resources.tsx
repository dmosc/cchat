import { Endpoints } from "@octokit/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import github from "services/github";
import socketClient from "services/socket-client";
import type { CodeSyncEventType } from "types/data";
import ErrorManager from "utils/error-manager";
import styles from "./resources.module.css";

type Props = {
  setCode: React.Dispatch<React.SetStateAction<string[]>>;
};

const Resources: React.FC<Props> = ({ setCode }) => {
  const [resources, setResources] = useState<
    Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"]
  >([]);
  const router = useRouter();
  const { chat, owner, path } = router.query;
  const [repo, ...currentPath] = path as string[];
  const CODE_SYNC_EVENT = `__code_sync__${chat}`;

  useEffect(() => {
    socketClient.on(CODE_SYNC_EVENT, (data: CodeSyncEventType) => {
      router.replace(data.path);
    });
    return () => socketClient.off(CODE_SYNC_EVENT);
  }, [CODE_SYNC_EVENT, router]);

  useEffect(() => {
    github
      .query(`/repos/${owner}/${repo}/contents/${currentPath.join("/")}`)
      .then(({ data }) => {
        const isFile = !Array.isArray(data);
        if (isFile) {
          github
            .query(`/repos/${owner}/${repo}/git/blobs/${data.sha}`)
            .then(({ data }) => {
              setCode(atob(data.content).split("\n"));
            })
            .catch(ErrorManager.log);
        }
        setResources(isFile ? [data] : data);
      })
      .catch(ErrorManager.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <h2 className={styles.containerTitle}>File explorer</h2>
        <button
          disabled={!currentPath.length}
          className="material-icons-outlined"
          onClick={() => {
            /*
              `currentPath` contains everything from [...path].tsx query param after
              the `repo` definition from index 0. It being empty means that there's
              no path component left to pop from the current path.
            */
            const newPath = router.asPath.split("/");
            newPath.pop();
            router.push(newPath.join("/"));
          }}
        >
          arrow_back
        </button>
      </div>
      {Array.isArray(resources) &&
        resources.map((resource) => {
          /*
            TypeScript compiler does static union resolution using surrounding boolean logic.
            Github's response type for this endpoint can be a resource object or an array of these
            resource objects. We need the TypeScript compiler to discard the array interface option
            with an !Array.isArray(resources).
          */
          const isFileOpen =
            resource.name === currentPath[currentPath.length - 1];
          return (
            <div
              key={resource.sha}
              className={`${styles.resource} ${isFileOpen ? "no-action" : ""}`}
              onClick={() => {
                router.push(`${router.asPath}/${resource.name}`);
              }}
            >
              {resource.name}
            </div>
          );
        })}
    </div>
  );
};

export default Resources;
