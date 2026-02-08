import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await getAuthFromCookies();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
