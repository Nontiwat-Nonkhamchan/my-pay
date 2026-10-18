import ExpenseForm from "../expense-form";
import { createExpense } from "../actions";

export default function CreateExpensePage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">เพิ่มรายจ่าย</h1>
      <ExpenseForm action={createExpense} />
    </main>
  );
}