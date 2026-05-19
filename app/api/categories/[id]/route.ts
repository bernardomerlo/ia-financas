import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updated = await db.category.update({
    where: { id: Number(id) },
    data: {
      name: body.name,
      color: body.color,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [transactionsCount, patternsCount] = await Promise.all([
    db.transaction.count({ where: { categoryId: Number(id) } }),
    db.recurringPattern.count({ where: { categoryId: Number(id) } }),
  ]);

  if (transactionsCount > 0 || patternsCount > 0) {
    return NextResponse.json(
      { error: "Categoria em uso e não pode ser removida" },
      { status: 400 },
    );
  }

  await db.category.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
