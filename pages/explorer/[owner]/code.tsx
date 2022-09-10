import styles from "./code.module.css";

interface Props {
  code: string[];
}

const Code: React.FC<Props> = ({ code }) => {
  return (
    <table className={styles.container}>
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
  );
};

export default Code;
