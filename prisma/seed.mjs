import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Salário", color: "#16a34a" },
    { name: "Compras", color: "#eab308" },
    { name: "Supermercado", color: "#f97316" },
    { name: "Transporte", color: "#3b82f6" },
    { name: "Outras", color: "#6b7280" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      create: category,
      update: category,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
