<script>
    import './app.css';
    import { AppShell, Toast, initializeStores } from '@skeletonlabs/skeleton';
    import SideBar from './SideBar.svelte';
    import { init } from '$lib/provider';
    init();
    initializeStores();
</script>

<Toast />
<AppShell>
    <SideBar slot="sidebarLeft" />
    <div class="p-4">
        <slot />
    </div>
</AppShell>
