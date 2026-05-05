<script lang="ts">
    import type { Product } from '$lib/data';
    import { addToCart } from '$lib/stores/cart';
    
    let { product } = $props<{ product: Product }>();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace('IDR', 'Rp');
    };

    function handleAddToCart(e: MouseEvent) {
        addToCart(product);
        const customEvent = new CustomEvent('add', {
            detail: { product, x: e.clientX, y: e.clientY },
            bubbles: true,
            composed: true
        });
        (e.currentTarget as HTMLElement).dispatchEvent(customEvent);
    }
</script>

<div class="group relative flex flex-col bg-transparent">
    <div class="relative aspect-square rounded-[24px] overflow-hidden bg-card-elevated border border-border-light shadow-soft mb-3">
        <a href="/products/{product.id}" class="block w-full h-full">
            <img src={product.image} alt={product.name} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </a>
        
        <button 
            onclick={handleAddToCart}
            class="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-main text-white dark:text-card flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
    </div>
    
    <a href="/products/{product.id}" class="space-y-1">
        <h3 class="text-sm font-bold text-main line-clamp-1">{product.name}</h3>
        <p class="text-xs text-caption font-bold">{formatPrice(product.price)}</p>
    </a>
</div>
