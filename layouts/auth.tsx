import { Card } from "antd";
import styles from "./auth.module.css";

const AuthLayout: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Card style={{ width: '30%', borderRadius: 10 }}>
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;