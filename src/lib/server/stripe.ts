import { STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2023-10-16',
	typescript: true
});

export const findCheckoutSession = async (sessionId: string) => {
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['line_items']
		});

		return session;
	} catch (e) {
		console.error(e);
		return null;
	}
};
