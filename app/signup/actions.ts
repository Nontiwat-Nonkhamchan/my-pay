"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";

export type SignUpState = {
  errors?: Record<string, string[] | undefined>;
  values?: { name: string; email: string };
};

const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "กรุณากรอกชื่อ").max(100, "ชื่อต้องไม่เกิน 100 ตัวอักษร"),
    email: z.string().trim().toLowerCase().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z
      .string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .max(72, "รหัสผ่านต้องไม่เกิน 72 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export async function signUp(_prev: SignUpState, formData: FormData): Promise<SignUpState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const result = signUpSchema.safeParse({
    ...values,
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values };
  }

  const { name, email, password } = result.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { errors: { email: ["อีเมลนี้ถูกใช้งานแล้ว"] }, values };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // ผู้สมัครใหม่เป็น USER เสมอ (ไม่รับ role จากฟอร์ม)
  await prisma.user.create({ data: { name, email, passwordHash, role: "USER" } });

  redirect("/login?registered=1");
}