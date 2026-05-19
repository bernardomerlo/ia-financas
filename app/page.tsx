import { MonthlyDashboard } from "@/components/MonthlyDashboard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month ?? now.getUTCMonth() + 1);
  const year = Number(params.year ?? now.getUTCFullYear());

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6">
      <MonthlyDashboard year={year} month={month} />
    </main>
  );
}
