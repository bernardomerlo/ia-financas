"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Pattern = {
  id: number;
  description: string;
  amount: number;
};

export function PatternManager({ onApplied }: { onApplied: () => void }) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);

  const load = async () => {
    const response = await fetch("/api/patterns");
    const data = (await response.json()) as Pattern[];
    setPatterns(data);
  };

  useEffect(() => {
    let active = true;

    void fetch("/api/patterns")
      .then((response) => response.json() as Promise<Pattern[]>)
      .then((data) => {
        if (active) {
          setPatterns(data);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await fetch("/api/patterns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: data.get("description"),
        amount: Number(data.get("amount")),
        type: "SAIDA",
        frequency: "DIARIO",
        startDate: new Date().toISOString(),
      }),
    });

    event.currentTarget.reset();
    await load();
  };

  const applyPattern = async (id: number) => {
    await fetch(`/api/patterns/${id}/apply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    onApplied();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Gerenciar padrões</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Padrões recorrentes</DialogTitle>
        </DialogHeader>

        <form className="space-y-2" onSubmit={onCreate}>
          <Input name="description" placeholder="Descrição" required />
          <Input name="amount" type="number" min="0" step="0.01" placeholder="Valor" required />
          <Button type="submit">Adicionar</Button>
        </form>

        <ul className="space-y-2">
          {patterns.map((pattern) => (
            <li key={pattern.id} className="flex items-center justify-between rounded border p-2">
              <span>
                {pattern.description} - R$ {pattern.amount.toFixed(2)}
              </span>
              <Button size="sm" onClick={() => applyPattern(pattern.id)}>
                Aplicar
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
