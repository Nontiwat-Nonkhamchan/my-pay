import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        // บัญชีที่สมัครด้วย Google ไม่มีรหัสผ่าน จึง login แบบนี้ไม่ได้
        if (!user || !user.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
    // อ่าน AUTH_GOOGLE_ID และ AUTH_GOOGLE_SECRET จาก .env อัตโนมัติ
    Google,
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        // รับเฉพาะอีเมลที่ Google ยืนยันแล้ว
        if (!profile?.email || !profile.email_verified) return false;
        const email = profile.email.toLowerCase();
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name: profile.name ?? email, role: "USER" },
        });
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          // ใช้ id และ role จากฐานข้อมูลของเรา ไม่ใช้ id ของ Google
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email!.toLowerCase() },
          });
          token.id = dbUser!.id;
          token.role = dbUser!.role;
        } else {
          token.id = user.id;
          token.role = user.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    },
  },
});