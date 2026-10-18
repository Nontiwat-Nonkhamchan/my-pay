"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/app/lib/prisma";
import { requireUser, ownerFilter } from "@/app/lib/session";
import { expenseSchema, type FormState } from "./validation";

function parse(formData: FormData) {
  const values = {
    title: String(formData.get("title") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    category: String(formData.get("category") ?? ""),
    spentAt: String(formData.get("spentAt") ?? ""),
    note: String(formData.get("note") ?? ""),
  };
  const result = expenseSchema.safeParse({
    ...values,
    amount: Number(values.amount),
    spentAt: new Date(values.spentAt),
  });
  return { values, result };
}

export async function createExpense(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const { values, result } = parse(formData);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values };
  }
  const { note, ...rest } = result.data;
  await prisma.expense.create({
    data: { ...rest, note: note || null, userId: user.id },
  });
  revalidatePath("/expenses");
  redirect("/expenses");
}

export async function updateExpense(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const { values, result } = parse(formData);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values };
  }
  const { note, ...rest } = result.data;

  // where มีเงื่อนไขเจ้าของด้วย: ถ้าไม่ใช่ของตัวเองจะอัปเดตได้ 0 แถว
  const { count } = await prisma.expense.updateMany({
    where: { id, ...ownerFilter(user) },
    data: { ...rest, note: note || null },
  });
  if (count === 0) {
    return { errors: { title: ["ไม่พบรายการนี้หรือคุณไม่มีสิทธิ์แก้ไข"] }, values };
  }

  revalidatePath("/expenses");
  redirect("/expenses");
}

export async function deleteExpense(id: number) {
  const user = await requireUser();
  await prisma.expense.deleteMany({
    where: { id, ...ownerFilter(user) },
  });
  revalidatePath("/expenses");
}