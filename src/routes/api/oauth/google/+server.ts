import { dev } from '$app/environment';

import { googleAuth } from '$lib/server/lucia';

export const GET = async ({ cookies }) => {
	const [url, state] = await googleAuth.getAuthorizationUrl();

	cookies.set('google_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});

    return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};