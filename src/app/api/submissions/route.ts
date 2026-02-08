import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(submissions);
}
