<script lang="ts">
    // eslint-disable-next-line init-declarations
    export let title: string;
    // eslint-disable-next-line init-declarations
    export let pot: bigint;
    // eslint-disable-next-line init-declarations
    export let balance: bigint;
</script>

<section class="prose dark:prose-invert">
    <h1>{title}</h1>
    <p>This poll currently has <strong>{pot} BTK</strong> in the pot.</p>
    {#if balance > 0}
        The consensus is <strong>yes ({balance})</strong>.
    {:else if balance < 0}
        The consensus is <strong>no ({balance})</strong>.
    {:else}
        There is no consensus.
    {/if}
</section>
