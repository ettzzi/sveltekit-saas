import prisma from '$lib/prisma';
import crypto from 'crypto';
import { redirect, type Actions } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/email.js';

export const load = async ({ params, parent }) => {
	const data = await parent();

	return {
		streamed: {
			role: prisma.userTeamRole.findFirst({
				where: {
					user_id: data.user.userId
				}
			}),
			members: prisma.userTeamRole.findMany({
				where: {
					team: {
						slug: params.slug
					}
				},
				include: {
					user: true
				}
			}),
			team: prisma.team.findUnique({
				where: {
					slug: params.slug
				}
			}),
			invite: prisma.invite.findMany({
				where: {
					team: {
						slug: params.slug
					}
				}
			})
		}
	};
};

export const actions: Actions = {
	deleteUser: async ({ request }) => {
		const formData = await request.formData();

		const user_id = formData.get('userId');

		await prisma.userTeamRole.deleteMany({
			where: {
				user_id: user_id!.toString()
			}
		});

		return {
			success: true
		};
	},
	inviteUser: async ({ request, locals, url }) => {
		const session = await locals.auth.validate();
		const formData = await request.formData();

		if (!session) throw redirect(302, '/login');

		const email = formData.get('email');
		const teamId = formData.get('teamId');

		const token = crypto.randomBytes(20).toString('hex');
		await prisma.invite.create({
			data: {
				inviter_id: session.user.userId,
				email: email!.toString(),
				team_id: parseInt(teamId!.toString(), 10),
				token,
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
			}
		});

		sendEmail({
			to: String(email),
			subject: `You've been invited to SvelteKit Starter`,
			html: `<html><body><p>Click <a href="${url.origin}/accept-invite/${token}">here</a> to accept your invite.</p></body></html>`
		});
	}
};
