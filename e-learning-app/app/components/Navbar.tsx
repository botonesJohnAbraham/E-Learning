"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, setCurrentUser, User } from "../utils/auth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
    const onStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function logout() {
    setCurrentUser(null);
    setUser(null);
    router.push("/");
  }

  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            E-Learning
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-slate-200 md:flex">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/20 px-3 py-1 text-sm transition hover:bg-white/6"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={user.role === "teacher" ? "/teacher" : user.role === "admin" ? "/admin" : "/student"}
                className="rounded-full border border-white/10 px-3 py-1 text-sm transition hover:bg-white/6"
              >
                {user.name || user.email}
              </Link>
              <button
                onClick={logout}
                className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
