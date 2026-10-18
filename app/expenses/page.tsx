import prisma from "@/app/lib/prisma";
import DeleteButton from "./delete-button";
import SearchForm from "./search-form";
import { CATEGORIES } from "./validation";
import { requireUser, ownerFilter } from "@/app/lib/session";

const baht = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
});

const dateFmt = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
});

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    from?: string;
    to?: string;
  }>;
};

function parseDate(value?: string, endOfDay = false) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const d = new Date(value + (endOfDay ? "T23:59:59.999Z" : "T00:00:00.000Z"));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function ExpensesPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const q = (params.q ?? "").trim();
  const category = (CATEGORIES as readonly string[]).includes(params.category ?? "")
    ? params.category!
    : "";
  const from = params.from ?? "";
  const to = params.to ?? "";

  const fromDate = parseDate(from);
  const toDate = parseDate(to, true);
  const isFiltered = Boolean(q || category || fromDate || toDate);

  const expenses = await prisma.expense.findMany({
    where: {
      AND: [
        ownerFilter(user),
        q
          ? { OR: [{ title: { contains: q } }, { note: { contains: q } }] }
          : {},
        category ? { category } : {},
        fromDate || toDate
          ? { spentAt: { ...(fromDate && { gte: fromDate }), ...(toDate && { lte: toDate }) } }
          : {},
      ],
    },
    orderBy: { spentAt: "desc" },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

return (
  <main className="mx-auto max-w-5xl p-6">
    <div className="notebook py-8 pr-6 pl-[4.5rem]">
      <div className="mb-6">
        <h1 className="font-hand text-4xl text-gray-900">📒 สมุดรายจ่าย</h1>
        <p className="mt-2 text-gray-600">
          {isFiltered ? "พบ" : "ทั้งหมด"} {expenses.length} รายการ · ยอดรวม{" "}
          <strong className="highlight">{baht.format(total)}</strong>
        </p>
      </div>

      <SearchForm q={q} category={category} from={from} to={to} />

      <a
        href="/expenses/create"
        className="btn-sticker mb-4 inline-block rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white"
      >
        ✏️ เพิ่มรายการ
      </a>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-4 py-3 font-hand text-base font-normal text-gray-700">วันที่</th>
              <th className="px-4 py-3 font-hand text-base font-normal text-gray-700">รายการ</th>
              <th className="px-4 py-3 font-hand text-base font-normal text-gray-700">หมวดหมู่</th>
              <th className="px-4 py-3 text-right font-hand text-base font-normal text-gray-700">จำนวนเงิน</th>
              <th className="px-4 py-3 font-hand text-base font-normal text-gray-700">หมายเหตุ</th>
              <th className="px-4 py-3 font-hand text-base font-normal text-gray-700">จัดการ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-dashed divide-gray-300">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{dateFmt.format(e.spentAt)}</td>
                <td className="px-4 py-3 font-medium">{e.title}</td>
                <td className="px-4 py-3">
                  <span className="inline-block -rotate-2 rounded-full border border-dashed border-blue-600/40 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {e.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{baht.format(e.amount)}</td>
                <td className="px-4 py-3 text-gray-600">{e.note ?? "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <a
                      href={`/expenses/${e.id}/edit`}
                      className="btn-sticker rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white"
                    >
                      แก้ไข
                    </a>
                    <DeleteButton id={e.id} />
                  </div>
                </td>
              </tr>
            ))}

            {expenses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {isFiltered ? "ไม่พบรายการที่ตรงกับเงื่อนไข" : "ยังไม่มีรายการรายจ่าย"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </main>
);
}