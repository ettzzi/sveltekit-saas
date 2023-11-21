import prisma from '$lib/prisma';
import type { Prisma } from '@prisma/client';

export const updateTeam = (id: number, data: Prisma.TeamUpdateInput) =>
	prisma.team.update({
		where: {
			id
		},
		data
	});

export const removeSubscription = (customerId: string) =>
	prisma.$executeRaw`UPDATE Team SET subscription_active = false, price_id = null, customer_id = null WHERE customer_id = ${customerId}`;

export const createTeam = (data: Prisma.TeamCreateInput) =>
	prisma.team.create({
		data
	});
