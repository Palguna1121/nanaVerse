<script lang="ts">
    import { products } from '$lib/data';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import HeroSlider from '$lib/components/HeroSlider.svelte';
    import ProductCard from '$lib/components/ProductCard.svelte';

    let category = $derived(browser ? $page.url.searchParams.get('category') : null);
    let isPromo = $derived(browser ? $page.url.searchParams.has('promo') : false);
    let isNew = $derived(browser ? $page.url.searchParams.has('new') : false);

    let filteredProducts = $derived(
        products.filter(p => {
            if (category && p.category !== category) return false;
            if (isPromo && !p.is_promo) return false;
            if (isNew && !p.is_new) return false;
            return true;
        })
    );

    let heroProducts = $derived(products.filter(p => p.is_new).slice(0, 3));
</script>

{#if !category && !isPromo && !isNew}
    <HeroSlider products={heroProducts} />
{/if}

<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <h2 class="text-2xl font-heading font-bold text-main leading-[1.2] tracking-tight">
            {#if isPromo}
                Produk Promo
            {:else}
                {category === 'tech' ? 'Technology' : category === 'fashion' ? 'Fashion Outfit' : isNew ? 'Koleksi Terbaru' : 'Semua Produk'}
            {/if}
        </h2>
        
        <!-- Filter Tabs -->
        <div class="flex items-center space-x-1 bg-card-elevated rounded-full p-1 border border-border-light w-fit">
            <a href="/" class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 {(!isPromo && !isNew) ? 'bg-card text-main shadow-soft' : 'text-muted hover:text-main'}">Semua</a>
            <a href="/?promo=1" class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 {isPromo ? 'bg-card text-main shadow-soft' : 'text-muted hover:text-main'}">Promo</a>
            <a href="/?new=1" class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 {isNew ? 'bg-card text-main shadow-soft' : 'text-muted hover:text-main'}">Baru</a>
        </div>
    </div>
    <div class="text-sm font-body font-normal text-muted">Menampilkan {filteredProducts.length} item</div>
</div>

<div class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each filteredProducts as product (product.id)}
        <ProductCard {product} />
    {/each}
</div>
