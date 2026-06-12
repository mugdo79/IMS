import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form className="flex w-full max-w-sm flex-col gap-4 p-8">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input type="email" name="email" required className="rounded border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input type="password" name="password" required className="rounded border px-3 py-2" />
        </label>
        <Button type="submit">Sign in</Button>
      </form>
    </main>
  );
}
