import { DailyExpense, Transaction } from "@prisma/client";

export type DailyBalanceRow = {
  date: string;
  day: number;
  incomes: number;
  expenses: number;
  projected: number;
  balance: number;
};

const dayKey = (date: Date) => date.toISOString().slice(0, 10);

export function calculateDailyBalances(
  transactions: Transaction[],
  dailyExpenses: DailyExpense[],
  startBalance: number,
  month: number,
  year: number,
): DailyBalanceRow[] {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const todayKey = dayKey(new Date());
  const rows = new Map<string, DailyBalanceRow>();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(Date.UTC(year, month - 1, day));
    const key = dayKey(date);
    rows.set(key, {
      date: key,
      day,
      incomes: 0,
      expenses: 0,
      projected: 0,
      balance: 0,
    });
  }

  for (const transaction of transactions) {
    const key = dayKey(transaction.date);
    const row = rows.get(key);
    if (!row) continue;

    if (transaction.type === "ENTRADA") {
      row.incomes += transaction.amount;
    } else {
      row.expenses += transaction.amount;
    }
  }

  for (const expense of dailyExpenses) {
    const key = dayKey(expense.date);
    const row = rows.get(key);
    if (!row) continue;

    if (expense.confirmed) {
      row.expenses += expense.amount;
      continue;
    }

    if (key < todayKey) {
      continue;
    }

    row.projected += expense.amount;
  }

  let runningBalance = startBalance;
  return Array.from(rows.values()).map((row) => {
    runningBalance += row.incomes;
    runningBalance -= row.expenses;
    runningBalance -= row.projected;

    return {
      ...row,
      balance: Number(runningBalance.toFixed(2)),
    };
  });
}
