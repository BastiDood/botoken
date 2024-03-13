<script lang="ts">
    import { type Botoken, Botoken__factory } from '../../../hardhat/typechain-types'; // HACK
    import { array, parse, string } from 'valibot';
    import { BrowserProvider, JsonRpcSigner } from 'ethers';
    import CreatePoll from './CreatePoll.svelte';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Wallet } from '@steeze-ui/heroicons';
    import { getToastStore } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line no-undef
    const provider = typeof ethereum === 'undefined' ? null : new BrowserProvider(ethereum);
    const toast = getToastStore();

    let contract = null as Botoken | null;
    async function connect(button: HTMLButtonElement) {
        if (provider === null) {
            toast.trigger({
                message: 'No wallet detected.',
                background: 'variant-filled-error',
                autohide: false,
            });
            return;
        }
        button.disabled = true;
        try {
            const { address } = await provider.getSigner();
            contract = Botoken__factory.connect(address, provider);
        } catch (err) {
            if (err instanceof Error)
                toast.trigger({
                    message: `[${err.name}]: ${err.message}`,
                    background: 'variant-filled-error',
                    autohide: false,
                });
            throw err;
        } finally {
            button.disabled = false;
        }
    }
</script>

{#if contract === null}
    <button type="button" class="btn variant-filled w-full" on:click={({ currentTarget }) => connect(currentTarget)}>
        <Icon src={Wallet} theme="mini" class="size-6" />
        <span>Connect Wallet</span>
    </button>
{:else}
    <CreatePoll {contract} on:click={() => (contract = null)} />
{/if}
