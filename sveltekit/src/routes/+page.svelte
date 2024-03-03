<script lang="ts">
    import { array, string, parse } from 'valibot';
    import { BrowserProvider } from 'ethers';
    import { getToastStore } from '@skeletonlabs/skeleton';

    const toast = getToastStore();
    const provider = typeof ethereum === 'undefined' ? null : new BrowserProvider(ethereum);

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
        } finally {
            button.disabled = false;
        }
    }
</script>

<button type="button" class="btn variant-filled-primary" on:click={({ currentTarget }) => connect(currentTarget)}
    >Connect Wallet</button
>
