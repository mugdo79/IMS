"use client";

import { CaseTable } from "@/components/cases/CaseTable";
import { useCases } from "@/hooks/useCases";

export default function CasesPage() {
  const { data, isLoading, isError } = useCases();

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-4 text-xl font-semibold">Cases</h1>
      {isLoading && <p className="text-sm text-zinc-500">Loading cases...</p>}
      {isError && <p className="text-sm text-red-600">Failed to load cases.</p>}
      {data && <CaseTable cases={data} />}
    </main>
  );
}
