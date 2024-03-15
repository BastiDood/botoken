<script lang="ts">
    import type { TypedContractEvent, TypedEventLog } from '../../../../hardhat/typechain-types/common';
    import type { CloseEvent } from '../../../../hardhat/typechain-types/contracts/Botoken';

    type Event = TypedContractEvent<CloseEvent.InputTuple, CloseEvent.OutputTuple, CloseEvent.OutputObject>;
    type Log = TypedEventLog<Event>;

    // eslint-disable-next-line init-declarations
    export let events: Log[];
</script>

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
