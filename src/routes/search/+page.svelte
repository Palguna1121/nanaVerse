<script lang="ts">
    import { products } from '$lib/data';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { fade, fly } from 'svelte/transition';
    import MobileProductCard from '$lib/components/MobileProductCard.svelte';
    import ProductCard from '$lib/components/ProductCard.svelte';

    let searchQuery = $state('');
    
    // Get query from URL on mount
    $effect(() => {
        if (browser) {
            const q = $page.url.searchParams.get('q') || '';
            searchQuery = q;
        }
    });

    let displayedProducts = $derived(
        searchQuery.trim() === '' 
            ? [] 
            : products.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            )
    );
</script>

<svelte:head>
    <title>Search - nanaVerse</title>
</svelte:head>

<div class="min-h-screen pb-32">
    <!-- Mobile Search Header -->
    <div class="lg:hidden px-6 pt-6 mb-8">
        <div class="flex items-center gap-4 mb-6">
            <button aria-label="Go Back" onclick={() => history.back()} class="w-10 h-10 rounded-full bg-card shadow-soft border border-border-light flex items-center justify-center text-main">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h1 class="text-lg font-heading font-bold text-main">Search Products</h1>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-6">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-caption"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
                type="text" 
                bind:value={searchQuery}
                placeholder="Search products..." 
                class="w-full bg-card-elevated border-border-light border py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            />
        </div>
    </div>

    <!-- Desktop Search Header -->
    <div class="hidden lg:block max-w-7xl mx-auto px-6 pt-10 mb-12">
        <h1 class="text-4xl font-heading font-bold text-main mb-4 tracking-tight">Search Results</h1>
        <p class="text-muted font-body">
            {#if searchQuery}
                Showing results for "<span class="text-main font-semibold">{searchQuery}</span>"
            {:else}
                Enter a keyword to start searching
            {/if}
        </p>
    </div>

    <div class="max-w-7xl mx-auto px-6">
        {#if displayedProducts.length > 0}
            <!-- Mobile Grid -->
            <div class="lg:hidden grid grid-cols-2 gap-4">
                {#each displayedProducts as product (product.id)}
                    <div in:fade={{ duration: 300 }}>
                        <MobileProductCard {product} />
                    </div>
                {/each}
            </div>

            <!-- Desktop Grid -->
            <div class="hidden lg:grid grid-cols-4 gap-8">
                {#each displayedProducts as product (product.id)}
                    <div in:fade={{ duration: 300 }}>
                        <ProductCard {product} />
                    </div>
                {/each}
            </div>
        {:else if searchQuery.trim() !== ''}
            <div class="flex flex-col items-center justify-center py-20 text-center" in:fly={{ y: 20 }}>
                <div class="w-20 h-20 bg-card-elevated rounded-full flex items-center justify-center mb-6 text-caption">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </div>
                <h2 class="text-xl font-heading font-bold text-main mb-2">No products found</h2>
                <p class="text-sm text-caption">We couldn't find anything matching your search.</p>
            </div>
        {:else}
            <!-- Empty state / Initial state -->
            <div class="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                <p class="text-lg font-heading font-medium">Search for premium tech and fashion</p>
            </div>
        {/if}
    </div>
</div>
