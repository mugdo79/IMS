import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";

export interface CaseSummary {
  id: string;
  accessionNumber: string;
  status: string;
  assignedPathologist?: string;
}

export function useCases() {
  return useQuery({
    queryKey: ["cases"],
    queryFn: () => apiFetch<CaseSummary[]>("/api/cases"),
  });
}
