import { sendEmail } from '$lib/server/email';
import { generateEmailVerificationToken } from '$lib/server/token';
import { redirect, type Actions, fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, url }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/signin');
		if (session.user.emailVerified) {
			throw redirect(302, '/');
		}
		try {
			const token = await generateEmailVerificationToken(session.user.userId);

			sendEmail({
				to: String(session.user.email),
				subject: `Welcome to SvelteKit Starter`,
				html: `<html><body><p>Click <a href="${url.origin}/email-verification/${token}">here</a> to verify your e-mail address.</p></body></html>`
			});

			return {
				success: true
			};
		} catch (e) {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
