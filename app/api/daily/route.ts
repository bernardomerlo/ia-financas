import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  const where =
    month && year
      ? {
          date: {
            gte: new Date(Date.UTC(year, month - 1, 1)),
            lt: new Date(Date.UTC(year, month, 1)),
          },
        }
      : {};

  const dailyExpenses = await db.dailyExpense.findMany({ where, orderBy: { date: "asc" } });
  return NextResponse.json(dailyExpenses);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.date) {
    return NextResponse.json({ error: "Data é obrigatória" }, { status: 400 });
  }

  const expense = await db.dailyExpense.upsert({
    where: { date: new Date(body.date) },
    create: {
      date: new Date(body.date),
      amount: typeof body.amount === "number" ? body.amount : 50,
      confirmed: Boolean(body.confirmed),
      notes: body.notes ?? null,
    },
    update: {
      amount: typeof body.amount === "number" ? body.amount : undefined,
      confirmed: body.confirmed === undefined ? undefined : Boolean(body.confirmed),
      notes: body.notes === undefined ? undefined : body.notes,
    },
  });

  return NextResponse.json(expense, { status: 201 });
}
