import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Digital Pathology IMS</h1>
      <Link href="/cases" className="text-sm font-medium underline">
        Go to case worklist
      </Link>
    </main>
  );
}
