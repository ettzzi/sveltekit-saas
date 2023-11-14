import { dev } from '$app/environment';
import prisma from '$lib/prisma';
import type { Role } from '@prisma/client';

import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ params, url, cookies, locals }) => {
	const { token } = params;
	const session = await locals.auth.validate();
	if (!session) {
		cookies.set('redirect_to', url.href, {
			httpOnly: true,
			secure: !dev,
			path: '/'
		});

		throw redirect(302, `/register`);
	}

	cookies.delete('redirect_to');
	const inviteExists = await prisma.invite.findUnique({
		where: {
			token
		},
		include: {
			inviter: true
		}
	});

	if (!inviteExists) {
		throw error(400, {
			message: 'Invite not valid or already used'
		});
	}

	if (inviteExists.expires_at < new Date()) {
		await prisma.invite.delete({
			where: {
				token
			}
		});

		throw error(400, {
			message: 'Invite expired'
		});
	}

	if (session.user.email !== inviteExists.email) {
		throw error(400, {
			message: 'Invite not valid or already used'
		});
	}

	const [foundTeam] = await prisma.$transaction([
		assignUserToTeam(session.user.userId, inviteExists.team_id, inviteExists.role),
		deleteInviteByToken(token)
	]);

	if (foundTeam.team.slug) {
		throw redirect(302, `/${foundTeam.team.slug}`);
	}

	throw error(404, {
		message: 'Team not found'
	});
};

function assignUserToTeam(user_id: string, team_id: number, role: Role) {
	return prisma.userTeamRole.create({
		data: {
			user_id,
			team_id,
			role
		},
		include: {
			team: true
		}
	});
}

function deleteInviteByToken(token: string) {
	return prisma.invite.delete({
		where: {
			token
		}
	});
}
