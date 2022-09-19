import { useRouter } from "next/router";
import socketClient from "services/socket-client";
import styles from "./code.module.css";

interface Props {
  code: string[];
}

const Code: React.FC<Props> = ({ code }) => {
  const router = useRouter();
  const { chat } = router.query;
  const CODE_SYNC_EVENT = `__code_sync__${chat}`;

  return (
    <div className={styles.container}>
      <div className={styles.actionsContainer}>
        <button
          className="material-icons-outlined"
          onClick={() => {
            socketClient.emit({
              event: CODE_SYNC_EVENT,
              payload: { path: router.asPath }
            });
          }}
        >
          cloud_sync
        </button>
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

export default Code;
