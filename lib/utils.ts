import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RecurringFrequency, RecurringPattern } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateMonthData(year: number, month: number) {
  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    throw new Error("Ano e mês devem ser inteiros");
  }

  if (year < 1970 || year > 3000) {
    throw new Error("Ano fora do intervalo permitido");
  }

  if (month < 1 || month > 12) {
    throw new Error("Mês inválido");
  }
}

function patternAppliesOnDate(pattern: RecurringPattern, date: Date) {
  if (!pattern.isActive) return false;

  const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const start = new Date(
    Date.UTC(
      pattern.startDate.getUTCFullYear(),
      pattern.startDate.getUTCMonth(),
      pattern.startDate.getUTCDate(),
    ),
  );

  if (dateOnly < start) return false;

  if (pattern.endDate) {
    const end = new Date(
      Date.UTC(pattern.endDate.getUTCFullYear(), pattern.endDate.getUTCMonth(), pattern.endDate.getUTCDate()),
    );
    if (dateOnly > end) return false;
  }

  if (pattern.frequency === RecurringFrequency.DIARIO) return true;

  if (pattern.frequency === RecurringFrequency.SEMANAL) {
    return dateOnly.getUTCDay() === (pattern.dayOfWeek ?? 1);
  }

  const monthDays = new Date(Date.UTC(dateOnly.getUTCFullYear(), dateOnly.getUTCMonth() + 1, 0)).getUTCDate();
  return dateOnly.getUTCDate() === Math.min(pattern.dayOfMonth ?? 1, monthDays);
}

type PrismaLike = {
  transaction: {
    findFirst: (args: { where: { recurringPatternId: number; date: Date } }) => Promise<{ id: number } | null>;
    create: (args: {
      data: {
        description: string;
        amount: number;
        type: "ENTRADA" | "SAIDA";
        date: Date;
        categoryId?: number | null;
        recurringPatternId: number;
      };
    }) => Promise<unknown>;
  };
};

export async function populateRecurringTransactions(
  prisma: PrismaLike,
  patterns: RecurringPattern[],
  month: number,
  year: number,
) {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  for (const pattern of patterns) {
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(Date.UTC(year, month - 1, day));
      if (!patternAppliesOnDate(pattern, date)) continue;

      const alreadyExists = await prisma.transaction.findFirst({
        where: {
          recurringPatternId: pattern.id,
          date,
        },
      });

      if (alreadyExists) continue;

      await prisma.transaction.create({
        data: {
          description: pattern.description,
          amount: pattern.amount,
          type: pattern.type,
          date,
          categoryId: pattern.categoryId,
          recurringPatternId: pattern.id,
        },
      });
    }
  }
}
