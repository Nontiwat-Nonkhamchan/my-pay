import { CATEGORIES } from "./validation";

type Props = {
  q?: string;
  category?: string;
  from?: string;
  to?: string;
};

const input = "w-full rounded-md border border-gray-300 px-3 py-2";
const label = "mb-1 block text-sm font-medium text-gray-700";

export default function SearchForm({ q = "", category = "", from = "", to = "" }: Props) {
  return (
    <form
      method="GET"
      className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label htmlFor="q" className={label}>ค้นหา</label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="ค้นหาชื่อรายการหรือหมายเหตุ..."
            className={input}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="category" className={label}>หมวดหมู่</label>
          <select id="category" name="category" defaultValue={category} className={input}>
            <option value="">ทุกหมวดหมู่</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="from" className={label}>ตั้งแต่วันที่</label>
          <input id="from" name="from" type="date" defaultValue={from} className={input} />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="to" className={label}>ถึงวันที่</label>
          <input id="to" name="to" type="date" defaultValue={to} className={input} />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          ค้นหา
        </button>
        <a
          href="/expenses"
          className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          ล้าง
        </a>
      </div>
    </form>
  );
}