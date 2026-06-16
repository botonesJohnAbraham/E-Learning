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
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      if (u && mounted) {
        let role = u.user_metadata?.role || "student";
        const name = u.user_metadata?.name || u.email || "User";
        
        // Fetch profile to ensure we have the correct role
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", u.id)
            .single();
          if (profile) role = profile.role || role;
        } catch (e) {
          // ignore profile fetch errors
        }
        
        const mapped = {
          name,
          email: u.email || "",
          role,
        };
        setUser(mapped);
        setCurrentUser(mapped as any);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      if (u) {
        (async () => {
          let role = u.user_metadata?.role || "student";
          const name = u.user_metadata?.name || u.email || "User";
          
          // Fetch profile to ensure we have the correct role
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", u.id)
              .single();
            if (profile) role = profile.role || role;
          } catch (e) {
            // ignore profile fetch errors
          }
          
          const mapped = {
            name,
            email: u.email || "",
            role,
          };
          setUser(mapped);
          setCurrentUser(mapped as any);
        })();
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
              <Link
                href={user?.role === "teacher" ? "/teacher" : user?.role === "admin" ? "/admin" : "/student"}
                className="rounded-full border border-white/10 px-3 py-1 text-sm transition hover:bg-white/6"
              >
                Dashboard
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
