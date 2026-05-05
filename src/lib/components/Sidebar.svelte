<script lang="ts">
    import { page } from '$app/stores';
    import { browser } from '$app/environment';

    let isSettingsPage = $derived(browser ? $page.url.pathname.startsWith('/settings') : false);
    let activeCategory = $derived(browser ? $page.url.searchParams.get('category') : null);
    let activeTab = $derived(browser ? ($page.url.searchParams.get('tab') || 'info') : 'info');
</script>

<aside class="w-64 py-10 pr-8 hidden lg:block border-r border-border-light sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
    {#if isSettingsPage}
        <h3 class="text-xs font-heading font-bold text-caption uppercase tracking-wider mb-4">Settings</h3>
        <nav class="space-y-2">
            <a href="/settings?tab=info" class="block px-4 py-3 rounded-[12px] {activeTab === 'info' ? 'bg-nav-active text-nav-text font-semibold' : 'text-muted hover:bg-card-elevated hover:text-main font-normal'} text-sm transition-all duration-200">
                Account Info
            </a>
            <a href="/settings?tab=auth" class="block px-4 py-3 rounded-[12px] {activeTab === 'auth' ? 'bg-nav-active text-nav-text font-semibold' : 'text-muted hover:bg-card-elevated hover:text-main font-normal'} text-sm transition-all duration-200">
                Authentication / SSO
            </a>
            <a href="/settings?tab=payment" class="block px-4 py-3 rounded-[12px] {activeTab === 'payment' ? 'bg-nav-active text-nav-text font-semibold' : 'text-muted hover:bg-card-elevated hover:text-main font-normal'} text-sm transition-all duration-200">
                Payment Settings
            </a>
        </nav>
    {:else}
        <h3 class="text-xs font-heading font-bold text-caption uppercase tracking-wider mb-4">Explore</h3>
        <nav class="space-y-2">
            <a href="/" class="block px-4 py-3 rounded-[12px] {!activeCategory ? 'bg-nav-active text-nav-text font-semibold' : 'text-muted hover:bg-card-elevated hover:text-main font-normal'} text-sm transition-all duration-200">
                All Products
            </a>
            <a href="/?category=tech" class="block px-4 py-3 rounded-[12px] {activeCategory === 'tech' ? 'bg-nav-active text-nav-text font-semibold' : 'text-muted hover:bg-card-elevated hover:text-main font-normal'} text-sm transition-all duration-200">
                Technology
            </a>
            <a href="/?category=fashion" class="block px-4 py-3 rounded-[12px] {activeCategory === 'fashion' ? 'bg-nav-active text-nav-text font-semibold' : 'text-muted hover:bg-card-elevated hover:text-main font-normal'} text-sm transition-all duration-200">
                Fashion Outfit
            </a>
        </nav>
    {/if}
</aside>
