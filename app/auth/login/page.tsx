"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(searchParams.get("next") ?? "/");
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/50">Log in to access your library.</p>

          <div className="mt-6 space-y-4">
            <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <Button type="submit" className="mt-6 w-full" size="lg" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>

          <p className="mt-4 text-center text-sm text-white/50">
            No account?{" "}
            <Link href="/auth/register" className="text-[var(--accent-blue)] hover:underline">
              Register
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-white/30">
            Demo: customer@visualbar.store / Customer123!
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
