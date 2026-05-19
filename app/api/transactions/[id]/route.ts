import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await db.transaction.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

  if (!transaction) {
    return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 });
  }

  return NextResponse.json(transaction);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const updated = await db.transaction.update({
      where: { id: Number(id) },
      data: {
        description: body.description,
        amount: typeof body.amount === "number" ? body.amount : undefined,
        type: ["ENTRADA", "SAIDA"].includes(body.type) ? body.type : undefined,
        date: body.date ? new Date(body.date) : undefined,
        categoryId: body.categoryId === null ? null : body.categoryId ? Number(body.categoryId) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar transação" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await db.transaction.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao excluir transação" }, { status: 500 });
  }
}
