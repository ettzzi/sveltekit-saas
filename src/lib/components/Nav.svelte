<script lang="ts">
	import { enhance } from '$app/forms';
	import type { User } from 'lucia';
	import Logo from './Logo.svelte';
	import { clickoutside } from '$lib/actions/clickOutside';
	import Button from './Button.svelte';

	export let user: User | null = null;
	let dropdownMenu = false;
</script>

<nav>
	<div class="container">
		<a href="/">
			<span class="sr-only">SvelteKit Starter</span>
			<Logo size="small" />
		</a>

		{#if user}
			<div class="dropdown">
				<button
					on:click={() => (dropdownMenu = !dropdownMenu)}
					use:clickoutside={{
						enabled: true,
						callback: (_e) => {
							if (dropdownMenu) {
								dropdownMenu = false;
							}
						}
					}}
					class="dropdown-button"
					type="button"
					aria-expanded={dropdownMenu}
					aria-haspopup="true"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
							x1="4"
							x2="20"
							y1="18"
							y2="18"
						/></svg
					>
				</button>

				<div
					class:hidden={!dropdownMenu}
					class="dropdown-menu"
					role="menu"
					aria-orientation="vertical"
					aria-label="Open menu"
					tabindex="0"
				>
					<a href="/" class="dropdown-item" role="menuitem">Dashboard</a>
					<a href="/profile" class="dropdown-item" role="menuitem">Profile </a>
					<form method="POST" action="/login?/logout" use:enhance>
						<button type="submit" class="dropdown-item" role="menuitem">Sign out</button>
					</form>
				</div>
			</div>
		{:else}
			<div class="actions">
				<Button href="/login" size="small" variant="primary" kind="outline">Sign in</Button>
			</div>
		{/if}
	</div>
</nav>

<style scoped>
	nav {
		background-color: var(--color-light);
		border-bottom: 1px solid var(--color-gray-200);
	}

	.container {
		padding: 0 var(--s-xl);
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 auto;
	}

	.dropdown {
		position: relative;
		display: inline-block;
		align-self: center;
	}

	.dropdown-item {
		display: block;
		padding: var(--s-sm) var(--s-md);
		font-size: var(--fs-s);
		color: var(--color-gray-900);
		background: none;
		border: 0;
		width: 100%;
		text-align: left;
		cursor: pointer;
		text-decoration: none;
	}

	.dropdown-item:hover {
		background-color: var(--color-gray-200);
	}

	.dropdown-menu {
		position: absolute;
		right: 0;
		margin-top: var(--s-sm);
		width: 14rem;
		border-radius: 0.25rem;
		background-color: var(--color-light);
		border: 1px solid var(--color-gray-200);
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.dropdown-button {
		border: 0;
		background: none;
	}
</style>
