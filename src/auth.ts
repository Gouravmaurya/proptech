import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    debug: process.env.NODE_ENV === "development",
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string;
                const password = credentials?.password as string;

                if (!email || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { email }
                });

                if (!user || !user.password) return null;

                try {
                    const isValid = await bcrypt.compare(password, user.password);
                    if (!isValid) return null;
                    return user;
                } catch (e) {
                    console.error("Auth error", e);
                    return null;
                }
            },
        }),
    ],
})
