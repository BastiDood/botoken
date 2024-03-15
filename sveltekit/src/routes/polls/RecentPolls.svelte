<script lang="ts">
    import type { Botoken } from '../../../../hardhat/typechain-types';
    import { ProgressBar } from '@skeletonlabs/skeleton';

    import Error from '$lib/alerts/Error.svelte';
    import Warning from '$lib/alerts/Warning.svelte';

    // eslint-disable-next-line init-declarations
    export let block: number;
    // eslint-disable-next-line init-declarations
    export let user: Botoken;
    // eslint-disable-next-line new-cap
    $: creationFilter = user.filters.Creation();
</script>

{#await user.queryFilter(creationFilter, block - 1024, block)}
    <ProgressBar />
{:then events}
    <h2 class="h2">Recently Concluded Polls</h2>
    {#if events.length === 0}
        <Warning>There are no new polls at the moment.</Warning>
    {:else}
        <nav class="list-nav">
            <ul>
                {#each events as { args: [address, title] }}
                    <li><a href="/polls/#{address}">{title}</a></li>
                {/each}
            </ul>
        </nav>
    {/if}
{:catch err}
    <Error>{err}</Error>
{/await}
