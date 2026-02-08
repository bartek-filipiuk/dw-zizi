import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { menuItemSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = menuItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({ data: result.data });

    revalidatePath("/");
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
