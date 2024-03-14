<script lang="ts">
    import { Botoken__factory } from '../../../../hardhat/typechain-types';
    import ErrorAlert from '$lib/alerts/Error.svelte';
    import Mint from './Mint.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import Store from './Store.svelte';
    import Transfer from './Transfer.svelte';
    import env from '$lib/env';
    import { get } from '$lib/provider';

    const provider = get();

    let selfBalance = Symbol();
    let contractBalance = selfBalance;
</script>

{#if provider === null}
    <ErrorAlert>No providers available.</ErrorAlert>
{:else}
    {@const contract = Botoken__factory.connect(env.DEPLOYMENT_ADDRESS, provider)}
    <div class="space-y-4">
        {#key contractBalance}
            {#await contract.balanceOf(env.DEPLOYMENT_ADDRESS)}
                <ProgressBar />
            {:then balance}
                <p>The contract has <strong>{balance} BTK</strong> as residual.</p>
            {:catch err}
                <ErrorAlert>{err}</ErrorAlert>
            {/await}
        {/key}
        {#await provider.getSigner()}
            <ProgressBar />
        {:then signer}
            {@const user = contract.connect(signer)}
            {#key selfBalance}
                {#await user.balanceOf(signer.address)}
                    <ProgressBar />
                {:then balance}
                    <p>Your current balance is <strong>{balance} BTK</strong>.</p>
                {:catch err}
                    <ErrorAlert>{err}</ErrorAlert>
                {/await}
            {/key}
            <hr />
            <Mint {user} on:done={() => (contractBalance = Symbol())} />
            <hr />
            <Store {user} on:done={() => (selfBalance = contractBalance = Symbol())} />
            <hr />
            <Transfer {user} address={signer.address} on:done={() => (selfBalance = Symbol())} />
        {:catch err}
            <ErrorAlert>{err}</ErrorAlert>
        {/await}
    </div>
{/if}
