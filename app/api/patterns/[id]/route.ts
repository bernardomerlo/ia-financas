import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const pattern = await db.recurringPattern.update({
    where: { id: Number(id) },
    data: {
      description: body.description,
      amount: typeof body.amount === "number" ? body.amount : undefined,
      type: ["ENTRADA", "SAIDA"].includes(body.type) ? body.type : undefined,
      frequency: ["DIARIO", "SEMANAL", "MENSAL"].includes(body.frequency)
        ? body.frequency
        : undefined,
      dayOfMonth: body.dayOfMonth,
      dayOfWeek: body.dayOfWeek,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : body.endDate === null ? null : undefined,
      isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
      categoryId: body.categoryId === null ? null : body.categoryId ? Number(body.categoryId) : undefined,
    },
  });

  return NextResponse.json(pattern);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.recurringPattern.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
