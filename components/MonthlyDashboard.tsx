"use client";

import { useEffect, useState } from "react";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { MonthNavigator } from "@/components/MonthNavigator";
import { PatternManager } from "@/components/PatternManager";
import { TransactionModal } from "@/components/TransactionModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type MonthlyData = {
  entriesTotal: number;
  expensesTotal: number;
  endingBalance: number;
  balances: Array<{
    date: string;
    incomes: number;
    expenses: number;
    projected: number;
    balance: number;
  }>;
};

export function MonthlyDashboard({ year, month }: { year: number; month: number }) {
  const [data, setData] = useState<MonthlyData | null>(null);

  const load = async () => {
    const response = await fetch(`/api/monthly/${year}/${month}`);
    const monthlyData = (await response.json()) as MonthlyData;
    setData(monthlyData);
  };

  useEffect(() => {
    let active = true;

    void fetch(`/api/monthly/${year}/${month}`)
      .then((response) => response.json() as Promise<MonthlyData>)
      .then((monthlyData) => {
        if (active) {
          setData(monthlyData);
        }
      });

    return () => {
      active = false;
    };
  }, [year, month]);

  if (!data) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="space-y-4">
      <MonthNavigator year={year} month={month} />
      <div className="flex gap-2">
        <TransactionModal onCreated={load} />
        <PatternManager onApplied={load} />
      </div>
      <BalanceDisplay
        entriesTotal={data.entriesTotal}
        expensesTotal={data.expensesTotal}
        endingBalance={data.endingBalance}
      />

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Entradas</TableHead>
              <TableHead>Saídas</TableHead>
              <TableHead>Diário</TableHead>
              <TableHead>Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.balances.map((row) => {
              const rowClassName = row.projected > 0 ? "bg-yellow-50" : row.incomes > 0 ? "bg-blue-50" : "bg-green-50";

              return (
                <TableRow key={row.date} className={rowClassName}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>R$ {row.incomes.toFixed(2)}</TableCell>
                  <TableCell>R$ {row.expenses.toFixed(2)}</TableCell>
                  <TableCell>R$ {row.projected.toFixed(2)}</TableCell>
                  <TableCell>R$ {row.balance.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
