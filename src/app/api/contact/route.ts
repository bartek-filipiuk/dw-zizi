import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        message: result.data.message,
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
