<script>
    import { AppRail, AppRailAnchor, LightSwitch } from '@skeletonlabs/skeleton';
    import { ClipboardDocumentList, Home, ShieldExclamation } from '@steeze-ui/heroicons';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { page } from '$app/stores';
    $: ({ pathname } = $page.url);
</script>

<AppRail width="w-20">
    <div slot="lead" class="my-4 flex items-center justify-center">
        <LightSwitch />
    </div>
    <AppRailAnchor href="/" selected={pathname === '/'}>
        <Icon src={Home} slot="lead" class="size-8" />
        <span>Home</span>
    </AppRailAnchor>
    <AppRailAnchor href="/polls/" selected={pathname === '/polls/'}>
        <Icon src={ClipboardDocumentList} slot="lead" class="size-8" />
        <span>Polls</span>
    </AppRailAnchor>
    <AppRailAnchor href="/admin/" selected={pathname === '/admin/'}>
        <Icon src={ShieldExclamation} slot="lead" class="size-8" />
        <span>Admin</span>
    </AppRailAnchor>
</AppRail>
