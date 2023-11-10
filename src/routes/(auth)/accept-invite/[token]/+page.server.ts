import { dev } from '$app/environment';
import prisma from '$lib/prisma';
import type { Role } from '@prisma/client';

import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, url, cookies, locals }) => {
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

	const inviteExists = await prisma.invite.findUniqueOrThrow({
		where: {
			token
		},
		include: {
			inviter: true
		}
	});

	if (!inviteExists) {
		return fail(404, {
			message: 'Invite not valid or already used'
		});
	}

	if (session.user.email !== inviteExists.email) {
		throw fail(400, {
			message: 'Invite not valid or already used'
		});
	}

	const [foundTeam] = await prisma.$transaction([
		assignUserToTeam(session.user.userId, inviteExists.team_id, inviteExists.role),
		deleteInviteByToken(token)
	]);

	cookies.delete('redirect_to');
	if (foundTeam.team.slug) {
		throw redirect(302, `/${foundTeam.team.slug}`);
	}

	return fail(404, {
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
