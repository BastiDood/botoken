<script lang="ts">
    import type { Botoken } from '../../../../hardhat/typechain-types';
    import CastVote from './CastVote.svelte';
    import DisplayVote from './DisplayPoll.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';

    import ErrorAlert from '$lib/alerts/Error.svelte';
    import WarningAlert from '$lib/alerts/Warning.svelte';

    // eslint-disable-next-line init-declarations
    export let block: number;
    // eslint-disable-next-line init-declarations
    export let poll: string;
    // eslint-disable-next-line init-declarations
    export let user: Botoken;
    $: closeEvents = user.filters.Close(poll);

    async function retrieve(address: string) {
        const [title, pot, balance] = await Promise.all([
            user.title(address),
            user.pot(address),
            user.balance(address),
        ]);
        return { title, pot, balance };
    }
</script>

<div class="space-y-4">
    {#await retrieve(poll)}
        <ProgressBar />
    {:then result}
        <DisplayVote {...result} />
    {:catch err}
        <ErrorAlert>{err}</ErrorAlert>
    {/await}
    <hr />
    <CastVote {poll} {user} />
    <hr />
    {#await user.queryFilter(closeEvents, block - 8, block)}
        <ProgressBar />
    {:then events}
        <section class="prose dark:prose-invert max-w-none">
            <h2 class="h2">Past Poll Results</h2>
            {#if events.length === 0}
                <WarningAlert>There have been no past events.</WarningAlert>
            {:else}
                <div class="card p-2">
                    <dl class="list-dl">
                        {#each events as { args: [_address, title, pot, balance] }}
                            {@const bal = balance > 0 ? `+${balance}` : balance.toString()}
                            <div>
                                {#if balance > 0}
                                    <span class="badge bg-success-500">+{balance}</span>
                                {:else if balance < 0}
                                    <span class="badge bg-error-500">{balance}</span>
                                {:else}
                                    <span class="badge bg-warning-500">0</span>
                                {/if}
                                <span class="flex-auto">
                                    <dt class="font-bold">[{pot} BTK] {title}</dt>
                                    <dd class="text-sm opacity-50">The consensus is {bal}.</dd>
                                </span>
                            </div>
                        {/each}
                    </dl>
                </div>
            {/if}
        </section>
    {:catch err}
        <ErrorAlert>{err}</ErrorAlert>
    {/await}
</div>
