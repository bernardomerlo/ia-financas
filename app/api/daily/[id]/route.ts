import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updated = await db.dailyExpense.update({
    where: { id: Number(id) },
    data: {
      amount: typeof body.amount === "number" ? body.amount : undefined,
      confirmed: body.action === "confirm" ? true : body.confirmed,
      notes: body.notes,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.dailyExpense.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
