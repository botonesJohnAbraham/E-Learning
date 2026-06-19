import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase server configuration for admin client.");
  }

  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

async function requireAdmin(supabase: Awaited<ReturnType<typeof createAdminClient>>) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const supabase = await createAdminClient();
    const user = await requireAdmin(supabase);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: invalid or non-admin user" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,name,role");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const token = parseBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Missing access token" }, { status: 401 });
    }

    const supabase = await createAdminClient();
    const user = await requireAdmin(supabase, token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: invalid or non-admin user" }, { status: 403 });
    }

    const body = await request.json();
    const profileId = typeof body?.id === "string" ? body.id : null;
    const newRole = typeof body?.role === "string" ? body.role : null;

    if (!profileId || !newRole || !["student", "teacher", "admin"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profileId)
      .select("id,email,name,role")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
