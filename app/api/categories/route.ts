import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  const category = await db.category.create({
    data: {
      name: body.name,
      color: body.color ?? null,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
