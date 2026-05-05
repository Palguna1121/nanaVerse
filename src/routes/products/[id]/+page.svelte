<script lang="ts">
    import { page } from '$app/stores';
    import { products } from '$lib/data';
    import { addToCart } from '$lib/stores/cart';

    const id = parseInt($page.params.id || '0');
    const product = products.find(p => p.id === id);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace('Rp', 'Rp');
    };

    function handleAddToCart(e: MouseEvent) {
        if (product) {
            addToCart(product);
            // Bubbles up to layout
            const customEvent = new CustomEvent('add', {
                detail: { product, x: e.clientX, y: e.clientY },
                bubbles: true,
                composed: true
            });
            (e.currentTarget as HTMLElement).dispatchEvent(customEvent);
        }
    }
</script>

{#if product}
<div class="w-full">
    <!-- Breadcrumb -->
    <nav class="flex mb-8 text-sm font-body font-normal text-muted" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
                <a href="/" class="hover:text-main transition-colors">Produk</a>
            </li>
            <li>
                <div class="flex items-center">
                    <svg class="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                    <span class="ml-1 text-main font-semibold md:ml-2">{product.name}</span>
                </div>
            </li>
        </ol>
    </nav>

    <div class="bg-card rounded-[24px] shadow-soft overflow-hidden border border-border-light">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <!-- Product Image -->
            <div class="relative bg-card-elevated h-[400px] md:h-auto overflow-hidden group">
                <img src={product.image} alt={product.name} class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105">
            </div>

            <!-- Product Details -->
            <div class="p-8 md:p-12 flex flex-col justify-center">
                <h1 class="text-3xl md:text-4xl font-heading font-bold text-main leading-[1.2] tracking-tight mb-4">
                    {product.name}
                </h1>
                
                <p class="text-2xl font-body font-bold text-brand mb-6">
                    {formatPrice(product.price)}
                </p>

                <div class="prose prose-sm font-body font-normal text-muted leading-[1.7] mb-8">
                    <p>{product.description}</p>
                    <p class="mt-4">Nikmati kemudahan berbelanja dengan produk premium. Produk ini didesain khusus untuk memenuhi standar minimalis organik yang mengedepankan fungsi serta estetika elegan dalam keseharian Anda.</p>
                </div>

                <div class="mt-auto pt-8 border-t border-border-light">
                    <div class="flex gap-4 items-center">
                        <div class="shrink-0 flex items-center border border-border-light rounded-full px-4 py-2 h-12">
                            <span class="text-muted font-body font-normal mr-3">Qty</span>
                            <span class="font-body font-semibold text-main">1</span>
                        </div>

                        <button 
                            onclick={handleAddToCart}
                            class="flex-1 flex items-center justify-center h-12 rounded-full bg-brand text-white font-body font-semibold text-base hover:bg-brand-hover transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{:else}
    <div class="text-center py-20">
        <h2 class="text-2xl font-bold">Produk tidak ditemukan</h2>
        <a href="/" class="text-brand mt-4 inline-block">Kembali ke Beranda</a>
    </div>
{/if}
