import { defaultNgopiLandingConfig, normalizeNgopiLandingConfig, type NgopiLandingConfig } from "@/lib/ngopi-landing-config";

const tableName = process.env.LANDING_CONFIG_TABLE || "landing_configs";

function getSupabaseSettings() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

function getHeaders(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function readLandingConfig(slug = "ngopi"): Promise<NgopiLandingConfig> {
  const supabase = getSupabaseSettings();

  if (!supabase) {
    return defaultNgopiLandingConfig;
  }

  const response = await fetch(
    `${supabase.url}/rest/v1/${tableName}?slug=eq.${encodeURIComponent(slug)}&select=config&limit=1`,
    {
      headers: getHeaders(supabase.key),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return defaultNgopiLandingConfig;
  }

  const rows = await response.json();
  return normalizeNgopiLandingConfig(rows?.[0]?.config);
}

export async function saveLandingConfig(config: NgopiLandingConfig) {
  const supabase = getSupabaseSettings();

  if (!supabase) {
    throw new Error("Supabase env belum diset: SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib ada.");
  }

  const normalized = normalizeNgopiLandingConfig(config);
  const response = await fetch(`${supabase.url}/rest/v1/${tableName}?on_conflict=slug`, {
    method: "POST",
    headers: {
      ...getHeaders(supabase.key),
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify([
      {
        slug: normalized.slug,
        config: normalized,
        updated_at: new Date().toISOString(),
      },
    ]),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  return normalizeNgopiLandingConfig(rows?.[0]?.config);
}
