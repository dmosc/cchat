import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import Navbar from "@components/navbar";
import Loader from "@components/loader";
import { useRouter } from "next/router";
import React from "react";
import { ChildrenProps } from "types/next-auth";

const AuthWrapper: React.FC<ChildrenProps> = ({ children }) => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    }
  });
  if (status === "loading") return <Loader />;
  return children;
};

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <AuthWrapper>
        <>
          <Navbar />
          <Component {...pageProps} />
        </>
      </AuthWrapper>
    </SessionProvider>
  );
};

export default App;