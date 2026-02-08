import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected array of settings" }, { status: 400 });
    }

    for (const setting of body) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value, label: setting.label },
        create: { key: setting.key, value: setting.value, label: setting.label },
      });
    }

    const settings = await prisma.siteSetting.findMany();
    revalidatePath("/");
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
