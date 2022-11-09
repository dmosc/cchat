import { CloudSyncOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import socketClient from "services/socket-client";
import styles from "./code.module.css";

interface Props {
  code: string[];
}

const Code: React.FC<Props> = ({ code }) => {
  const router = useRouter();
  const { chat, lines } = router.query;
  const CODE_SYNC_EVENT = `__code_sync__${chat}`;
  const [selectedRange, setSelectedRange] = useState({ min: -1, max: -1 });

  useEffect(() => {
    if (selectedRange.min >= 0 && selectedRange.max >= 0) {
      let lines = String(selectedRange.min);
      if (selectedRange.min !== selectedRange.max) {
        lines = lines.concat(`-${selectedRange.max}`);
      }
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            lines
          }
        },
        undefined,
        { shallow: true } // Avoid refetching the page.
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRange]);

  useEffect(() => {
    if (!!lines) {
      const [min, max] = (lines as string).split("-").map(Number);
      setSelectedRange({ min, max: max ?? min });
    } else {
      setSelectedRange({ min: -1, max: -1 });
    }
  }, [lines]);

  return (
    <div className={styles.container}>
      <div className={styles.actionsContainer}>
        <Button
          icon={<CloudSyncOutlined />}
          onClick={() => {
            socketClient.emit({
              event: CODE_SYNC_EVENT,
              payload: { path: router.asPath }
            });
          }}
        />
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
            const maybeSelectStyle =
              i >= selectedRange.min &&
              i <= selectedRange.max &&
              styles.lineContainerSelected;
            return (
              <tr
                key={i}
                className={`${styles.lineContainer} ${maybeSelectStyle}`}
                onClick={(e) => {
                  if (i === selectedRange.min) {
                    setSelectedRange({ min: -1, max: -1 });
                  } else if (e.shiftKey && selectedRange.min >= 0) {
                    setSelectedRange({
                      min: Math.min(i, selectedRange.min),
                      max: Math.max(i, selectedRange.min)
                    });
                  } else {
                    setSelectedRange({ min: i, max: i });
                  }
                }}
              >
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
