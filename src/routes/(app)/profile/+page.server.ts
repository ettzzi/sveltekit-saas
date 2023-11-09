import prisma from '$lib/prisma';
import { auth } from '$lib/server/lucia';
import {
	PrismaClientKnownRequestError,
	PrismaClientValidationError
} from '@prisma/client/runtime/library';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import z from 'zod';

export const load = async ({ parent }) => {
	const { user } = await parent();

	const keys = await auth.getAllUserKeys(user.userId);
	return {
		user: {
			...user,
			passwordDefined: keys.some((item) => item.passwordDefined)
		}
	};
};

const updateUserInfoSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z
		.string({
			required_error: 'Email is required'
		})
		.email()
		.min(1)
});

const updatePasswordSchema = z
	.object({
		current_password: z.string().optional(),
		new_password: z.string().min(1, 'New password is required'),
		password_confirmation: z.string().min(1, 'Password confirmation is required')
	})
	.refine(
		(values) => {
			return values.new_password === values.password_confirmation;
		},
		{
			message: 'Passwords must match!',
			path: ['new_password']
		}
	);

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			throw redirect(302, '/signin');
		}

		const formData = Object.fromEntries(await request.formData());
		const userInfo = updateUserInfoSchema.safeParse(formData);

		if (!userInfo.success) {
			const data = {
				errors: userInfo.error.issues.map((issue) => {
					return {
						field: issue.path[0],
						message: issue.message
					};
				})
			};

			return fail(400, data);
		}

		const { name, email } = userInfo.data;

		try {
			if (session?.user.email !== email) {
				prisma.$transaction([
					prisma.user.update({
						where: { id: session.user.userId },
						data: {
							name,
							email,
							email_verified:
								session?.user.email === email ? session.user.emailVerified : Boolean(false)
						}
					}),
					prisma.key.update({
						where: {
							id: `email:${session.user.email}`
						},
						data: {
							id: `email:${email}`
						}
					})
				]);
				return {
					success: true
				};
			}

			auth.updateUserAttributes(session.user.userId, {
				name,
				email,
				email_verified: session?.user.email === email ? session.user.emailVerified : Boolean(false)
			});
		} catch (e) {
			if (e instanceof PrismaClientValidationError) {
				return {
					updateForm: {
						message: e.message
					}
				};
			}

			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					return fail(400, {
						error: true,
						errors: [
							{
								field: 'email',
								message: `Looks like an account with that email already exists. Try to login instead.`
							}
						]
					});
				}
			}
		}
	},
	updatePassword: async ({ request, locals }) => {
		const session = await locals.auth.validate();

		const formData = Object.fromEntries(await request.formData());
		const passwordInfo = updatePasswordSchema.safeParse(formData);

		if (!passwordInfo.success) {
			console.log(passwordInfo.error.issues);
			const data = {
				errors: passwordInfo.error.issues.map((issue) => {
					return {
						field: issue.path[0],
						message: issue.message
					};
				})
			};

			return fail(400, data);
		}

		if (!session || !session.user) {
			throw redirect(302, '/login');
		}

		try {
			const keys = await auth.getAllUserKeys(session.user.userId);
			const passwordDefined = keys.some((item) => item.passwordDefined);

			// If password is defined giving the current password is mandatory
			if (passwordDefined) {
				if (!passwordInfo.data.current_password) {
					return fail(400, {
						errors: {
							field: 'current_password',
							message: 'Current password is required'
						}
					});
				}
				await auth.useKey('email', session?.user.email, passwordInfo.data.current_password);
				await auth.updateKeyPassword('email', session?.user.email, passwordInfo.data.new_password);
			} else {
				await auth.createKey({
					providerId: 'email',
					password: passwordInfo.data.new_password,
					userId: session.user.userId,
					providerUserId: session.user.email.toLowerCase()
				});
			}

			return {
				success: true
			};
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				return fail(400, {
					errors: [
						{
							field: 'password',
							message: 'Your current password is wrong'
						}
					]
				});
			}
		}
	},
	delete: async ({ locals }) => {
		try {
			const session = await locals.auth.validate();
			const teams = await prisma.userTeamRole.findMany({
				where: {
					user_id: session?.user.userId,
					role: 'ADMIN'
				},
				select: {
					team_id: true
				}
			});
			const deleteTeamPromises = teams.map((team) =>
				prisma.team.delete({
					where: {
						id: team.team_id
					}
				})
			);

			await prisma.$transaction(deleteTeamPromises);
			await auth.deleteUser(session!.user.userId);
		} catch (e) {
			if (e instanceof PrismaClientValidationError) {
				return {
					message: 'Delete failed. Please, try again later.'
				};
			}
		}
		throw redirect(302, '/register');
	}
};
