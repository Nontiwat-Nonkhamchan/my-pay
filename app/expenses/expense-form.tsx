"use client";

import { useActionState } from "react";
import { CATEGORIES, type FormState } from "./validation";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Record<string, string>;
  submitLabel?: string;
};

const input = "w-full rounded-md border border-gray-300 px-3 py-2";
const label = "mb-2 block text-sm font-medium text-gray-700";

function Err({ msgs }: { msgs?: string[] }) {
  return msgs?.[0] ? <p className="mt-1 text-sm text-red-600">{msgs[0]}</p> : null;
}

export default function ExpenseForm({ action, initial = {}, submitLabel = "บันทึก" }: Props) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const v = state.values ?? initial;
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="title" className={label}>ชื่อรายการ</label>
        <input id="title" name="title" defaultValue={v.title} className={input} disabled={pending} />
        <Err msgs={e.title} />
      </div>
      <div>
        <label htmlFor="amount" className={label}>จำนวนเงิน (บาท)</label>
        <input id="amount" name="amount" type="number" step="0.01" defaultValue={v.amount} className={input} disabled={pending} />
        <Err msgs={e.amount} />
      </div>
      <div>
        <label htmlFor="category" className={label}>หมวดหมู่</label>
        <select id="category" name="category" defaultValue={v.category ?? CATEGORIES[0]} className={input} disabled={pending}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Err msgs={e.category} />
      </div>
      <div>
        <label htmlFor="spentAt" className={label}>วันที่จ่าย</label>
        <input id="spentAt" name="spentAt" type="date" defaultValue={v.spentAt} className={input} disabled={pending} />
        <Err msgs={e.spentAt} />
      </div>
      <div>
        <label htmlFor="note" className={label}>หมายเหตุ (ไม่บังคับ)</label>
        <textarea id="note" name="note" rows={3} defaultValue={v.note} className={input} disabled={pending} />
        <Err msgs={e.note} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400">
          {pending ? "กำลังบันทึก..." : submitLabel}
        </button>
        <a href="/expenses" className="rounded-md border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50">
          ยกเลิก
        </a>
      </div>
    </form>
  );
}