import { GithubOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { NextPage } from "next";
import { CtxOrReq } from "next-auth/client/_utils";
import type { ClientSafeProvider } from "next-auth/react";
import { getCsrfToken, getProviders, getSession, signIn } from "next-auth/react";
import Typewriter from 'typewriter-effect';
import styles from "./signin.module.css";

const SignIn: NextPage<{providers: ClientSafeProvider[]}> = ({ providers }) => {
  return (
    <div>
      <Typewriter
        options={{
          strings: [
            'Exchange <strong>ideas</strong>.',
            '<strong>Chat</strong> about <strong>code</strong>.',
            '<strong>Cchat.</strong>'
          ],
          autoStart: true,
          loop: true,
          wrapperClassName: styles.typewriter,
          cursorClassName: styles.cursor,
        }}
      />
      <div className={styles.providersContainer}>
        {Object.values(providers).map((provider) => {
          return (
            <div key={provider.name}>
              <Button onClick={() => signIn(provider.id)} icon={<GithubOutlined />} block size="large">
                Sign in with {provider.name}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: CtxOrReq) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default SignIn;