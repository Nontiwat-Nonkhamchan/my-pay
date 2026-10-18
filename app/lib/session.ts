import { redirect } from "next/navigation";
import { auth } from "@/app/auth";

export async function requireUser() {
  const session = await auth();
  console.log("SESSION USER:", session?.user);
  if (!session?.user) redirect("/login");
  return session.user;
}

// ADMIN เห็นทุกรายการ, คนอื่นเห็นเฉพาะของตัวเอง
export function ownerFilter(user: { id: string; role: string }) {
  return user.role === "ADMIN" ? {} : { userId: user.id };
}
