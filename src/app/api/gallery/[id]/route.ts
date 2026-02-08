import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { galleryItemSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { uploadImage, deleteImage } from "@/lib/upload";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!item) {
    return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
  }

  return NextResponse.json(item);
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
      const type = (formData.get("type") as string) || "full";
      const alt = (formData.get("alt") as string) || "";

      if (file) {
        const result = await uploadImage(file);
        await prisma.galleryItemImage.create({
          data: {
            galleryItemId: id,
            url: result.url,
            alt,
            type,
            width: result.width,
            height: result.height,
          },
        });
      }

      const item = await prisma.galleryItem.findUnique({
        where: { id },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });

      revalidatePath("/");
      return NextResponse.json(item);
    }

    const body = await request.json();
    const result = galleryItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: result.data,
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    revalidatePath("/");
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
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
      const image = await prisma.galleryItemImage.findUnique({ where: { id: imageId } });
      if (image) {
        await deleteImage(image.url);
        await prisma.galleryItemImage.delete({ where: { id: imageId } });
      }
      revalidatePath("/");
      return NextResponse.json({ success: true });
    }

    // Delete entire gallery item
    const item = await prisma.galleryItem.findUnique({
      where: { id },
      include: { images: true },
    });

    if (item) {
      for (const img of item.images) {
        await deleteImage(img.url);
      }
      await prisma.galleryItem.delete({ where: { id } });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
