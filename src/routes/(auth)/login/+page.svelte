<script lang="ts">
	import { enhance } from '$app/forms';
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
	</Panel>
</main>

<style>
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
</style>
