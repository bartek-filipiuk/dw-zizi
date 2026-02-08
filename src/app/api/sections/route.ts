import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sections = await prisma.section.findMany({
    orderBy: { sortOrder: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(sections);
}
