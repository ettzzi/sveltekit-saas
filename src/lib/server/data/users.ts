import prisma from '$lib/prisma';
import type { Prisma } from '@prisma/client';

export const fetchUserByEmail = (email: string) =>
	prisma.user.findUnique({
		where: {
			email
		}
	});

export const updateUser = (data: Prisma.UserUpdateArgs) => prisma.user.update(data);
