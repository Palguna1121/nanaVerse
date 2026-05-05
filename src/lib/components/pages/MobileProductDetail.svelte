<script lang="ts">
    import type { Product } from '$lib/data';
    import { addToCart, cartCount } from '$lib/stores/cart';
    import { fade, fly } from 'svelte/transition';

    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let { product } = $props<{ product: Product }>();
    
    let activeColor = $state('Brown');
    let isDescriptionExpanded = $state(false);
    let activeImageIndex = $state(0);
    let isVisible = $state(true);
    let scrollTimeout: any;

    onMount(() => {
        if (!browser) return;
        const handleScroll = () => {
            isVisible = false;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isVisible = true;
            }, 800);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    });

    const colors = [
        { name: 'Teal', class: 'bg-[#2D5A5A]' },
        { name: 'White', class: 'bg-[#FFFFFF] border border-border-light' },
        { name: 'Brown', class: 'bg-[#4A3728]' },
        { name: 'Purple', class: 'bg-[#4B3B60]' },
        { name: 'Olive', class: 'bg-[#556B2F]' }
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace('IDR', 'Rp');
    };

    function handleAddToCart(e: MouseEvent) {
        if (product) {
            addToCart(product);
            const customEvent = new CustomEvent('add', {
                detail: { product, x: e.clientX, y: e.clientY },
                bubbles: true,
                composed: true
            });
            (e.currentTarget as HTMLElement).dispatchEvent(customEvent);
        }
    }
</script>

<div class="lg:hidden pb-32">
    <div class="px-6">
        <!-- Top Nav -->
    <div class="flex items-center justify-between mb-6">
        <button aria-label="Go Back" onclick={() => history.back()} class="w-12 h-12 rounded-full bg-card shadow-soft border border-border-light flex items-center justify-center text-main">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 class="font-heading font-bold text-main">Product Details</h2>
        <a href="/checkout" aria-label="Go to Cart" id="cart-icon" class="relative w-12 h-12 rounded-full bg-card shadow-soft border border-border-light flex items-center justify-center text-main">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {#if $cartCount > 0}
                <span class="absolute top-2 right-2 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-card">
                    {$cartCount}
                </span>
            {/if}
        </a>
    </div>

    <!-- Main Image -->
    <div class="relative mb-8 flex flex-col items-center">
        <div class="w-full aspect-square rounded-[40px] overflow-hidden bg-card-elevated border border-border-light shadow-soft relative group">
            <img 
                src={product.image} 
                alt={product.name} 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            <!-- Floating carousel dots -->
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/30">
                {#each [1, 2, 3] as i}
                    <div class="w-1.5 h-1.5 rounded-full {i === 1 ? 'bg-white w-4' : 'bg-white/50'}"></div>
                {/each}
            </div>
        </div>
        
        <!-- Thumbnails -->
        <div class="flex gap-3 mt-6 overflow-x-auto w-full no-scrollbar px-2">
            {#each Array(5) as _, i}
                <button 
                    aria-label="View Image {i + 1}"
                    class="w-16 h-16 rounded-2xl overflow-hidden border-2 {i === activeImageIndex ? 'border-brand' : 'border-border-light'} shrink-0"
                    onclick={() => activeImageIndex = i}
                >
                    <img src={product.image} alt="Thumb" class="w-full h-full object-cover opacity-80" />
                </button>
            {/each}
        </div>
    </div>

    <!-- Product Info -->
    <div class="space-y-6">
        <div class="flex justify-between items-start">
            <div>
                <p class="text-caption text-xs font-bold uppercase tracking-wider mb-2">{product.category}</p>
                <h1 class="text-2xl font-heading font-bold text-main leading-tight tracking-tight">{product.name}</h1>
            </div>
            <div class="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span class="text-sm font-bold">4.5</span>
            </div>
        </div>

        <div class="space-y-3">
            <h3 class="text-base font-heading font-bold text-main">Product Details</h3>
            <p class="text-sm text-muted font-body leading-[1.7]">
                {isDescriptionExpanded ? product.description : product.description.slice(0, 100) + '...'}
                <button 
                    class="text-brand font-bold ml-1 hover:underline"
                    onclick={() => isDescriptionExpanded = !isDescriptionExpanded}
                >
                    {isDescriptionExpanded ? 'Read less' : 'Read more'}
                </button>
            </p>
        </div>

        <!-- Color Selector -->
        <div class="space-y-4">
            <h3 class="text-base font-heading font-bold text-main">Select Color : <span class="text-muted font-normal">{activeColor}</span></h3>
            <div class="flex gap-4">
                {#each colors as color}
                    <button 
                        class="w-10 h-10 rounded-full {color.class} relative flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                        onclick={() => activeColor = color.name}
                        aria-label={color.name}
                    >
                        {#if activeColor === color.name}
                            <div class="w-12 h-12 rounded-full border-2 border-main absolute pointer-events-none"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color.name === 'White' ? 'black' : 'white'} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    </div>
    </div>
</div>

<!-- Bottom Action Bar -->
<div 
    class="lg:hidden fixed bottom-5 left-5 right-5 z-70 transition-all duration-500 transform {isVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}"
>
    <div class="bg-card rounded-[24px] p-3.5 flex items-center justify-between shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-border-light">
        <div class="pl-2">
            <p class="text-[9px] text-caption font-bold uppercase tracking-widest opacity-70">Price</p>
            <p class="font-heading font-bold text-main {product.price >= 1000000 ? 'text-base' : 'text-lg'}">{formatPrice(product.price)}</p>
        </div>
        <button 
            onclick={handleAddToCart}
            class="bg-main text-white dark:text-card px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-main/10 active:scale-95 transition-all duration-200"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Add to Cart
        </button>
    </div>
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
