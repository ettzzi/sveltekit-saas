import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { teams } = await parent();
	if (!teams || !teams.length) {
		throw redirect(302, '/team/create');
	}

	throw redirect(302, teams[0].team.slug);
};
