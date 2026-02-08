import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sectionSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { uploadImage, deleteImage } from "@/lib/upload";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const section = await prisma.section.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  return NextResponse.json(section);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image") as File | null;
      const role = (formData.get("role") as string) || "background";
      const alt = (formData.get("alt") as string) || "";

      if (file) {
        const result = await uploadImage(file);
        await prisma.sectionImage.create({
          data: {
            sectionId: id,
            url: result.url,
            alt,
            role,
            width: result.width,
            height: result.height,
          },
        });
      }

      const section = await prisma.section.findUnique({
        where: { id },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });

      revalidatePath("/");
      return NextResponse.json(section);
    }

    const body = await request.json();
    const result = sectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const section = await prisma.section.update({
      where: { id },
      data: result.data,
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    revalidatePath("/");
    return NextResponse.json(section);
  } catch {
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const imageId = url.searchParams.get("imageId");

    if (imageId) {
      const image = await prisma.sectionImage.findUnique({ where: { id: imageId } });
      if (image) {
        await deleteImage(image.url);
        await prisma.sectionImage.delete({ where: { id: imageId } });
      }
      revalidatePath("/");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing imageId" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
