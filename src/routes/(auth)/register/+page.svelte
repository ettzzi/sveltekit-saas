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

	<div class="flow">
		<div class="center">
			<Button href="/api/oauth/google" fullWidth kind="outline">Signup with Google</Button>
		</div>
		<div class="or-line">
			<p class="or__line">
				<span class="or__text">or</span>
			</p>
		</div>

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
	</div>
</Panel>

<style>
	.center {
		text-align: center;
	}
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
</style>
