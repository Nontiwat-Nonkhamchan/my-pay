"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/app/auth";

export type LoginState = { error?: string; email?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  try {
    await signIn("credentials", {
      email,
      password: String(formData.get("password") ?? ""),
      redirectTo: "/expenses",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", email };
    }
    throw error; // ต้อง throw ต่อ เพราะ redirect ของ Next.js ทำงานผ่านการ throw
  }
  return {};
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
