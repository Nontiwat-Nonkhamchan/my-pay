import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3];

  if (!email || !password) {
    console.error('วิธีใช้: npx tsx prisma/set-password.ts อีเมล "รหัสผ่านใหม่"');
    process.exit(1);
  }
  if (password.length < 8 || password.length > 72) {
    console.error("รหัสผ่านต้องยาว 8-72 ตัวอักษร");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`ไม่พบผู้ใช้ ${email} ในฐานข้อมูล`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { email }, data: { passwordHash } });
  console.log(`เปลี่ยนรหัสผ่านของ ${email} เรียบร้อยแล้ว`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());