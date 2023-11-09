import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (async ({ parent }) => {
	const { user } = await parent();
	if (!user) {
		throw redirect(302, '/login');
	}
	return { user };
}) satisfies LayoutLoad;
