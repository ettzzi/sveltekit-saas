import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';
import { findCheckoutSession, stripe } from '$lib/server/stripe';
import { STRIPE_SIGNIN_SECRET } from '$env/static/private';

import { removeSubscription, updateTeam } from '$lib/server/data/teams';
import prisma from '$lib/prisma';

export const POST: RequestHandler = async (event) => {
	const stripeSignature = event.request.headers.get('stripe-signature');

	if (!stripeSignature) {
		return json('Unauthorized', { status: 401 });
	}

	const body = await event.request.text();

	let stripeEvent: Stripe.DiscriminatedEvent;

	try {
		stripeEvent = stripe.webhooks.constructEvent(
			body,
			stripeSignature,
			STRIPE_SIGNIN_SECRET
		) as Stripe.DiscriminatedEvent;
	} catch (e) {
		return json('Invalid signature', { status: 401 });
	}

	try {
		switch (stripeEvent.type) {
			case 'checkout.session.completed':
				{
					const session = await findCheckoutSession(stripeEvent.data.object.id);

					const customerId = session?.customer;
					const priceId = session?.line_items?.data[0]?.price?.id;
					const teamId = stripeEvent.data.object.metadata?.team_id;

					if (teamId && priceId && typeof customerId === 'string') {
						await updateTeam(parseInt(teamId, 10), {
							price_id: priceId,
							customer_id: String(customerId),
							subscription_active: true
						});
					}
				}
				break;
			case 'checkout.session.expired': {
				// User didn't complete the transaction
				// You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
				break;
			}

			case 'customer.subscription.updated': {
				// The customer might have changed the plan (higher or lower plan, cancel soon etc...)
				// You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
				// You can update the user data to show a "Cancel soon" badge for instance
				break;
			}
			case 'customer.subscription.deleted': {
				// The subscription was cancelled, we need to remove the data from team
				const stripeObject: Stripe.Subscription = stripeEvent.data.object as Stripe.Subscription;

				const subscription = await stripe.subscriptions.retrieve(stripeObject.id);

				await removeSubscription(subscription.customer as string);
				break;
			}
			case 'invoice.paid':
				// Continue to provision the subscription as payments continue to be made.
				// Store the status in your database and check when a user accesses your service.
				// This approach helps you avoid hitting rate limits.
				break;
			case 'invoice.payment_failed':
				// The payment failed or the customer does not have a valid payment method.
				// The subscription becomes past_due. Notify your customer and send them to the
				// customer portal to update their payment information.
				break;
			default:
			// Unhandled event TYPE
		}
	} catch (e) {
		console.log(e);
		return json(`Error processing event ${stripeEvent.type}`, { status: 500 });
	}

	return json({ received: true }, { status: 200 });
};
