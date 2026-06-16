"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerWithSupabase } from "../utils/supabaseAuth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError("Please fill all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    (async () => {
      const res = await registerWithSupabase({ name, email, password, role });
      setLoading(false);
      if (!res.ok) {
        setError(res.error || "Registration failed");
        return;
      }
      // registration success — redirect to login (email confirmation may be required)
      router.push("/login");
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Create an account</h1>
        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="rounded-md border px-3 py-2 text-sm"
          />
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
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            type="password"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <label className="mt-2 flex items-center gap-2 text-sm">
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="ml-2 rounded-md border px-2 py-1 text-sm">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
