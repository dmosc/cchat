import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"];
    accessToken: string;
  }
}

interface ChildrenProps {
  children: JSX.Element;
}
