import { Endpoints } from "@octokit/types";
import github from "@services/github";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./path.module.css";

const Explorer: NextPage = () => {
  const router = useRouter();
  const { owner, path } = router.query;
  const [resources, setResources] = useState<
    Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"][]
  >([]);
  const [code, setCode] = useState<string[]>([]);
  useEffect(() => {
    const [repo, ...rest] = path as string[];
    github
      .query(`/repos/${owner}/${repo}/contents/${rest.join("/")}`)
      .then(({ data }) => setResources(data));
  }, [owner, path]);
  return (
    <div className={styles.container}>
      <div className={styles.resourcesContainer}>
        <div className={styles.resourcesContainerHeader}>
          <h2 className={styles.resourcesContainerTitle}>File explorer</h2>
          <span
            className="material-icons-outlined"
            onClick={() => {
              router.back();
            }}
          >
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
                      .query(
                        `/repos/${owner}/${repo}/git/blobs/${resource.sha}`
                      )
                      .then(({ data }) => {
                        // TODO: Load code into a table.
                        setCode(atob(data.content).split("\n"));
                      });
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
      <table className={styles.codeContainer}>
        <tbody
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
        >
          {code.map((line, i) => {
            return (
              <tr key={i} className={styles.lineContainer}>
                <td className={styles.lineNumber}>{i}</td>
                <td className={styles.lineContent}>
                  <span>{line ?? "&nbsp;"}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Explorer;
