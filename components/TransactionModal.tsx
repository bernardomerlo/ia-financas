"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

export function TransactionModal({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("SAIDA");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: data.get("description"),
        amount: Number(data.get("amount")),
        date: data.get("date"),
        type,
      }),
    });

    setOpen(false);
    onCreated();
    event.currentTarget.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova transação</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar transação</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input name="description" placeholder="Descrição" required />
          <Input name="amount" type="number" min="0" step="0.01" placeholder="Valor" required />
          <Input name="date" type="date" required />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger />
            <SelectContent>
              <SelectItem value="ENTRADA">Entrada</SelectItem>
              <SelectItem value="SAIDA">Saída</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
