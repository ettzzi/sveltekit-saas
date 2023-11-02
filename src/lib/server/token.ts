import prisma from '$lib/prisma';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await prisma.emailVerificationToken.findMany({
		where: {
			user_id: userId
		}
	});

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);

	await prisma.emailVerificationToken.create({
		data: {
			id: token,
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId
		}
	});

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await prisma.$transaction(async (trx) => {
		const storedToken = await trx.emailVerificationToken.findUniqueOrThrow({
			where: {
				id: token
			}
		});

		await trx.emailVerificationToken.deleteMany({
			where: {
				user_id: storedToken.user_id
			}
		});

		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires);
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.user_id;
};

export const generatePasswordResetToken = async (userId: string) => {
	const storedUserTokens = await prisma.passwordResetToken.findMany({
		where: {
			user_id: userId
		}
	});

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);

	await prisma.passwordResetToken.create({
		data: {
			id: token,
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId
		}
	});

	return token;
};

export const validatePasswordResetToken = async (token: string) => {
	const storedToken = await prisma.$transaction(async (trx) => {
		const storedToken = await trx.passwordResetToken.findFirstOrThrow({
			where: {
				id: token
			}
		});

		await trx.passwordResetToken.deleteMany({
			where: {
				user_id: storedToken.user_id
			}
		});

		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires);
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.user_id;
};

export const isValidPasswordResetToken = async (token: string) => {
	const storedToken = await prisma.passwordResetToken.findFirst({
		where: {
			id: token
		}
	});

	if (!storedToken) return false;
	const tokenExpires = Number(storedToken.expires);
	if (!isWithinExpiration(tokenExpires)) {
		return false;
	}
	return true;
};
