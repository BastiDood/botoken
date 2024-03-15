<script lang="ts">
    import type { Botoken } from '../../../../hardhat/typechain-types';
    import Error from '$lib/alerts/Error.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import Warning from '$lib/alerts/Warning.svelte';
    // eslint-disable-next-line init-declarations
    export let user: Botoken;
</script>

{#await user.finals()}
    <ProgressBar />
{:then events}
    <h2 class="h2">Recently Finalized Polls</h2>
    {#if events.length === 0}
        <Warning>There are no new polls at the moment.</Warning>
    {:else}
        <div class="card p-2">
            <dl class="list-dl">
                {#each events as { _title, _pot, _consensus }, i (i)}
                    <div>
                        {#if _consensus > 0}
                            <span class="badge bg-primary-500">+{_consensus}</span>
                        {:else if _consensus < 0}
                            <span class="badge bg-error-500">{_consensus}</span>
                        {:else}
                            <span class="badge bg-warning-500">0</span>
                        {/if}
                        <span class="flex-auto">
                            <dt class="font-bold">{_title}</dt>
                            <dd class="text-sm opacity-50">The total pot is <strong>{_pot} BTK</strong>.</dd>
                        </span>
                    </div>
                {/each}
            </dl>
        </div>
    {/if}
{:catch err}
    <Error>{err}</Error>
{/await}
