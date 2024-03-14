<script lang="ts">
    import type { Botoken } from '../../../../../hardhat/typechain-types';
    import { ProgressBar } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line init-declarations
    export let poll: string;
    // eslint-disable-next-line init-declarations
    export let contract: Botoken;

    async function retrieve(address: string) {
        const [title, pot, balance] = await Promise.all([
            contract.title(address),
            contract.pot(address),
            contract.balance(address),
        ]);
        return { title, pot, balance };
    }
</script>

{#await retrieve(poll)}
    <ProgressBar />
{:then { title, pot, balance }}
    <section class="prose dark:prose-invert">
        <h1 class="h1">{title}</h1>
        <p>This poll currently has {pot} BTK in the pot.</p>
        {#if balance > 0}
            The consensus is <strong>yes</strong>.
        {:else if balance < 0}
            The consensus is <strong>no</strong>.
        {:else}
            There is no consensus.
        {/if}
    </section>
{/await}
