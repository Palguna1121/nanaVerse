<script lang="ts">
    import { cartItems, cartCount, cartTotal, updateQuantity, clearCart } from '$lib/stores/cart';
    import { fade, fly } from 'svelte/transition';

    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace('IDR', 'Rp');
    };

    let showClearModal = $state(false);
    let isVisible = $state(true);
    let scrollTimeout: any;

    onMount(() => {
        // Scroll hide logic removed as per user request to keep bottom sheet visible
    });
</script>

<div class="lg:hidden pb-48">
    <div class="px-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <a href="/" class="w-10 h-10 rounded-full bg-card shadow-soft border border-border-light flex items-center justify-center text-main">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </a>
            <h1 class="text-lg font-heading font-bold text-main">My Cart</h1>
            <a href="/settings" class="w-10 h-10 rounded-full bg-card shadow-soft border border-border-light flex items-center justify-center text-main">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </a>
        </div>
        
        {#if $cartCount > 0}
            <div class="flex justify-end mb-4">
                <button onclick={() => showClearModal = true} class="text-red-500 font-bold text-xs uppercase tracking-wider">Clear All</button>
            </div>
        {/if}

    {#if $cartItems.length > 0}
        <div class="space-y-4">
            {#each $cartItems as item (item.id)}
                <div class="bg-card border border-border-light rounded-[24px] p-4 flex gap-4 shadow-soft">
                    <div class="w-20 h-20 rounded-2xl overflow-hidden bg-card-elevated flex-shrink-0">
                        <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <h3 class="text-sm font-bold text-main line-clamp-1">{item.name}</h3>
                            <p class="text-xs text-brand font-bold mt-0.5">{formatPrice(item.price)}</p>
                        </div>
                        <div class="flex items-center justify-between mt-2">
                            <div class="flex items-center gap-3 bg-card-elevated rounded-full px-2 py-1 border border-border-light">
                                <button onclick={() => updateQuantity(item.id, 'decrease')} class="w-6 h-6 flex items-center justify-center rounded-full bg-card text-main shadow-sm">-</button>
                                <span class="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onclick={() => updateQuantity(item.id, 'increase')} class="w-6 h-6 flex items-center justify-center rounded-full bg-main text-white dark:text-card shadow-sm">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}

            <!-- Summary Section moved here -->
            <div class="mt-8 space-y-4 pt-6 border-t border-border-light">
                <h3 class="text-sm font-heading font-bold text-main px-1">Order Summary</h3>
                <div class="bg-card border border-border-light rounded-[24px] p-5 space-y-3 shadow-soft">
                    <div class="flex justify-between text-xs font-medium text-muted">
                        <span>Subtotal ({$cartCount} items)</span>
                        <span class="text-main font-bold">{formatPrice($cartTotal)}</span>
                    </div>
                    <div class="flex justify-between text-xs font-medium text-muted">
                        <span>Shipping Fee</span>
                        <span class="text-green-600 font-bold">Free</span>
                    </div>
                    <div class="flex justify-between text-xs font-medium text-muted">
                        <span>Tax (Estimated)</span>
                        <span class="text-main font-bold">{formatPrice(0)}</span>
                    </div>
                    <div class="pt-5 border-t border-border-light flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-bold text-main">Total Payment</span>
                            <span class="text-xl font-bold text-brand">{formatPrice($cartTotal)}</span>
                        </div>
                        <a href="/checkout/success" class="w-full bg-main text-white dark:text-card py-4 rounded-2xl text-sm font-bold shadow-lg shadow-main/10 active:scale-95 transition-all duration-200 flex items-center justify-center">
                            Buy Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-20 h-20 bg-card-elevated rounded-full flex items-center justify-center mb-6 text-caption">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <h2 class="text-xl font-heading font-bold text-main mb-2">Your cart is empty</h2>
            <p class="text-sm text-caption mb-8">Looks like you haven't added anything to your cart yet.</p>
            <a href="/" class="bg-main text-white px-8 py-3 rounded-full font-bold">Start Shopping</a>
        </div>
    {/if}
    </div>
</div>

<!-- Fixed Bottom Bar removed to give space for Bottom Navigation -->

{#if showClearModal}
    <div class="fixed inset-0 z-[100] flex items-center justify-center px-6">
        <div class="absolute inset-0 bg-main/60 backdrop-blur-sm" onclick={() => showClearModal = false}></div>
        <div in:fly={{ y: 20 }} class="relative bg-card rounded-[32px] p-8 w-full max-w-sm text-center border border-border-light shadow-2xl">
            <h3 class="text-xl font-heading font-bold text-main mb-2">Clear Cart?</h3>
            <p class="text-sm text-muted mb-8">Are you sure you want to remove all items from your cart?</p>
            <div class="flex gap-4">
                <button onclick={() => showClearModal = false} class="flex-1 py-3 rounded-full bg-card-elevated font-bold text-main">Cancel</button>
                <button onclick={() => { clearCart(); showClearModal = false; }} class="flex-1 py-3 rounded-full bg-red-500 text-white font-bold">Yes, Clear</button>
            </div>
        </div>
    </div>
{/if}
