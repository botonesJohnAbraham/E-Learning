import { supabase } from "../lib/supabaseClient";

export async function registerWithSupabase({ name, email, password, role }: { name: string; email: string; password: string; role: string; }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (error) return { ok: false, error: error.message, data: null };

    // Insert/upsert into profiles table to ensure role is stored
    if (data?.user) {
      try {
        await supabase.from("profiles").upsert(
          { id: data.user.id, name, email, role },
          { onConflict: "id" }
        );
      } catch (e) {
        console.error("Profile upsert error:", e);
        // Don't fail registration if profile insert fails
      }
    }

    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err.message || String(err), data: null };
  }
}

export async function loginWithSupabase(email: string, password: string) {
  try {
    const resp = await supabase.auth.signInWithPassword({ email, password });
    if (resp.error) return { ok: false, error: resp.error.message, data: null };
    
    // Fetch the profile to ensure we have the correct role
    if (resp.data?.user) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, name")
          .eq("id", resp.data.user.id)
          .single();
        
        // Merge profile data with auth data, prioritizing profile for role
        if (profile) {
          if (!resp.data.user.user_metadata) resp.data.user.user_metadata = {};
          resp.data.user.user_metadata.role = profile.role || "student";
          resp.data.user.user_metadata.name = profile.name || resp.data.user.user_metadata.name;
        }
      } catch (e) {
        console.error("Profile fetch error:", e);
        // Continue without profile data if fetch fails
      }
    }
    
    return { ok: true, data: resp.data };
  } catch (err: any) {
    return { ok: false, error: err.message || String(err), data: null };
  }
}

export async function signOutSupabase() {
  await supabase.auth.signOut();
}
