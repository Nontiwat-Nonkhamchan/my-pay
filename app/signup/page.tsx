"use client";

import { useActionState } from "react";
import { signUp, type SignUpState } from "./actions";

const input = "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none";
const label = "mb-1 block text-sm font-medium text-gray-700";

function Err({ msgs }: { msgs?: string[] }) {
  return msgs?.[0] ? <p className="mt-1 text-sm text-red-600">{msgs[0]}</p> : null;
}

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUp, {} as SignUpState);
  const e = state.errors ?? {};
  const v = state.values;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">สมัครสมาชิก</h1>

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="name" className={label}>ชื่อ</label>
            <input id="name" name="name" defaultValue={v?.name} className={input} disabled={pending} />
            <Err msgs={e.name} />
          </div>
          <div>
            <label htmlFor="email" className={label}>อีเมล</label>
            <input id="email" name="email" defaultValue={v?.email} className={input} disabled={pending} />
            <Err msgs={e.email} />
          </div>
          <div>
            <label htmlFor="password" className={label}>รหัสผ่าน</label>
            <input id="password" name="password" type="password" className={input} disabled={pending} />
            <Err msgs={e.password} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={label}>ยืนยันรหัสผ่าน</label>
            <input id="confirmPassword" name="confirmPassword" type="password" className={input} disabled={pending} />
            <Err msgs={e.confirmPassword} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          มีบัญชีแล้ว?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:underline">เข้าสู่ระบบ</a>
        </p>
      </div>
    </main>
  );
}