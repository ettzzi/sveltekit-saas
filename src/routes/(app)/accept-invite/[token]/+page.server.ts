import { dev } from '$app/environment';
import prisma from '$lib/prisma';

import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, url, cookies }) => {
	const { token } = params;
	if (!token) {
		throw fail(400, {
			message: 'Invalid token'
		});
	}

	const inviteExists = await prisma.invite.findUnique({
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

	const user = await prisma.user.findUnique({
		where: {
			email: inviteExists.email
		}
	});

	if (!user) {
		cookies.set('redirect_to', url.href, {
			httpOnly: true,
			secure: !dev,
			path: '/'
		});

		throw redirect(302, `/signup`);
	}

	const [foundTeam] = await prisma.$transaction([
		prisma.team.findUnique({
			where: {
				id: inviteExists.team_id
			}
		}),
		prisma.userTeamRole.create({
			data: {
				user_id: user.id,
				team_id: inviteExists.team_id,
				role: inviteExists.role
			}
		}),

		prisma.invite.delete({
			where: {
				token
			}
		})
	]);

	cookies.delete('redirect_to');
	if (foundTeam) {
		throw redirect(302, `/${foundTeam.slug}`);
	}

	return fail(404, {
		message: 'Team not found'
	});
};
