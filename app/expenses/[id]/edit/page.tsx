import { notFound } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { requireUser, ownerFilter } from "@/app/lib/session";
import ExpenseForm from "../../expense-form";
import { updateExpense } from "../../actions";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const expenseId = Number(id);
  if (!Number.isInteger(expenseId)) notFound();

  // รายการของคนอื่นจะหาไม่เจอ และขึ้น 404
  const e = await prisma.expense.findFirst({
    where: { id: expenseId, ...ownerFilter(user) },
  });
  if (!e) notFound();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">แก้ไขรายจ่าย</h1>
      <ExpenseForm
        action={updateExpense.bind(null, e.id)}
        submitLabel="บันทึกการแก้ไข"
        initial={{
          title: e.title,
          amount: String(e.amount),
          category: e.category,
          spentAt: e.spentAt.toISOString().slice(0, 10),
          note: e.note ?? "",
        }}
      />
    </main>
  );
}