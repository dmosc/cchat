import Loader from "components/loader";
import { useSession } from "next-auth/react";
import AuthLayout from "./auth";
import HomeLayout from "./home";

const LayoutWrapper: React.FC<ChildrenProps> = ({ children }) => {
  const session = useSession();
  let WrapperLayout;

  if (session.status === "loading") {
    return <Loader />
  } else if (session.status === "authenticated") {
    WrapperLayout = HomeLayout;
  } else {
    WrapperLayout = AuthLayout;
  }

  return (
    <WrapperLayout>
      {children}
    </WrapperLayout>
  );
};

export default LayoutWrapper;