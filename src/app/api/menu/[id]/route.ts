import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { menuItemSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = menuItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: result.data,
    });

    revalidatePath("/");
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.menuItem.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}
