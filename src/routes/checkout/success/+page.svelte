<script lang="ts">
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { clearCart } from '$lib/stores/cart';

    let orderNumber = $state('');
    let transactionDate = $state('');

    onMount(() => {
        clearCart();
        orderNumber = `NV-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date();
        transactionDate = now.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    });
</script>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-linear-to-b from-transparent to-warm-bg/30">
    <div 
        in:fly={{ y: 30, duration: 600 }}
        class="bg-card max-w-xl w-full rounded-[40px] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border-light text-center relative overflow-hidden"
    >
        <!-- Premium Glow Effects -->
        <div class="absolute -top-20 -right-20 w-60 h-60 bg-green-500/15 rounded-full blur-[80px]"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-brand/15 rounded-full blur-[80px]"></div>

        <!-- Success Icon with rich animation -->
        <div class="w-24 h-24 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 relative rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>

        <h1 class="text-3xl md:text-4xl font-heading font-bold text-main mb-3 tracking-tight leading-tight">Payment Successful!</h1>
        <p class="text-muted font-body text-base md:text-lg mb-10 max-w-md mx-auto">
            Thank you! Your order has been received and we will process it for shipping immediately.
        </p>

        <!-- Transaction Details - Premium Design -->
        <div class="bg-card-elevated rounded-[24px] p-6 md:p-8 border border-border-light mb-10 text-left relative z-10">
            <h3 class="text-sm font-heading font-bold text-main uppercase tracking-wider mb-4 pb-2 border-b border-border-light/50">Transaction Details</h3>
            
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <span class="text-caption text-sm font-body">Order Number</span>
                    <span class="font-semibold text-main font-body text-base">{orderNumber}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-caption text-sm font-body">Transaction Time</span>
                    <span class="text-main font-medium font-body text-sm">{transactionDate}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-caption text-sm font-body">Payment Method</span>
                    <span class="flex items-center gap-2 font-semibold text-main font-body text-sm">
                        <span class="w-2 h-2 rounded-full bg-green-500"></span>
                        Xepeng
                    </span>
                </div>
                <div class="flex justify-between items-center pt-3 border-t border-border-light/50">
                    <span class="text-main font-bold text-base font-heading">Status</span>
                    <span class="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Paid</span>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="relative z-10">
            <a 
                href="/" 
                class="block w-full py-4 rounded-full bg-brand text-white font-heading font-semibold text-center text-base shadow-soft hover:bg-brand-hover hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
                Back to Shopping
            </a>
        </div>
    </div>
</div>
