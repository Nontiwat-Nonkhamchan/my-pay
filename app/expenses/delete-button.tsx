"use client";

import { deleteExpense } from "./actions";

export default function DeleteButton({ id }: { id: number }) {
  async function handleDelete() {
    if (!window.confirm("ต้องการลบรายการนี้ใช่หรือไม่?")) return;
    await deleteExpense(id);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
    >
      ลบ
    </button>
  );
}