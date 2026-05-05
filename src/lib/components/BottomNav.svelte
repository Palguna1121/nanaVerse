<script lang="ts">
    import { page } from '$app/stores';
    import { cartCount } from '$lib/stores/cart';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    const menu = [
        { id: 'home', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', label: 'Home', path: '/' },
        { id: 'search', icon: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35', label: 'Search', path: '/search' },
        { id: 'cart', icon: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z M3 6h18 M16 10a4 4 0 0 1-8 0', label: 'Cart', path: '/checkout' },
        { id: 'profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Profile', path: '/settings' }
    ];

    let activePath = $derived($page.url.pathname);
    let isVisible = $state(true);
    let scrollTimeout: any;
    let isNavHidden = $derived(activePath.startsWith('/products/'));

    onMount(() => {
        if (!browser) return;

        const handleScroll = () => {
            isVisible = false;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isVisible = true;
            }, 800); // Muncul lagi setelah 800ms idle
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

{#if !isNavHidden}
<div 
    class="lg:hidden fixed bottom-0 left-0 right-0 z-[60] transition-all duration-500 transform {isVisible ? 'translate-y-0' : 'translate-y-full'}"
>
    <div class="bg-card/80 backdrop-blur-xl rounded-t-[28px] px-8 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-border-light transition-colors duration-300">
        {#each menu as item}
            <a 
                href={item.path} 
                id={item.id === 'cart' ? 'cart-icon' : undefined}
                class="relative flex flex-col items-center justify-center gap-1 group"
            >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 {activePath === item.path ? 'bg-main text-white dark:text-card shadow-lg shadow-main/20' : 'text-caption hover:text-main'}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        {#if item.id === 'home'}
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        {:else if item.id === 'search'}
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        {:else if item.id === 'cart'}
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                            <path d="M3 6h18"></path>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        {:else if item.id === 'profile'}
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        {/if}
                    </svg>
                </div>
                
                {#if item.id === 'cart' && $cartCount > 0}
                    <span class="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                        {$cartCount}
                    </span>
                {/if}
            </a>
        {/each}
    </div>
</div>
{/if}
