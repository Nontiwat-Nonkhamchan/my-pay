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
  <main className="flex min-h-screen flex-col items-center justify-center px-4">
    <div className="mb-8 text-center">
      <h1 className="font-hand text-5xl text-gray-900 md:text-6xl">
        📒 <span className="highlight">สมุดรายจ่าย</span>
      </h1>
      <p className="mt-3 font-hand text-lg text-gray-600">จดทุกบาท ไม่ให้หลุดมือ</p>
    </div>

    <div className="notebook lined w-full max-w-md p-8 pl-[4.5rem]">
      <div className="tape" />
      <h2 className="mb-6 text-center font-hand text-3xl text-gray-800">เข้าสู่ระบบ</h2>

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