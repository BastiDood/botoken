<script lang="ts">
    // eslint-disable-next-line init-declarations
    export let title: string;
    // eslint-disable-next-line init-declarations
    export let pot: bigint;
    // eslint-disable-next-line init-declarations
    export let consensus: bigint;
</script>

<section class="space-y-4">
    <h1 class="h1">{title}</h1>
    <p>This poll currently has <strong>{pot} BTK</strong> in the pot.</p>
    {#if consensus > 0}
        The consensus is <strong>yes ({consensus})</strong>.
    {:else if consensus < 0}
        The consensus is <strong>no ({consensus})</strong>.
    {:else}
        There is no consensus.
    {/if}
</section>
