<script lang="ts">
    import { onMount } from 'svelte';
    import type { Product } from '$lib/data';
    import { fade, fly } from 'svelte/transition';

    let { products } = $props<{ products: Product[] }>();
    
    let activeSlide = $state(0);
    const slides = $derived(products.length);

    const bannerBgs = ['bg-mint border-banner-border-mint', 'bg-banana border-banner-border-banana', 'bg-peach border-banner-border-peach'];
    const bannerTexts = ['text-banner-text-mint', 'text-banner-text-banana', 'text-banner-text-peach'];

    onMount(() => {
        const interval = setInterval(() => {
            activeSlide = (activeSlide + 1) % slides;
        }, 4000);
        return () => clearInterval(interval);
    });
</script>

{#if products.length > 0}
<div class="mb-12 relative overflow-hidden rounded-[20px] shadow-soft bg-card border border-border-light">
    <!-- Slides -->
    <div class="relative h-[400px] md:h-[480px]">
        {#each products as hero, index}
            {#if activeSlide === index}
                <div 
                    in:fly={{ x: 50, duration: 500 }} 
                    out:fly={{ x: -50, duration: 500 }}
                    class="absolute inset-0 {bannerBgs[index % 3]} border-b md:border-b-0 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between"
                >
                    <div class="relative z-10 md:w-1/2 space-y-6">
                        <div class="inline-block px-3 py-1 bg-card/80 {bannerTexts[index % 3]} shadow-sm backdrop-blur-sm text-xs font-bold tracking-wider rounded-full uppercase">Koleksi Baru</div>
                        <h1 class="text-3xl md:text-5xl font-heading font-bold {bannerTexts[index % 3]} leading-[1.2] tracking-tight">{hero.name}</h1>
                        <p class="{bannerTexts[index % 3]} opacity-80 text-lg md:text-xl font-body font-normal leading-[1.7] max-w-md line-clamp-2">{hero.description}</p>
                        <div class="pt-4">
                            <a href="/products/{hero.id}" class="inline-flex items-center justify-center bg-main text-warm-bg px-6 py-3 rounded-full font-body font-semibold hover:opacity-80 transition-opacity duration-200 group">
                                Lihat Detail
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Organic Hero Element -->
                    <div class="mt-8 md:mt-0 relative w-full md:w-1/2 h-full flex justify-end items-center">
                        <div class="w-72 h-72 bg-card/40 rounded-full blur-3xl absolute top-1/2 right-4 -translate-y-1/2"></div>
                        <img src={hero.image} alt={hero.name} class="relative z-10 w-80 h-56 object-cover rounded-[20px] shadow-soft -rotate-2 hover:rotate-0 transition-transform duration-500">
                    </div>
                </div>
            {/if}
        {/each}
    </div>

    <!-- Slider Controls -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {#each Array(slides) as _, i}
            <button onclick={() => activeSlide = i} 
                    aria-label={`Slide ${i + 1}`}
                    class="w-2.5 h-2.5 rounded-full transition-all duration-300 {activeSlide === i ? 'bg-main w-6' : 'bg-main/30'}"></button>
        {/each}
    </div>
</div>
{/if}
