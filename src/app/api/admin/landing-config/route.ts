import { normalizeNgopiLandingConfig } from "@/lib/ngopi-landing-config";
import { readLandingConfig, saveLandingConfig } from "@/lib/server/landing-config-store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
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

export async function GET(request: Request) {
  const authorization = isAuthorized(request);

  if (!authorization.ok) {
    return NextResponse.json({ message: authorization.message }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "ngopi";
  const config = await readLandingConfig(slug);

  return NextResponse.json({ data: config });
}

export async function PUT(request: Request) {
  const authorization = isAuthorized(request);

  if (!authorization.ok) {
    return NextResponse.json({ message: authorization.message }, { status: 401 });
  }

  try {
    const body = await request.json();
    const config = await saveLandingConfig(normalizeNgopiLandingConfig(body));

    return NextResponse.json({ data: config });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Gagal menyimpan konfigurasi" }, { status: 500 });
  }
}
