import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { logout } from "@/app/login/actions";

async function Guard({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 text-sm">
          <span>
            สวัสดี, <strong>{session.user.name}</strong>
            {session.user.role === "ADMIN" && " (ADMIN)"}
          </span>
          <form action={logout}>
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50">
              ออกจากระบบ
            </button>
          </form>
        </div>
      </div>
      {children}
    </>
  );
}

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">กำลังโหลด...</p>}>
      <Guard>{children}</Guard>
    </Suspense>
  );
}