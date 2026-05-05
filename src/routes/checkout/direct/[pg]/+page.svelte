<script lang="ts">
    import { page } from '$app/stores';
    import { paymentGateways } from '$lib/stores/payment';
    import { cartTotal } from '$lib/stores/cart';
    import { fade, fly } from 'svelte/transition';
    import { onMount } from 'svelte';

    const pgId = $page.params.pg;
    const pg = $derived($paymentGateways.find(g => g.id === pgId));

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace('IDR', 'Rp');
    };

    let step = $state(1); // 1: Select Method, 2: Payment Details, 3: Processing, 4: Success
    
    const paymentMethods = [
        { id: 'qris', name: 'QRIS', type: 'qr', payMethod: 'qris', payChannel: 'qris', icon: 'M12 2H2v10h10V2zM10 10H4V4h6v6zM22 2h-10v10h10V2zM20 10h-6V4h6v6zM12 12H2v10h10v-10zM10 20H4v-6h6v6zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z' },
        { id: 'va_bca', name: 'BCA Virtual Account', type: 'va', payMethod: 'va', payChannel: 'bca', icon: 'M4 4h16v16H4V4z M4 8h16 M8 20V8 M16 20V8' },
        { id: 'va_mandiri', name: 'Mandiri Virtual Account', type: 'va', payMethod: 'va', payChannel: 'mandiri', icon: 'M4 4h16v16H4V4z M4 8h16 M8 20V8 M16 20V8' },
        { id: 'retail', name: 'Alfamart', type: 'retail', payMethod: 'cstore', payChannel: 'alfamart', icon: 'M3 3h18v18H3z M3 9h18 M9 21V9' }
    ];

    let selectedMethod = $state<any>(null);
    let paymentData = $state<any>(null);
    let isProcessing = $state(false);

    import { cartItems } from '$lib/stores/cart';

    async function selectMethod(method: any) {
        if (pg?.name.toLowerCase().includes('ipaymu')) {
            isProcessing = true;
            selectedMethod = method;
            try {
                const carts = {
                    product: $cartItems.map(item => item.name),
                    quantity: $cartItems.map(item => item.quantity.toString()),
                    price: $cartItems.map(item => item.price.toString()),
                    description: $cartItems.map(item => item.name),
                    weight: $cartItems.map(() => 1),
                    height: $cartItems.map(() => 10),
                    length: $cartItems.map(() => 10),
                    width: $cartItems.map(() => 10),
                };

                const userData = {
                    name: "Demo User",
                    email: "sandbox@payment.com",
                    phone: "081234567890",
                    amount: $cartTotal.toString(),
                    paymentMethod: method.payMethod,
                    paymentChannel: method.payChannel
                };

                const res = await fetch('/api/checkout/ipaymu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mode: 'direct', carts, userData })
                });

                const data = await res.json();
                
                if (data.success && data.data?.Data) {
                    paymentData = data.data.Data;
                    selectedMethod = method;
                    step = 2;
                } else {
                    alert('Gagal mendapatkan kode pembayaran: ' + (data.message || 'Unknown error'));
                }
            } catch (err) {
                console.error(err);
                alert('Terjadi kesalahan saat menghubungi iPaymu.');
            } finally {
                isProcessing = false;
            }
        } else {
            // Simulasi dummy untuk PG lain
            selectedMethod = method;
            step = 2;
        }
    }

    function handleSimulatePayment() {
        step = 3;
        setTimeout(() => {
            step = 4;
        }, 2000);
    }
</script>

