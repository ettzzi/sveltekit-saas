import prisma from '$lib/prisma.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { user } = await parent();
	if (!user) {
		throw redirect(302, '/login');
	}
	const teams = await prisma.userTeamRole.findMany({
		where: {
			user_id: user.userId
		},
		include: {
			team: true
		}
	});

	return {
		teams,
		user
	};
};
