"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, setCurrentUser } from "../utils/auth";

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
    setTimeout(() => {
      const res = loginUser(email, password);
      setLoading(false);
      if (!res.ok) {
        setError(res.error || "Login failed");
        return;
      }
      setCurrentUser(res.user || null);
      // redirect based on role
      if (res.user?.role === "teacher") router.push("/teacher");
      else if (res.user?.role === "admin") router.push("/admin");
      else router.push("/student");
    }, 400);
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
