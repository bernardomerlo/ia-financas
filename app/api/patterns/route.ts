import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const patterns = await db.recurringPattern.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(patterns);
}

export async function POST(request: Request) {
  const body = await request.json();

  const pattern = await db.recurringPattern.create({
    data: {
      description: body.description,
      amount: body.amount,
      type: body.type,
      frequency: body.frequency,
      dayOfMonth: body.dayOfMonth ?? null,
      dayOfWeek: body.dayOfWeek ?? null,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      isActive: body.isActive ?? true,
      categoryId: body.categoryId ? Number(body.categoryId) : null,
    },
  });

  return NextResponse.json(pattern, { status: 201 });
}
