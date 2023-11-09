import prisma from '$lib/prisma.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { user } = await parent();

	const data = await prisma.userTeamRole.findFirst({
		where: {
			user_id: user.userId
		},
		include: {
			team: true
		}
	});

	if (!data) {
		throw redirect(302, '/team/create');
	}

	throw redirect(302, `/${data.team.slug}`);
};
