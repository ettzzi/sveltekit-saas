<script lang="ts">
	import { enhance } from '$app/forms';
	import type { User } from 'lucia';
	import Logo from './Logo.svelte';
	import { clickoutside } from '$lib/actions/clickOutside';
	import Button from './Button.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	export let user: User | null = null;
	let dropdownMenu = false;
</script>

<nav class="navbar bg-base-100">
	<div class="container">
		<a href="/">
			<span class="sr-only">{PUBLIC_APP_NAME}</span>
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
