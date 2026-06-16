"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithSupabase } from "../utils/supabaseAuth";
import { setCurrentUser } from "../utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    (async () => {
      const res = await loginWithSupabase(email, password);
      setLoading(false);
      if (!res.ok) {
        setError(res.error || "Login failed");
        return;
      }

      const user = (res.data?.user || res.data?.session?.user) as any;
      const role = user?.user_metadata?.role || "student";
      const mapped = {
        name: user?.user_metadata?.name || user?.email || "",
        email: user?.email || "",
        password: "",
        role: role,
      };

      setCurrentUser(mapped as any);

      // Route based on role
      if (role === "teacher") router.push("/teacher");
      else if (role === "admin") router.push("/admin");
      else router.push("/student");
    })();
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Sign in</h1>
        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="rounded-md border px-3 py-2 text-sm"
          />

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
