import prisma from '$lib/prisma.js';
import { auth, googleAuth } from '$lib/server/lucia';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { error } from '@sveltejs/kit';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { getExistingUser, googleUser, createUser, createKey } =
			await googleAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();

			if (existingUser) {
				return existingUser;
			}

			if (!googleUser.email_verified) {
				throw error(400, 'Email not verified');
			}

			if (!googleUser.email) {
				throw error(400, 'Google email not found');
			}

			const existingDatabaseUserWithEmail = await prisma.user.findUnique({
				where: {
					email: googleUser.email
				}
			});

			if (existingDatabaseUserWithEmail) {
				const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail);
				await createKey(user.userId);
				return user;
			}

			return await createUser({
				attributes: {
					name: googleUser.name,
					email: googleUser.email,
					email_verified: Boolean(googleUser.email_verified) || false
				}
			});
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);
		const redirectTo = cookies.get('redirectTo');
		return new Response(null, {
			status: 302,
			headers: {
				Location: redirectTo ?? '/'
			}
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
};
