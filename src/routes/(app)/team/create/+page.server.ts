import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const name = formData.get('name');
		const session = await locals.auth.validate();

		if (!session?.user.userId) {
			throw new Error('User not found');
		}

		const slug = name!.toString().toLowerCase().replace(/\s/g, '-');
		await prisma.team.create({
			data: {
				name: name!.toString(),
				slug,
				UserTeamRole: {
					create: {
						user_id: session.user.userId,
						role: 'ADMIN'
					}
				}
			}
		});

		throw redirect(302, `/${slug}`);
	}
};
