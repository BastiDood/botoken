<script lang="ts">
    import { Botoken__factory } from '../../../hardhat/typechain-types';
    import type { BrowserProvider } from 'ethers';
    import CreatePoll from './CreatePoll.svelte';
    import ErrorAlert from '$lib/alerts/Error.svelte';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    // eslint-disable-next-line init-declarations
    export let provider: BrowserProvider;
</script>

{#await provider.getSigner()}
    <ProgressBar />
{:then { address }}
    {@const contract = Botoken__factory.connect(address, provider)}
    <CreatePoll {contract} />
{:catch err}
    <ErrorAlert>{err}</ErrorAlert>
{/await}
