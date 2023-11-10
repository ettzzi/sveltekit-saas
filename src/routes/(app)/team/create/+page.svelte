<script>
	import Button from '$lib/components/Button.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Textfield from '$lib/components/Textfield.svelte';
</script>

<Panel title="Create team">
	<form method="post" class="flow">
		<Textfield label="You team name" name="name"></Textfield>
		<Button type="submit">Create</Button>
	</form>
</Panel>
