import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { galleryItemSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { sortOrder: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = galleryItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await prisma.galleryItem.create({
      data: result.data,
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    revalidatePath("/");
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}
