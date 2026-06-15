# IA Finanças

Aplicação web para acompanhamento financeiro pessoal com Next.js (App Router), Prisma + SQLite e Tailwind.

## Rodando o projeto

```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run seed
npm run dev
```

## Scripts

- `npm run dev`: servidor local
- `npm run build`: build de produção
- `npm run lint`: lint
- `npm run seed`: popula categorias iniciais
