import { readLandingConfig } from "@/lib/server/landing-config-store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "ngopi";
  const config = await readLandingConfig(slug);

  return NextResponse.json({ data: config });
}
