import Image from "next/image";
import styles from "./loader.module.css";

const Loader: React.FC = () => {
  return (
    <div className={styles.container}>
      <Image
        src="/loader.gif"
        alt="loading..."
        width="100px"
        height="100px"
        layout="fixed"
        priority
      />
    </div>
  );
};

export default Loader;
