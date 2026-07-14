import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const maxFileSize = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function authorize(request: Request) {
  const password = process.env.NGOPI_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!password) {
    return {
      ok: false,
      message: "NGOPI_ADMIN_PASSWORD belum diset di environment Vercel.",
    };
  }

  if (request.headers.get("x-admin-password") !== password) {
    return {
      ok: false,
      message: "Password admin salah. Pastikan sama dengan NGOPI_ADMIN_PASSWORD di Vercel.",
    };
  }

  return {
    ok: true,
    message: "",
  };
}

function getSupabaseSettings() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "landing-assets";

  if (!url || !key) return null;

  return {
    url: url.replace(/\/$/, ""),
    key,
    bucket,
  };
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function POST(request: Request) {
  const authorization = authorize(request);

  if (!authorization.ok) {
    return NextResponse.json({ message: authorization.message }, { status: 401 });
  }

  const supabase = getSupabaseSettings();

  if (!supabase) {
    return NextResponse.json(
      {
        message: "Supabase Storage env belum lengkap. Set SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di Vercel.",
      },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const target = String(formData.get("target") || "asset");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File belum dipilih." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ message: "Format file harus JPG, PNG, WebP, atau GIF." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json({ message: "Ukuran file maksimal 5MB." }, { status: 400 });
  }

  const extension = allowedTypes.get(file.type);
  const cleanName = sanitizeFileName(file.name) || "asset";
  const path = `ngopi/${target}/${Date.now()}-${randomUUID()}-${cleanName}.${extension}`;
  const uploadUrl = `${supabase.url}/storage/v1/object/${supabase.bucket}/${path}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: supabase.key,
      Authorization: `Bearer ${supabase.key}`,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: await file.arrayBuffer(),
  });

  if (!uploadResponse.ok) {
    return NextResponse.json({ message: await uploadResponse.text() }, { status: 500 });
  }

  const publicUrl = `${supabase.url}/storage/v1/object/public/${supabase.bucket}/${path}`;

  return NextResponse.json({
    data: {
      url: publicUrl,
      path,
    },
  });
}
