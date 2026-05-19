"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export function MonthNavigator({ year, month }: { year: number; month: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onNavigate = (direction: number) => {
    const nextDate = addMonths(new Date(Date.UTC(year, month - 1, 1)), direction);
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(nextDate.getUTCFullYear()));
    params.set("month", String(nextDate.getUTCMonth() + 1));
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="outline" onClick={() => onNavigate(-1)}>
        Mês anterior
      </Button>
      <h1 className="text-xl font-semibold">
        {format(new Date(Date.UTC(year, month - 1, 1)), "MMMM 'de' yyyy", { locale: ptBR })}
      </h1>
      <Button variant="outline" onClick={() => onNavigate(1)}>
        Próximo mês
      </Button>
    </div>
  );
}
