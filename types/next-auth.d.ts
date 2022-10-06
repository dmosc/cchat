import NextAuth from "next-auth/next";
import type { DefaultProfile, DefaultSession } from "next-auth";

declare module "next-auth" {
  type UserType = DefaultSession["user"] & { profileLogin: string };
  type ProfileType = DefaultProfile & { profileLogin: string };
  interface Session {
    user: UserType;
    accessToken: string;
  }
}
