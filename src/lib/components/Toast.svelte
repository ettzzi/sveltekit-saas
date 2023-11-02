<script lang="ts" context="module">
	export type ToastData = {
		type: 'success' | 'error' | 'warning' | 'info';
		title: string;
		description: string;
	};

	const {
		elements: { content, title, description, close },
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>();

	export const createToast = (data: ToastData) => {
		helpers.addToast({
			data
		});
	};
</script>

<script lang="ts">
	import { createToaster, melt } from '@melt-ui/svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
</script>

<div use:portal class="toasts">
	{#each $toasts as { id, data } (id)}
		<div
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class="toast {data.type}"
		>
			<div>
				<h4 use:melt={$title(id)}>
					{data.title}
				</h4>
				<p use:melt={$description(id)}>
					{data.description}
				</p>
			</div>

			<button use:melt={$close(id)} class="close">
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
				>
					<path d="M18 6 6 18" /><path d="m6 6 12 12" />
				</svg>
			</button>
		</div>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		right: 0;
		top: 0;
		z-index: 10;
		margin: var(--s-md);
		display: flex;
		max-width: 300px;
		flex-direction: column;
		gap: var(--s-md);
	}

	.close {
		border: 0;
		color: var(--color-light);
		cursor: pointer;
		background-color: rgba(var(--color-light), 90);
		padding: var(--s-xs);
	}

	.toast {
		display: flex;
		align-items: start;
		gap: var(--s-sm);
		border-radius: var(--border-8);
		padding: var(--s-sm) var(--s-lg);
	}

	.success {
		background-color: var(--color-green-900);
		color: white;
	}

	h4 {
		font-weight: var(--fw-600);
	}
	p {
		font-size: var(--fs-sm);
	}
</style>
