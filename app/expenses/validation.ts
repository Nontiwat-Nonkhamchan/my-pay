import { z } from "zod";

export const CATEGORIES = ["อาหาร", "เดินทาง", "ที่พัก", "ช้อปปิ้ง", "อื่นๆ"] as const;

export const expenseSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่อรายการ").max(100, "ชื่อรายการต้องไม่เกิน 100 ตัวอักษร"),
  amount: z.number().positive("จำนวนเงินต้องมากกว่า 0").max(10_000_000, "จำนวนเงินมากเกินไป"),
  category: z.enum(CATEGORIES),
  spentAt: z.date().refine(
  (d) => d.toISOString().slice(0, 10) <= new Date().toLocaleDateString("sv-SE"),
  "วันที่ต้องไม่เป็นอนาคต",
),
  note: z.string().trim().max(300, "หมายเหตุต้องไม่เกิน 300 ตัวอักษร"),
});

export type FormState = {
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};