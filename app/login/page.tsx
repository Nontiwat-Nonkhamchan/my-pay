import { Suspense } from "react";
import LoginForm from "./login-form";

async function RegisteredNotice({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;
  if (!registered) return null;

  return (
    <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
      สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ
    </p>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">เข้าสู่ระบบ</h1>

        <Suspense fallback={null}>
          <RegisteredNotice searchParams={searchParams} />
        </Suspense>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <a href="/signup" className="font-medium text-blue-600 hover:underline">สมัครสมาชิก</a>
        </p>
      </div>
    </main>
  );
}