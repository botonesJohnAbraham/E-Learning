"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { setCurrentUser } from "../utils/auth";

export default function Navbar() {
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadSupabaseUser(u: any) {
      let role = u.user_metadata?.role || "student";
      let name = u.user_metadata?.name || "";

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, name")
          .eq("id", u.id)
          .single();
        if (profile) {
          role = profile.role || role;
          name = profile.name || name;
        }
      } catch (e) {
        // ignore profile fetch errors
      }

      if (!name) {
        name = u.email || "User";
      }

      const mapped = {
        name,
        email: u.email || "",
        role,
      };

      if (mounted) {
        setUser(mapped);
        setCurrentUser(mapped as any);
      }
    }

    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      if (u) {
        await loadSupabaseUser(u);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      if (u) {
        loadSupabaseUser(u);
      } else {
        setUser(null);
        setCurrentUser(null);
      }
    });

    return () => {
      mounted = false;
      try {
        listener?.subscription.unsubscribe();
      } catch {}
    };
  }, []);

  async function logout() {
    try {
      await supabase.auth.signOut();
    } catch {}
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
                className="rounded-full bg-white/6 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/10"
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
              <div className="text-sm text-slate-200">
                Welcome, <span className="font-semibold text-white">{user?.name || "User"}</span>
              </div>
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
