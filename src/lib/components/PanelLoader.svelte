<script lang="ts" generics="T">
	import { Loader2 } from 'lucide-svelte';
	import Panel from './Panel.svelte';

	export let promise: PromiseLike<T>;
	export let title: string;
</script>

<Panel {title}>
	{#await promise}
		<Loader2 class="rotate" />
	{:then value}
		<slot {value} />
	{/await}
</Panel>
