import { SessionData, sessionOptions } from '@/lib/session';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const session = await getIronSession<SessionData>(cookies(), sessionOptions);

	const { corp_id, corp_name, corp_unit_id, corp_unit_name, corp_unit_group } = (await request.json()) as {
		corp_id: string;
		corp_name: string;
		corp_unit_id: string;
		corp_unit_name: string;
		corp_unit_group: string;
	};

    session.corp_id = corp_id;
    session.corp_name = corp_name;
    session.corp_unit_id = corp_unit_id;
    session.corp_unit_name = corp_unit_name;
    session.corp_unit_group = corp_unit_group;

    await session.save();

	return NextResponse.json(session);
}