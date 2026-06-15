import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));
  const type = searchParams.get("type");
  const categoryId = searchParams.get("categoryId");

  const where: {
    date?: { gte: Date; lt: Date };
    type?: "ENTRADA" | "SAIDA";
    categoryId?: number;
  } = {};

  if (month && year) {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    where.date = { gte: start, lt: end };
  }

  if (type === "ENTRADA" || type === "SAIDA") {
    where.type = type;
  }

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  const transactions = await db.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, amount, type, date, categoryId, recurringPatternId } = body;

    if (!description || typeof amount !== "number" || !["ENTRADA", "SAIDA"].includes(type) || !date) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const transaction = await db.transaction.create({
      data: {
        description,
        amount,
        type,
        date: new Date(date),
        categoryId: categoryId ? Number(categoryId) : null,
        recurringPatternId: recurringPatternId ? Number(recurringPatternId) : null,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar transação" }, { status: 500 });
  }
}
