import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const MARK = "ข้อมูลจำลอง"; // ใส่ในหมายเหตุของทุกรายการ ใช้ตอนลบ
const COUNT = 100;
const DAYS_BACK = 90;

const DATA: Record<string, { titles: string[]; min: number; max: number; weight: number }> = {
  อาหาร: {
    titles: ["ข้าวมันไก่", "ก๋วยเตี๋ยวเรือ", "กาแฟ", "ชานมไข่มุก", "ข้าวผัดกะเพรา", "ส้มตำ", "ซื้อของเข้าบ้าน", "ข้าวมันไก่ทอด", "สุกี้", "ขนมปัง"],
    min: 30, max: 600, weight: 5,
  },
  เดินทาง: {
    titles: ["ค่าแท็กซี่", "ค่ารถเมล์", "เติมน้ำมัน", "ค่าทางด่วน", "รถไฟฟ้า", "ค่าจอดรถ", "วินมอเตอร์ไซค์"],
    min: 20, max: 1500, weight: 3,
  },
  ที่พัก: {
    titles: ["ค่าเช่าห้อง", "ค่าไฟ", "ค่าน้ำ", "ค่าอินเทอร์เน็ต", "ค่าส่วนกลาง"],
    min: 300, max: 6000, weight: 1,
  },
  ช้อปปิ้ง: {
    titles: ["เสื้อผ้า", "รองเท้า", "ซื้อของออนไลน์", "เครื่องเขียน", "ของใช้ในบ้าน", "หูฟัง"],
    min: 100, max: 4000, weight: 2,
  },
  อื่นๆ: {
    titles: ["ค่าโทรศัพท์", "ค่าหมอ", "ซื้อยา", "ของขวัญ", "ค่าซักผ้า", "ทำบุญ", "ค่าถ่ายเอกสาร"],
    min: 50, max: 2000, weight: 2,
  },
};

// ตัวสุ่มแบบกำหนดค่าเริ่มต้น ทำให้รันซ้ำได้ชุดข้อมูลหน้าตาเดิม
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2026);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

const pool: string[] = Object.entries(DATA).flatMap(([cat, v]) => Array(v.weight).fill(cat));

function daysAgo(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0); // เหมือนค่าที่ฟอร์มบันทึก (00:00 UTC)
  return d;
}

async function main() {
  const email = process.argv[2]?.toLowerCase();
  if (!email || email.startsWith("--")) {
    console.error("วิธีใช้: npx tsx prisma/seed.ts อีเมลของคุณ [--clear]");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`ไม่พบผู้ใช้ ${email} ให้ login หรือสมัครสมาชิกในระบบก่อน`);
    process.exit(1);
  }

  if (process.argv.includes("--clear")) {
    const r = await prisma.expense.deleteMany({ where: { userId: user.id, note: MARK } });
    console.log(`ลบข้อมูลจำลองแล้ว ${r.count} รายการ`);
    return;
  }

  const rows = Array.from({ length: COUNT }, () => {
    const category = pick(pool);
    const c = DATA[category];
    const raw = c.min + rand() * (c.max - c.min);
    const amount = category === "อาหาร" ? Math.round(raw / 5) * 5 : Math.round(raw);
    return {
      title: pick(c.titles),
      amount,
      category,
      spentAt: daysAgo(Math.floor(rand() * DAYS_BACK)),
      note: MARK,
      userId: user.id,
    };
  });

  const r = await prisma.expense.createMany({ data: rows });
  console.log(`เพิ่มข้อมูลจำลองให้ ${email} แล้ว ${r.count} รายการ`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());