import LayoutWrapper from "layouts/wrapper";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "./globals.css";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </SessionProvider>
  );
};

export default App;
