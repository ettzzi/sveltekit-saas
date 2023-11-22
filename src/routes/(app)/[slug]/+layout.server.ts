import prisma from '$lib/prisma.js';
import { redirect } from '@sveltejs/kit';

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
		team
	};
};
