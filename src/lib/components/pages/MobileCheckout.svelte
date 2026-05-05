<script lang="ts">
	import { cartItems, cartCount, cartTotal, updateQuantity, clearCart } from '$lib/stores/cart';
	import { paymentGateways, activeGatewayId } from '$lib/stores/payment';
	import { fade, fly } from 'svelte/transition';

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		})
			.format(price)
			.replace('IDR', 'Rp');
	};

	let showClearModal = $state(false);
	let isVisible = $state(true);
	let scrollTimeout: any;

	let selectedPG = $derived(
		$paymentGateways.find((g) => g.id === $activeGatewayId) || $paymentGateways[0]
	);

	let isProcessing = $state(false);

	async function handleCheckout() {
		if (!selectedPG) return;

		if (selectedPG.mode === 'direct') {
			window.location.href = `/checkout/direct/${selectedPG.id}`;
			return;
		}

		// PG yang punya integrasi real API (mode redirect)
		const realPGs = ['ipaymu', 'midtrans'];

		if (realPGs.includes(selectedPG.id)) {
			isProcessing = true;
			try {
				const carts = {
					product: $cartItems.map((item) => item.name),
					quantity: $cartItems.map((item) => item.quantity.toString()),
					price: $cartItems.map((item) => item.price.toString()),
					description: $cartItems.map((item) => item.name),
					weight: $cartItems.map(() => 1),
					height: $cartItems.map(() => 10),
					length: $cartItems.map(() => 10),
					width: $cartItems.map(() => 10)
				};

				const userData = {
					buyerName: 'Demo User',
					name: 'Demo User',
					buyerEmail: 'sandbox@payment.com',
					email: 'sandbox@payment.com',
					buyerPhone: '081234567890',
					phone: '081234567890',
					amount: $cartTotal.toString(),
					imageUrl: 'https://demo.ipaymu.com/assets/images/product-7.jpg'
				};

				const res = await fetch(`/api/checkout/${selectedPG.id}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ mode: 'redirect', carts, userData })
				});

				const data = await res.json();

				if (data.success && data.data?.Data?.Url) {
					window.location.href = data.data.Data.Url;
				} else {
					alert('Gagal membuat sesi pembayaran: ' + (data.message || 'Unknown error'));
					isProcessing = false;
				}
			} catch (err) {
				console.error(err);
				alert('Terjadi kesalahan saat memproses checkout.');
				isProcessing = false;
			}
		} else {
			window.location.href = '/checkout/success';
		}
	}

	onMount(() => {
		// Scroll hide logic removed as per user request to keep bottom sheet visible
	});
</script>

<div class="pb-48 lg:hidden">
	<div class="px-6">
		<!-- Header -->
		<div class="mb-6 flex items-center justify-between">
			<a
				href="/"
				aria-label="Back to Home"
				class="bg-card shadow-soft border-border-light text-main flex h-10 w-10 items-center justify-center rounded-full border"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
				>
			</a>
			<h1 class="font-heading text-main text-lg font-bold">My Cart</h1>
			<a
				href="/settings"
				aria-label="Settings"
				class="bg-card shadow-soft border-border-light text-main flex h-10 w-10 items-center justify-center rounded-full border"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
						cx="12"
						cy="7"
						r="4"
					/></svg
				>
			</a>
		</div>

		{#if $cartCount > 0}
			<div class="mb-4 flex justify-end">
				<button
					onclick={() => (showClearModal = true)}
					class="text-xs font-bold tracking-wider text-red-500 uppercase">Clear All</button
				>
			</div>
		{/if}

		{#if $cartItems.length > 0}
			<div class="space-y-4">
				{#each $cartItems as item (item.id)}
					<div class="bg-card border-border-light shadow-soft flex gap-4 rounded-[24px] border p-4">
						<div class="bg-card-elevated h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
							<img src={item.image} alt={item.name} class="h-full w-full object-cover" />
						</div>
						<div class="flex flex-1 flex-col justify-between py-1">
							<div>
								<h3 class="text-main line-clamp-1 text-sm font-bold">{item.name}</h3>
								<p class="text-brand mt-0.5 text-xs font-bold">{formatPrice(item.price)}</p>
							</div>
							<div class="mt-2 flex items-center justify-between">
								<div
									class="bg-card-elevated border-border-light flex items-center gap-3 rounded-full border px-2 py-1"
								>
									<button
										onclick={() => updateQuantity(item.id, 'decrease')}
										class="bg-card text-main flex h-6 w-6 items-center justify-center rounded-full shadow-sm"
										>-</button
									>
									<span class="w-4 text-center text-xs font-bold">{item.quantity}</span>
									<button
										onclick={() => updateQuantity(item.id, 'increase')}
										class="bg-main dark:text-card flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm"
										>+</button
									>
								</div>
							</div>
						</div>
					</div>
				{/each}

				<!-- Summary Section -->
				<div class="border-border-light mt-8 space-y-4 border-t pt-6">
					<h3 class="font-heading text-main px-1 text-sm font-bold">Order Summary</h3>
					<div class="bg-card border-border-light shadow-soft space-y-3 rounded-[24px] border p-5">
						<div class="text-muted flex justify-between text-xs font-medium">
							<span>Subtotal ({$cartCount} items)</span>
							<span class="text-main font-bold">{formatPrice($cartTotal)}</span>
						</div>
						<div class="text-muted flex justify-between text-xs font-medium">
							<span>Shipping Fee</span>
							<span class="font-bold text-green-600">Free</span>
						</div>
						<div class="text-muted flex justify-between text-xs font-medium">
							<span>Tax (Estimated)</span>
							<span class="text-main font-bold">{formatPrice(0)}</span>
						</div>

						<div
							class="bg-card-elevated border-border-light mt-2 flex items-start gap-3 rounded-2xl border p-4"
						>
							<div
								class="bg-brand/10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-brand"
									><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line
										x1="12"
										y1="16"
										x2="12.01"
										y2="16"
									/></svg
								>
							</div>
							<div>
								<p class="text-main mb-0.5 text-[10px] font-bold tracking-wider uppercase">
									Sandbox Mode
								</p>
								<p class="text-caption text-[10px] leading-relaxed">
									You will be redirected to the secure <strong
										>{selectedPG?.name || 'Gateway'}</strong
									>
									payment {selectedPG?.mode === 'redirect' ? 'simulator' : 'direct interface'}.
								</p>
							</div>
						</div>
						<div class="border-border-light flex flex-col gap-4 border-t pt-5">
							<div class="flex items-center justify-between">
								<span class="text-main text-sm font-bold">Total Payment</span>
								<span class="text-brand text-xl font-bold">{formatPrice($cartTotal)}</span>
							</div>
							<button
								onclick={handleCheckout}
								disabled={isProcessing}
								class="bg-main dark:text-card shadow-main/10 flex w-full items-center justify-center rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-70"
							>
								{#if isProcessing}
									<svg
										class="dark:text-card mr-2 -ml-1 h-4 w-4 animate-spin text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Processing...
								{:else}
									Buy Now
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<div
					class="bg-card-elevated text-caption mb-6 flex h-20 w-20 items-center justify-center rounded-full"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path
							d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
						/></svg
					>
				</div>
				<h2 class="font-heading text-main mb-2 text-xl font-bold">Your cart is empty</h2>
				<p class="text-caption mb-8 text-sm">
					Looks like you haven't added anything to your cart yet.
				</p>
				<a href="/" class="bg-main dark:text-card rounded-full px-8 py-3 font-bold text-white">Start Shopping</a>
			</div>
		{/if}
	</div>
</div>

<!-- Fixed Bottom Bar removed to give space for Bottom Navigation -->

{#if showClearModal}
	<div class="fixed inset-0 z-100 flex items-center justify-center px-6">
		<div
			role="button"
			tabindex="0"
			aria-label="Close Modal"
			class="bg-main/60 absolute inset-0 backdrop-blur-sm"
			onclick={() => (showClearModal = false)}
			onkeydown={(e) => e.key === 'Enter' && (showClearModal = false)}
		></div>
		<div
			in:fly={{ y: 20 }}
			class="bg-card border-border-light relative w-full max-w-sm rounded-[32px] border p-8 text-center shadow-2xl"
		>
			<h3 class="font-heading text-main mb-2 text-xl font-bold">Clear Cart?</h3>
			<p class="text-muted mb-8 text-sm">
				Are you sure you want to remove all items from your cart?
			</p>
			<div class="flex gap-4">
				<button
					onclick={() => (showClearModal = false)}
					class="bg-card-elevated text-main flex-1 rounded-full py-3 font-bold">Cancel</button
				>
				<button
					onclick={() => {
						clearCart();
						showClearModal = false;
					}}
					class="flex-1 rounded-full bg-red-500 py-3 font-bold text-white">Yes, Clear</button
				>
			</div>
		</div>
	</div>
{/if}
