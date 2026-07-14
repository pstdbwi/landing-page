import { normalizeNgopiLandingConfig } from "@/lib/ngopi-landing-config";
import { readLandingConfig, saveLandingConfig } from "@/lib/server/landing-config-store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const password = process.env.NGOPI_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!password) return false;

  return request.headers.get("x-admin-password") === password;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "ngopi";
  const config = await readLandingConfig(slug);

  return NextResponse.json({ data: config });
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const config = await saveLandingConfig(normalizeNgopiLandingConfig(body));

    return NextResponse.json({ data: config });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Gagal menyimpan konfigurasi" }, { status: 500 });
  }
}
