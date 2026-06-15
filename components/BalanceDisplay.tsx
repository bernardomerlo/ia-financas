import { Badge } from "@/components/ui/badge";

export function BalanceDisplay({
  entriesTotal,
  expensesTotal,
  endingBalance,
}: {
  entriesTotal: number;
  expensesTotal: number;
  endingBalance: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Badge className="bg-blue-100 text-blue-900">Entradas: R$ {entriesTotal.toFixed(2)}</Badge>
      <Badge className="bg-yellow-100 text-yellow-900">Saídas: R$ {expensesTotal.toFixed(2)}</Badge>
      <Badge className="bg-green-100 text-green-900">Saldo: R$ {endingBalance.toFixed(2)}</Badge>
    </div>
  );
}
