export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-4 text-xl font-semibold">Case {caseId}</h1>
      <p className="text-sm text-zinc-500">Case detail view placeholder.</p>
    </main>
  );
}
