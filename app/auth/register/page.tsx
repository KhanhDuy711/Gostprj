"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not create account.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/auth/login");
      return;
    }
    router.push("/");
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-white/50">Join to start building your library.</p>

          <div className="mt-6 space-y-4">
            <Input
              placeholder="Full name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password (min 8 characters)"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <Button type="submit" className="mt-6 w-full" size="lg" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>

          <p className="mt-4 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--accent-blue)] hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}