<div class="min-h-screen bg-warm-bg flex items-center justify-center p-6 lg:p-10">
    <div class="w-full max-w-2xl">
        {#if pg}
            <div class="mb-10 text-center">
                <div class="w-20 h-20 rounded-3xl bg-white shadow-soft border border-border-light flex items-center justify-center mx-auto mb-6 text-4xl font-bold text-brand">
                    {pg.name?.[0] || '?'}
                </div>
                <h1 class="text-3xl font-heading font-bold text-main">{pg.name} Checkout</h1>
                <p class="text-sm opacity-60 mt-2 uppercase tracking-widest font-bold">Sandbox Environment</p>
            </div>

            {#if step === 1}
                <div in:fade={{ duration: 300 }} class="space-y-6">
                    <h2 class="text-lg font-bold text-main px-2">Select Payment Method</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each paymentMethods as method}
                            <button 
                                onclick={() => selectMethod(method)}
                                disabled={isProcessing}
                                class="bg-card hover:bg-card-elevated border border-border-light hover:border-brand/30 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all flex items-center gap-5 group text-left disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <div class="w-12 h-12 rounded-xl bg-main/5 group-hover:bg-brand/10 flex items-center justify-center text-main group-hover:text-brand transition-colors">
                                    {#if isProcessing && selectedMethod?.id === method.id}
                                        <svg class="animate-spin h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    {:else}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d={method.icon}/>
                                        </svg>
                                    {/if}
                                </div>
                                <span class="font-bold text-main">{method.name}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            {:else if step === 2}
                <div in:fly={{ y: 20, duration: 400 }} class="bg-card rounded-[32px] border border-border-light shadow-xl p-8 max-w-md mx-auto">
                    <button onclick={() => step = 1} class="text-caption hover:text-main flex items-center gap-2 text-sm font-bold mb-6 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Back
                    </button>

                    <div class="text-center mb-8">
                        <h2 class="text-xl font-heading font-bold text-main">{selectedMethod.name}</h2>
                        <p class="text-xs text-caption mt-1">Please complete your payment</p>
                    </div>

                    {#if selectedMethod.type === 'qr'}
                        <div class="bg-white p-4 rounded-3xl border border-border-light shadow-sm mb-4 max-w-[200px] mx-auto">
                            <!-- Dummy QR Code Pattern (atau QR asli dari iPaymu jika tersedia) -->
                            {#if paymentData?.QrString}
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={encodeURIComponent(paymentData.QrString)}" alt="QRIS" class="w-full h-full object-contain" />
                            {:else}
                                <div class="w-full aspect-square bg-main rounded-xl opacity-80" style="background-image: repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000); background-position: 0 0, 10px 10px; background-size: 20px 20px;"></div>
                            {/if}
                        </div>
                        {#if paymentData?.TransactionId}
                            <div class="text-center mb-6">
                                <p class="text-[10px] font-bold text-caption uppercase tracking-wider mb-1">Transaction ID</p>
                                <p class="text-lg font-mono font-bold text-brand">{paymentData.TransactionId}</p>
                            </div>
                        {/if}
                        <p class="text-center text-sm font-bold text-main mb-8">Scan QR Code with your banking app</p>
                    {:else if selectedMethod.type === 'va'}
                        <div class="bg-card-elevated border border-border-light rounded-2xl p-6 text-center mb-8">
                            <p class="text-[10px] font-bold text-caption uppercase tracking-wider mb-2">Virtual Account Number</p>
                            <p class="text-2xl font-mono font-bold text-main tracking-widest">{paymentData?.PaymentNo || '8801 2345 6789'}</p>
                        </div>
                    {:else}
                        <div class="bg-card-elevated border border-border-light rounded-2xl p-6 text-center mb-8">
                            <p class="text-[10px] font-bold text-caption uppercase tracking-wider mb-2">Payment Code</p>
                            <p class="text-2xl font-mono font-bold text-main tracking-widest">{paymentData?.PaymentNo || 'PAY-1234-ABCD'}</p>
                        </div>
                    {/if}

                    <div class="flex justify-between items-center py-4 border-t border-border-light mb-6">
                        <span class="text-sm font-medium text-muted">Total Amount</span>
                        <span class="text-xl font-bold text-brand">{formatPrice($cartTotal)}</span>
                    </div>

                    <button 
                        onclick={handleSimulatePayment}
                        class="w-full bg-brand text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand/20 active:scale-95 transition-all"
                    >
                        Simulate Payment Success
                    </button>
                </div>
            {:else if step === 3}
                <div in:fade class="py-20 flex flex-col items-center justify-center text-center">
                    <div class="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-6"></div>
                    <h2 class="text-xl font-heading font-bold text-main">Confirming Payment...</h2>
                    <p class="text-sm text-caption mt-2">Waiting for the gateway sandbox response.</p>
                </div>
            {:else if step === 4}
                <div in:fly={{ y: 20 }} class="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto bg-card rounded-[32px] border border-border-light shadow-2xl p-8">
                    <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 text-white shadow-lg shadow-green-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h2 class="text-2xl font-heading font-bold text-main">Payment Successful!</h2>
                    <p class="text-sm text-caption mt-2 mb-10">Your transaction via {selectedMethod?.name} was successful.</p>
                    <a 
                        href="/"
                        class="w-full bg-main text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                    >
                        Return to Store
                    </a>
                </div>
            {/if}
        {:else}
            <div class="text-center p-12 bg-card rounded-[32px] border border-border-light shadow-xl">
                <h1 class="text-xl font-heading font-bold text-main">Gateway Not Found</h1>
                <p class="text-sm text-caption mt-2 mb-8">The requested payment gateway is not available.</p>
                <a href="/checkout" class="bg-brand text-white px-8 py-3 rounded-full font-bold">Back to Cart</a>
            </div>
        {/if}
    </div>
</div>
