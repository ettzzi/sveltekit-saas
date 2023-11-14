<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import Button from '$lib/components/Button.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	{#if form?.errors}
		<title>Errors trying to login</title>
	{:else}
		<title>Login - SvelteKit Starter</title>
	{/if}
</svelte:head>

<main class="flow">
	{#if form?.errors || form?.message}
		<Alert title="An error occurred while trying to log you in">
			{#if form?.message}
				<p>{form?.message}</p>
			{/if}

			{#each Object.values(form?.errors || []) as error}
				<ul class="alert-content">
					<li><a href={`#${error.field}`}>{error.message}</a></li>
				</ul>
			{/each}
		</Alert>
	{/if}

	<Panel title="Login">
		<div class="flow">
			<div class="center">
				<Button href="/api/oauth/google" fullWidth kind="outline">Login with Google</Button>
			</div>
			<div class="or-line">
				<p class="or__line">
					<span class="or__text">or</span>
				</p>
			</div>

			<form method="POST" class="flow" action="?/loginUser">
				<Textfield name="email" fieldType="email" label="Email" />

				<Textfield
					name="password"
					label="Password"
					fieldType="password"
					autocomplete="current-password"
				/>

				<div class="actions">
					<a class="action-item" href="/password-reset">Forgot your password?</a>

					<Button type="submit">Login</Button>
				</div>
			</form>
		</div>
	</Panel>
</main>

<style>
	.or-line {
		display: block;
		margin-bottom: 1.875rem;
	}
	.or__line {
		display: block;
		text-align: center;
		line-height: 0;
		border-bottom: 1px solid #a7b0b7;
		padding-top: 0.625rem;
	}
	.or__text {
		display: inline;
		padding: 0 0.625rem;
		font-weight: 700;
		background: #fff;
		color: #666e7e;
		text-transform: uppercase;
		font-size: 0.625rem;
		line-height: 0;
	}
	.action-item {
		text-decoration: underline;
		color: var(--color-gray-600);
	}

	.action-item:hover {
		color: var(--color-gray-800);
	}

	.actions {
		display: flex;
		gap: 12px;
		align-items: center;
		justify-content: flex-end;
	}

	.alert-content a {
		color: var(--color-light);
	}
	.center {
		text-align: center;
	}
</style>
