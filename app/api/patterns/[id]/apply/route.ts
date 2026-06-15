import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { populateRecurringTransactions, validateMonthData } from "@/lib/utils";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const pattern = await db.recurringPattern.findUnique({ where: { id: Number(id) } });

  if (!pattern) {
    return NextResponse.json({ error: "Padrão não encontrado" }, { status: 404 });
  }

  const startMonth = Number(body.startMonth ?? 1);
  const startYear = Number(body.startYear ?? new Date().getUTCFullYear());
  const endMonth = Number(body.endMonth ?? 12);
  const endYear = Number(body.endYear ?? new Date().getUTCFullYear());

  const windows: Array<{ month: number; year: number }> = [];
  for (let year = startYear; year <= endYear; year += 1) {
    const monthFrom = year === startYear ? startMonth : 1;
    const monthTo = year === endYear ? endMonth : 12;
    for (let month = monthFrom; month <= monthTo; month += 1) {
      validateMonthData(year, month);
      windows.push({ month, year });
    }
  }

  for (const window of windows) {
    await populateRecurringTransactions(db, [pattern], window.month, window.year);
  }

  return NextResponse.json({ appliedMonths: windows.length });
}
