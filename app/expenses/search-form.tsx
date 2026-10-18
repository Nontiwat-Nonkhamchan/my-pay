import { CATEGORIES } from "./validation";

type Props = {
  q?: string;
  category?: string;
  from?: string;
  to?: string;
};

const input = "w-full rounded-md border border-gray-300 px-3 py-2";
const label = "mb-1 block font-hand text-base text-gray-700";

export default function SearchForm({ q = "", category = "", from = "", to = "" }: Props) {
  return (
    <form
      method="GET"
      className="relative mb-6 -rotate-[0.4deg] rounded border border-gray-200 bg-gray-50 p-4 pt-6 shadow-[2px_3px_6px_rgba(80,55,20,0.18)]"
    >
      <div className="tape" style={{ width: 80, height: 22 }} />

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
          className="btn-sticker rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          🔍 ค้นหา
        </button>
        <a
          href="/expenses"
          className="btn-sticker rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
        >
          ล้าง
        </a>
      </div>
    </form>
  );
}