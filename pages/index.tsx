import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Chats from "./chats";
import Loader from "./components/loader";

const Root: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "loading") return <Loader />;
  if (status === "unauthenticated") router.push("/api/auth/signin");
  return <Chats />;
};

export default Root;
