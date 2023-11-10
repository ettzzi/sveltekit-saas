<script>
	import Panel from '$lib/components/Panel.svelte';
	import { page } from '$app/stores';
	export let data;
</script>

<main class="with-sidebar">
	{#if data.teams !== null && data.teams.length > 0}
		<Panel>
			<ul class="flow">
				{#each data.teams as team}
					<li>
						<a
							href={`/${team.team.slug}`}
							class:active={$page.url.pathname.includes(team.team.slug)}>{team.team.name}</a
						>
					</li>
				{/each}
			</ul>
		</Panel>
	{/if}
	<div>
		<slot />
	</div>
</main>

<style>
	ul {
		list-style-type: none;
		padding: 0;
	}
	a {
		color: var(--color-gray-400);
		text-decoration: none;
		padding: var(--s-xs) var(--s-md);
		border-radius: var(--border-radius-4);
		transition: all 0.2s ease-in;
		width: 100%;
		display: block;
		text-align: center;
	}
	a:hover {
		color: var(--color-light);
		background-color: var(--color-blue-300);
	}

	a.active {
		color: var(--color-light);
		background-color: var(--color-blue-500);
	}
	main {
		padding: var(--s-4xl) var(--s-xl);
	}

	.with-sidebar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-md);
	}

	.with-sidebar > :first-child {
		flex-basis: 200px;
		flex-grow: 1;
	}

	.with-sidebar > :last-child {
		flex-basis: 0;
		flex-grow: 999;
		min-inline-size: 50%;
	}
</style>
