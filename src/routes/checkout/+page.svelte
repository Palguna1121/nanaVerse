<script lang="ts">
    import { cartItems, cartCount, cartTotal, updateQuantity, clearCart } from '$lib/stores/cart';
    import { fly, fade } from 'svelte/transition';

    let showClearModal = $state(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace('Rp', 'Rp');
    };

    function handleClearCart() {
        clearCart();
        showClearModal = false;
    }
</script>

<div class="w-full">
    <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl md:text-4xl font-heading font-bold text-main tracking-tight leading-[1.2]">Checkout</h1>
        {#if $cartCount > 0}
        <button onclick={() => showClearModal = true} class="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200" title="Kosongkan Keranjang">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
        {/if}
    </div>

    <!-- Clear Cart Modal -->
    {#if showClearModal}
    <div class="fixed inset-0 z-100 flex items-center justify-center">
        <div 
             role="button"
             tabindex="-1"
             transition:fade={{ duration: 200 }}
             class="fixed inset-0 bg-main/40 backdrop-blur-sm" 
             onclick={() => showClearModal = false}
             onkeydown={(e) => e.key === 'Escape' && (showClearModal = false)}></div>

        <div 
             transition:fly={{ y: 20, duration: 300 }}
             class="relative bg-card rounded-[24px] shadow-2xl p-8 max-w-sm w-full mx-4 z-10 border border-border-light">
             
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <svg class="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 class="text-xl font-heading font-bold text-center text-main mb-2">Kosongkan Keranjang?</h3>
            <p class="text-sm font-body text-muted text-center mb-8">Semua item yang ada di keranjang Anda akan dihapus secara permanen. Anda yakin?</p>
            
            <div class="flex gap-4">
                <button onclick={() => showClearModal = false} type="button" class="flex-1 px-4 py-3 bg-card-elevated text-main font-semibold rounded-full hover:bg-border-light transition-colors">Batal</button>
                <button onclick={handleClearCart} class="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors">Ya, Hapus</button>
            </div>
        </div>
    </div>
    {/if}

    {#if $cartItems.length > 0}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
            <div class="bg-card shadow-soft rounded-[20px] overflow-hidden border border-border-light">
                <ul class="divide-y divide-border-light">
                    {#each $cartItems as item (item.id)}
                    <li class="p-6 flex items-center group">
                        <div class="h-24 w-24 shrink-0 overflow-hidden rounded-[12px] bg-card-elevated border border-border-light">
                            <img src={item.image} alt={item.name} class="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105">
                        </div>
                        <div class="ml-6 flex flex-1 flex-col">
                            <div>
                                <div class="flex justify-between text-base font-heading font-semibold text-main leading-[1.2]">
                                    <h3>{item.name}</h3>
                                    <p class="ml-4 font-body font-bold text-brand">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                                <p class="mt-1 text-sm text-muted font-body font-normal leading-[1.7]">Harga per unit: {formatPrice(item.price)}</p>
                            </div>
                            <div class="flex flex-1 items-end justify-between text-sm mt-4">
                                <div class="flex items-center border border-border-light rounded-full p-1 bg-card-elevated/50">
                                    <button onclick={() => updateQuantity(item.id, 'decrease')} class="w-7 h-7 flex items-center justify-center rounded-full bg-card text-main shadow-sm border border-border-light hover:bg-card-elevated transition-colors" title="Kurangi kuantitas">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                                    </button>
                                    <span class="font-body font-bold text-main text-sm w-8 text-center">{item.quantity}</span>
                                    <button onclick={() => updateQuantity(item.id, 'increase')} class="w-7 h-7 flex items-center justify-center rounded-full bg-brand text-white shadow-sm hover:bg-brand-hover transition-colors" title="Tambah kuantitas">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                    {/each}
                </ul>
            </div>
        </div>

        <!-- Summary & Payment Card -->
        <div class="lg:col-span-1">
            <div class="bg-card shadow-soft border border-border-light rounded-[24px] p-6 sticky top-28">
                <h2 class="text-lg font-heading font-bold text-main mb-5 tracking-tight leading-[1.2]">Ringkasan Belanja</h2>
                <div class="space-y-3 font-body font-normal">
                    <div class="flex justify-between text-sm text-muted">
                        <p>Subtotal ({$cartCount} Barang)</p>
                        <p class="font-semibold text-main">{formatPrice($cartTotal)}</p>
                    </div>
                    <div class="flex justify-between text-sm text-muted">
                        <p>Biaya Admin</p>
                        <p class="font-semibold text-green-600">Gratis</p>
                    </div>
                    <div class="border-t border-border-light pt-5 mt-5 flex justify-between items-center">
                        <p class="text-base font-heading font-bold text-main">Total Tagihan</p>
                        <p class="text-xl font-body font-bold text-brand">{formatPrice($cartTotal)}</p>
                    </div>
                </div>

                <div class="mt-6">
                    <div class="bg-nav-active rounded-[12px] p-3 mb-5 border border-brand/10">
                        <h3 class="text-[13px] font-body font-bold text-brand mb-1 flex items-center leading-[1.2]">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                            </svg>
                            Mode Sandbox
                        </h3>
                        <p class="text-[11px] text-brand/80 font-body font-normal leading-[1.6]">Anda akan diarahkan ke simulator pembayaran Xepeng yang aman.</p>
                    </div>
                    
                    <button id="pay-button" class="w-full flex items-center justify-center bg-brand rounded-full py-3 px-4 text-[13px] font-body font-bold text-white hover:bg-brand-hover focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-brand/30 hover:-translate-y-px">
                        Lanjut ke Pembayaran
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                    </button>
                    
                    <p class="mt-4 text-center text-[11px] text-muted font-body font-normal flex items-center justify-center gap-1.5 leading-[1.7]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Pembayaran dienkripsi end-to-end
                    </p>
                </div>
            </div>
        </div>
    </div>
    {:else}
    <div class="bg-card border border-border-light shadow-soft rounded-[32px] p-20 text-center max-w-3xl mx-auto mt-6 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        <!-- Decorative Background -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-mint/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-nav-active/60 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div class="relative z-10">
            <div class="w-32 h-32 bg-card-elevated rounded-full flex items-center justify-center mx-auto mb-8 text-border-light border-4 border-card shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
            <h2 class="text-3xl font-heading font-bold text-main mb-4 tracking-tight leading-[1.2]">Keranjang Anda Kosong</h2>
            <p class="text-lg text-muted font-body font-normal mb-10 max-w-md mx-auto leading-[1.7]">Mulai jelajahi koleksi premium kami. Temukan barang favorit Anda dan nikmati pengalaman berbelanja terbaik.</p>
            <a href="/" class="inline-flex items-center justify-center rounded-full bg-brand px-10 py-4 text-base font-body font-semibold text-white hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5 transition-all duration-300">
                Mulai Belanja Sekarang
            </a>
        </div>
    </div>
    {/if}
</div>
