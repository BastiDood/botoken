<script>
    import './app.css';
    import { AppShell, Toast, initializeStores } from '@skeletonlabs/skeleton';
    import SideBar from './SideBar.svelte';
    import { init } from '$lib/provider';
    import logo from '$lib/icons/icons-32.png';

    init();
    initializeStores();
</script>

<svelte:head>
    <link rel="icon" href={logo} />
</svelte:head>

<Toast />
<AppShell>
    <SideBar slot="sidebarLeft" />
    <div class="p-4">
        <slot />
    </div>
</AppShell>
