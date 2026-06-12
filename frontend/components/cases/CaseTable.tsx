import type { CaseSummary } from "@/hooks/useCases";

interface CaseTableProps {
  cases: CaseSummary[];
}

export function CaseTable({ cases }: CaseTableProps) {
  if (cases.length === 0) {
    return <p className="text-sm text-zinc-500">No cases found.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2 pr-4">Accession #</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2 pr-4">Assigned Pathologist</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c) => (
          <tr key={c.id} className="border-b">
            <td className="py-2 pr-4">{c.accessionNumber}</td>
            <td className="py-2 pr-4">{c.status}</td>
            <td className="py-2 pr-4">{c.assignedPathologist ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
