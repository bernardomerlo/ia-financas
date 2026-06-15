import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateDailyBalances } from "@/lib/calculations";
import { getNextFifthBusinessDay } from "@/lib/business-days";
import { populateRecurringTransactions, validateMonthData } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ year: string; month: string }> },
) {
  const resolvedParams = await params;
  const year = Number(resolvedParams.year);
  const month = Number(resolvedParams.month);
  validateMonthData(year, month);

  const { searchParams } = new URL(request.url);
  const startBalance = Number(searchParams.get("startBalance") ?? "0");

  const patterns = await db.recurringPattern.findMany({ where: { isActive: true } });
  await populateRecurringTransactions(db, patterns, month, year);

  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 1));

  const [transactions, dailyExpenses] = await Promise.all([
    db.transaction.findMany({
      where: { date: { gte: monthStart, lt: monthEnd } },
      include: { category: true },
      orderBy: { date: "asc" },
    }),
    db.dailyExpense.findMany({ where: { date: { gte: monthStart, lt: monthEnd } }, orderBy: { date: "asc" } }),
  ]);

  const balances = calculateDailyBalances(transactions, dailyExpenses, startBalance, month, year);
  const typedTransactions = transactions as Array<{ type: "ENTRADA" | "SAIDA"; amount: number }>;

  const entriesTotal = typedTransactions
    .filter((transaction) => transaction.type === "ENTRADA")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expensesTotal = typedTransactions
    .filter((transaction) => transaction.type === "SAIDA")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return NextResponse.json({
    year,
    month,
    startBalance,
    entriesTotal,
    expensesTotal,
    endingBalance: balances.at(-1)?.balance ?? startBalance,
    nextFifthBusinessDay: getNextFifthBusinessDay(year, month).toISOString().slice(0, 10),
    balances,
    transactions,
    dailyExpenses,
  });
}
