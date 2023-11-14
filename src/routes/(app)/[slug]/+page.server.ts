import prisma from '$lib/prisma.js';
import { sendEmail } from '$lib/server/email.js';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';

export const load = async ({ params }) => {
	const team = await prisma.team.findUnique({
		where: {
			slug: params.slug
		}
	});
	if (!team) {
		throw redirect(302, '/');
	}

	return {
		team,
		streamed: {
			teamRoles: prisma.userTeamRole.findMany({
				where: {
					team: {
						slug: params.slug
					}
				},
				include: {
					user: true
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

export const actions = {
	deleteTeam: async ({ params, locals }) => {
		const session = await locals.auth.validate();

		const userTeamRole = await prisma.userTeamRole.findFirst({
			where: {
				user_id: session?.user.userId,
				team: {
					slug: params.slug
				}
			}
		});

		if (!userTeamRole || userTeamRole.role !== 'ADMIN') {
			return fail(401, {
				message: 'You are not authorized to delete this team'
			});
		}

		await prisma.team.delete({
			where: {
				slug: params.slug
			}
		});

		return {
			success: true
		};
	},
	inviteUser: async ({ locals, request, params, url }) => {
		const session = await locals.auth.validate();

		if (!session) throw redirect(302, '/login');

		const formData = await request.formData();
		const email = formData.get('email');

		const token = crypto.randomBytes(20).toString('hex');
		const team = await prisma.team.findUnique({
			where: {
				slug: params.slug
			}
		});
		if (!team) {
			return fail(400, {
				message: 'Team not found'
			});
		}

		await prisma.invite.create({
			data: {
				inviter_id: session.user.userId,
				email: email!.toString(),
				team_id: team?.id,
				token,
				expires_at: new Date(Date.now())
			}
		});

		sendEmail({
			to: String(email),
			subject: `You've been invited to SvelteKit Starter`,
			html: `<html><body><p>Click <a href="${url.origin}/accept-invite/${token}">here</a> to accept your invite.</p></body></html>`
		});

		return {
			success: true
		};
	}
};
