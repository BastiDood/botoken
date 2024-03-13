<script lang="ts">
    import { type Botoken, Botoken__factory } from '../../../hardhat/typechain-types'; // HACK
    import { array, parse, string } from 'valibot';
    import { BrowserProvider } from 'ethers';
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
            const result = await provider.send('eth_requestAccounts', []);
            const [wallet, ...rest] = parse(array(string()), result);
            if (rest.length > 0) console.warn(`ignored ${rest.length} wallets`);
            if (typeof wallet === 'undefined')
                toast.trigger({
                    message: 'No wallets available.',
                    background: 'variant-filled-error',
                    autohide: false,
                });
            else contract = Botoken__factory.connect(wallet, provider);
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
