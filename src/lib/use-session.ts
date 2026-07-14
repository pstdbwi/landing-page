import useSWR from 'swr';
import { SessionData, defaultSession } from '@/lib/session';
import useSWRMutation from 'swr/mutation';

const sessionApiRoute = '/api/session';
const sessionApiRouteGoogle = '/api/session/google';

async function fetchJson<JSON = unknown>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
	return fetch(input, {
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
		},
		...init,
	}).then((res) => res.json());
}

function doLogin(url: string, { arg }: { arg: any }) {
	const { username, password } = arg

	return fetchJson<SessionData>(url, {
		method: 'POST',
		body: JSON.stringify({ username, password }),
	});
}

function doLogout(url: string) {
	return fetchJson<SessionData>(url, {
		method: 'DELETE',
	});
}

function doLoginGoogle(url: string, { arg }: { arg: any }) {
	return fetchJson<SessionData>(url, {
		method: 'POST',
		body: JSON.stringify({...arg}),
	});
}

export default function useSession() {
	const { data: session, isLoading } = useSWR(sessionApiRoute, fetchJson<SessionData>, {
		fallbackData: defaultSession,
	});

	const { trigger: login } = useSWRMutation(sessionApiRoute, doLogin, {
		// the login route already provides the updated information, no need to revalidate
		revalidate: false,
	});

	const { trigger: loginGoogle } = useSWRMutation(sessionApiRouteGoogle, doLoginGoogle, {
		// the login route already provides the updated information, no need to revalidate
		revalidate: false,
	});

	const { trigger: logout } = useSWRMutation(sessionApiRoute, doLogout);

	return { session, logout, login, loginGoogle, isLoading };
}
