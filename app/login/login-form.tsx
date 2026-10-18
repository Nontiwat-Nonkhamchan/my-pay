"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const input = "w-full rounded border border-gray-300 p-2";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {} as LoginState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
        <input id="email" name="email" type="email" defaultValue={state.email} required className={input} disabled={pending} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">รหัสผ่าน</label>
        <input id="password" name="password" type="password" required className={input} disabled={pending} />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-blue-600 p-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}