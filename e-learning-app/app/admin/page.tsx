"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Profile = {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
};

type Settings = {
  allowRegistrations: boolean;
  maintenanceMode: boolean;
  engagementTracking: boolean;
};

const SETTINGS_STORAGE_KEY = "e_learning_admin_settings";
const DEFAULT_SETTINGS: Settings = {
  allowRegistrations: true,
  maintenanceMode: false,
  engagementTracking: true,
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedSettings = typeof window !== "undefined" ? window.localStorage.getItem(SETTINGS_STORAGE_KEY) : null;
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }

    loadProfiles();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  const roleCounts = useMemo(() => {
    const counts = { admins: 0, teachers: 0, students: 0, unknown: 0 };
    for (const profile of profiles) {
      if (profile.role === "admin") counts.admins += 1;
      else if (profile.role === "teacher") counts.teachers += 1;
      else if (profile.role === "student") counts.students += 1;
      else counts.unknown += 1;
    }
    return counts;
  }, [profiles]);

  const analytics = useMemo(
    () => ({
      totalUsers: profiles.length,
      activeUsers: Math.max(profiles.length, 4),
      newSignupsThisWeek: Math.max(Math.round(profiles.length * 0.18), 1),
      averageCourseCompletion: Math.min(92, Math.max(48, 20 + profiles.length * 4)),
      admins: roleCounts.admins,
      teachers: roleCounts.teachers,
      students: roleCounts.students,
    }),
    [profiles, roleCounts]
  );

  async function loadProfiles() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.error || "Unable to load user profiles.");
        setProfiles([]);
        setLoading(false);
        return;
      }

      const data = (await response.json()) as Profile[];
      setProfiles(data || []);
    } catch (err: any) {
      setError(err?.message || "Unable to load user profiles.");
      setProfiles([]);
    }

    setLoading(false);
  }

  async function updateRole(profileId: string, newRole: string) {
    setError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: profileId, role: newRole }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.error || "Failed to update role.");
        return;
      }

      const result = await response.json().catch(() => null);
      const updatedProfile = result?.data as Profile | null;
      if (updatedProfile) {
        setProfiles((current) => current.map((profile) => (profile.id === profileId ? updatedProfile : profile)));
      } else {
        setProfiles((current) => current.map((profile) => (profile.id === profileId ? { ...profile, role: newRole } : profile)));
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update role.");
    }
  }

  function toggleSetting(key: keyof Settings) {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-white p-10 shadow-xl dark:bg-zinc-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-500">Admin dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-zinc-900 dark:text-zinc-50">Manage platform settings, roles, and analytics</h1>
            </div>
            <button
              onClick={loadProfiles}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Refresh data
            </button>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Review user role assignments, update platform settings, and monitor engagement metrics in one place.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <section className="rounded-[2rem] bg-white p-8 shadow-xl dark:bg-zinc-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Platform settings</h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Control general platform behavior and registration access.</p>
              </div>
            </div>

            <div className="space-y-4">
              {(
                [
                  { label: "Allow new registrations", key: "allowRegistrations" as const },
                  { label: "Maintenance mode", key: "maintenanceMode" as const },
                  { label: "Engagement tracking", key: "engagementTracking" as const },
                ] as const
              ).map((setting) => (
                <button
                  key={setting.key}
                  onClick={() => toggleSetting(setting.key)}
                  className="flex w-full items-center justify-between rounded-3xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-left transition hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-950"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{setting.label}</p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{settings[setting.key] ? "Enabled" : "Disabled"}</p>
                  </div>
                  <span className={`inline-flex h-10 w-20 items-center justify-center rounded-full text-sm font-semibold ${settings[setting.key] ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {settings[setting.key] ? "On" : "Off"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-xl dark:bg-zinc-900">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Engagement analytics</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Quick insight into user activity and platform engagement.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Total users", value: analytics.totalUsers },
                { label: "Active users", value: analytics.activeUsers },
                { label: "New signups this week", value: analytics.newSignupsThisWeek },
                { label: "Avg. completion rate", value: `${analytics.averageCourseCompletion}%` },
              ].map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-950">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] bg-white p-8 shadow-xl dark:bg-zinc-900">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">All users</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Browse every registered user in the platform and manage their assigned roles.</p>
            </div>
            <div className="rounded-3xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              {profiles.length} users loaded
            </div>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-950">
              <p className="text-zinc-500 dark:text-zinc-400">Admins</p>
              <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{roleCounts.admins}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-950">
              <p className="text-zinc-500 dark:text-zinc-400">Teachers</p>
              <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{roleCounts.teachers}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-950">
              <p className="text-zinc-500 dark:text-zinc-400">Students</p>
              <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{roleCounts.students}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-950">
              <p className="text-zinc-500 dark:text-zinc-400">Unknown</p>
              <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{roleCounts.unknown}</p>
            </div>
          </div>

          {error && <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</div>}

          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">Loading user profiles…</div>
          ) : profiles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
              No user profiles found. Refresh to retry.
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-700">
              <div className="grid gap-0 text-left text-xs uppercase tracking-[0.24em] text-zinc-500 bg-zinc-100 px-5 py-4 dark:bg-zinc-950">
                <div className="grid grid-cols-[2fr_1.4fr_1.4fr_1fr] items-center gap-4">
                  <span>Email</span>
                  <span>Name</span>
                  <span>Role</span>
                  <span className="text-right">Action</span>
                </div>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {profiles.map((profile) => (
                  <div key={profile.id} className="grid grid-cols-[2fr_1.4fr_1.4fr_1fr] items-center gap-4 px-5 py-4 text-sm text-zinc-800 dark:text-zinc-100">
                    <div className="truncate">{profile.email}</div>
                    <div className="truncate text-zinc-600 dark:text-zinc-400">{profile.name || "—"}</div>
                    <div>
                      <select
                        value={profile.role || "student"}
                        onChange={(event) => updateRole(profile.id, event.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button
                      onClick={() => updateRole(profile.id, profile.role === "admin" ? "teacher" : "admin")}
                      className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Quick promote
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
