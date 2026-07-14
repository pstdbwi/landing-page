import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { defaultSession, sessionOptions, sleep, SessionData } from "@/lib/session";
import { env } from "@/lib/env";
import jwt from "jsonwebtoken";

// LOGIN AND SET SESSION
export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const { username, password } = (await request.json()) as {
    username: string;
    password: string;
  };

  const bodyPayload = {
    username,
    password,
  };

  const user = await fetch(`${env.BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify(bodyPayload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await user.json();

  if (response.status_code === 200) {
    const user: any = jwt.decode(response.data[0].token);

    session.id = user.id;
    session.email = user.email;
    session.name = user.full_name;
    session.image = user.image;
    session.phone_number = user.phone_number;
    session.type = "credential";
    session.corp_id = response?.data[0]?.corp_id;
    session.corp_name = response?.data[0]?.corp_name;
    session.corp_unit_id = response?.data[0]?.corp_unit_id;
    session.corp_unit_name = response?.data[0]?.corp_unit_name;
    session.corp_unit_group = response?.data[0]?.corp_unit_group;
    session.isLoggedIn = true;

    // GEOLOCATION
    session.province_id = user?.province_id;
    session.province_code = user?.province_code;
    session.province_name = user?.province_name;

    session.city_id = user?.city_id;
    session.city_code = user?.city_code;
    session.city_name = user?.city_name;

    session.district_id = user?.district_id;
    session.district_code = user?.district_code;
    session.district_name = user?.district_name;

    await session.save();

    cookies().set("user_token", response.data[0].token, {
      maxAge: 30 * 24 * 60 * 60, // 30 Days
    });
  }

  return NextResponse.json(response);
}

// READ SESSION
export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn !== true) {
    return NextResponse.json(defaultSession);
  }

  return NextResponse.json(session);
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  session.destroy();

  return NextResponse.json(defaultSession);
}
