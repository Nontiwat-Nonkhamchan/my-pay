import { Suspense } from "react";
import LoginForm from "./login-form";
import { googleLogin } from "./actions";

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

        <p className="my-4 text-center text-sm text-gray-500">หรือ</p>
        <form action={googleLogin}>
          <button
            type="submit"
            className="w-full rounded border border-gray-300 bg-white p-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            เข้าสู่ระบบด้วย Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <a href="/signup" className="font-medium text-blue-600 hover:underline">สมัครสมาชิก</a>
        </p>
      </div>
    </main>
  );
}