<script lang="ts">
    import type { Product } from '$lib/data';
    import { addToCart } from '$lib/stores/cart';

    let { product } = $props<{ product: Product }>();

    function handleAddToCart(e: MouseEvent) {
        addToCart(product);
        
        const event = new CustomEvent('add', {
            bubbles: true,
            detail: { product, x: e.clientX, y: e.clientY }
        });
        (e.currentTarget as HTMLElement).dispatchEvent(event);
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace('IDR', 'Rp');
    };
</script>

<div class="group relative bg-card rounded-[16px] shadow-soft hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden border border-border-light hover:border-brand/30">
    <a href="/products/{product.id}" class="block w-full aspect-4/3 bg-card-elevated overflow-hidden relative">
        <img src={product.image} alt={product.name} class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105">
        <!-- Flags -->
        <div class="absolute top-3 left-3 flex flex-col gap-2">
            {#if product.is_new}
                <span class="bg-mint text-banner-text-mint text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">New</span>
            {/if}
            {#if product.is_promo}
                <span class="bg-brand text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">Promo</span>
            {/if}
        </div>
    </a>
    <div class="p-5 flex-1 flex flex-col">
        <a href="/products/{product.id}" class="block">
            <h3 class="text-base font-heading font-semibold text-main line-clamp-2 leading-[1.2] mb-2 hover:text-brand transition-colors">
                {product.name}
            </h3>
        </a>
        <p class="text-sm text-muted line-clamp-2 flex-1 font-body font-normal leading-[1.7]">
            {product.description}
        </p>
        <div class="mt-6 flex items-center justify-between">
            <p class="text-lg font-body font-bold text-main tracking-tight">{formatPrice(product.price)}</p>
            <button 
                onclick={handleAddToCart}
                class="flex items-center justify-center w-10 h-10 rounded-full bg-brand text-white hover:bg-brand-hover transition-colors duration-200" 
                title="Add to cart"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
        </div>
    </div>
</div>
