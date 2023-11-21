import config from '$lib/config';

import { stripe } from '$lib/server/stripe.js';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ request }) => {
	const prices = await stripe.prices.list({
		expand: ['data.product'],
		lookup_keys: [...Object.keys(config.prices)]
	});
	const language = request.headers.get('accept-language');

	return {
		language,
		prices: prices.data
	};
};

export const actions: Actions = {
	createCheckoutSession: async ({ request, url }) => {
		const formData = await request.formData();
		const priceId = formData.get('priceId');
		const teamId = formData.get('teamId');
		const email = formData.get('email');
		if (!priceId || !teamId) {
			return fail(400, {
				message: 'Missing price or team'
			});
		}
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: priceId.toString(),
					quantity: 1
				}
			],
			client_reference_id: teamId.toString(),
			customer_email: email?.toString(),
			metadata: {
				team_id: teamId.toString()
			},
			mode: 'subscription',
			success_url: url.origin,
			cancel_url: url.origin
		});
		if (!session.url) {
			throw redirect(302, '/');
		}
		throw redirect(302, session.url);
	}
};
