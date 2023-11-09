<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import UpdateProfileForm from './update-profile-form.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Button from '$lib/components/Button.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import type { ActionData } from './$types';
	import { createToast } from '$lib/components/Toast.svelte';

	export let form: ActionData;

	$: user = $page.data.user;
</script>

<div class="flow">
	{#if form?.errors || form?.message}
		<Alert title="An error occurred">
			{#if form.message}
				<p>{form.message}</p>
			{/if}
			{#each Object.values(form?.errors || []) as error}
				<ul class="alert-content">
					<li><a href={`#${error.field}`}>{error.message}</a></li>
				</ul>
			{/each}
		</Alert>
	{/if}

	{#if user.emailVerified === false}
		<Alert title="Your user is not verified" type="warning">
			<div class="flow">
				<p>Please check your email to verify your account or request a new verification code</p>

				<form
					method="post"
					action="/email-verification"
					use:enhance={() => {
						return async ({ update, result }) => {
							if (result.type === 'success') {
								createToast({
									title: 'Email sent',
									description: 'Your activation code has been sent',
									type: 'success'
								});
							}
						};
					}}
					class="flex items-center gap-4"
				>
					<Button size="small" kind="outline" type="submit">Get a new code</Button>
				</form>
			</div>
		</Alert>
	{/if}

	<div class="flow">
		<Panel title="Update info">
			<UpdateProfileForm user={$page.data.user} />
		</Panel>

		<Panel title="Update password">
			<form
				method="POST"
				class="flow"
				action="?/updatePassword"
				use:enhance={() => {
					return async ({ update, result }) => {
						update({ reset: false });
						if (result.type === 'success') {
							createToast({
								title: 'Password updated',
								description: 'Your password has been updated',
								type: 'success'
							});
						}
					};
				}}
			>
				{#if user.passwordDefined}
					<Textfield
						label="Password"
						disabled={!user.emailVerified}
						fieldType="password"
						name="current_password"
						required
					/>
				{/if}

				<Textfield
					label="New password"
					disabled={!user.emailVerified}
					fieldType="password"
					name="new_password"
					required
				/>

				<Textfield
					label="Password confirmation"
					disabled={!user.emailVerified}
					fieldType="password"
					name="password_confirmation"
					required
				/>

				<Button type="submit" disabled={!user.emailVerified}>Update password</Button>
			</form>
		</Panel>

		<Panel title="Danger zone">
			<form method="POST" action="?/delete">
				<Button type="submit" variant="danger">Delete account</Button>
			</form>
		</Panel>
	</div>
</div>

<style>
	.alert-content a {
		color: var(--on-error);
	}
</style>
