import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Loader from "./components/loader";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  switch (status) {
    case "loading": {
      return <Loader />;
    }
    case "unauthenticated": {
      window.location.href = "/api/auth/signin";
    }
    default: {
      const { user } = session!;
      return <div>hello {user?.name}</div>;
    }
  }
};

export default Home;
