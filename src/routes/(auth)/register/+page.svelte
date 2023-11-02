<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import Button from '$lib/components/Button.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<Panel title="Register">
	{#if form?.errors}
		<Alert>
			{#each Object.values(form.errors) as error}
				<p>{error}</p>
			{/each}
		</Alert>
	{/if}

	<form method="POST" use:enhance class="flow">
		<Textfield name="name" label="Name" />

		<Textfield required name="email" label="Email" autocomplete="email" />

		<Textfield required name="password" label="Password" fieldType="password" />

		<Textfield
			required
			name="password_confirmation"
			label="Confirm password"
			fieldType="password"
		/>

		<div class="actions">
			<a class="action-item" href="/login">Already registered? </a>

			<Button type="submit">Register</Button>
		</div>
	</form>
</Panel>

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
</style>
