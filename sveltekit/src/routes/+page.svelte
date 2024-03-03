<script lang="ts">
    import { array, parse, string } from 'valibot';
    import { BrowserProvider } from 'ethers';
    import { Dao__factory } from '$contracts/typechain-types';
    import env from '$lib/env';
    import { getToastStore } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line no-undef
    const provider = typeof ethereum === 'undefined' ? null : new BrowserProvider(ethereum);
    const toast = getToastStore();

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
            const wallets = parse(array(string()), result);
            console.log(wallets);
            const contract = Dao__factory.connect(env.DEPLOYMENT_ADDRESS, provider);
            console.log(await contract.data());
        } finally {
            button.disabled = false;
        }
    }
</script>

<button type="button" class="btn variant-filled-primary" on:click={({ currentTarget }) => connect(currentTarget)}
    >Connect Wallet</button
>
