<script lang="ts">
	import { cartItems, cartCount, cartTotal, updateQuantity, clearCart } from '$lib/stores/cart';
	import { paymentGateways, activeGatewayId } from '$lib/stores/payment';
	import { fly, fade } from 'svelte/transition';

	let showClearModal = $state(false);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		})
			.format(price)
			.replace('Rp', 'Rp');
	};

	function handleClearCart() {
		clearCart();
		showClearModal = false;
	}

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

		if (selectedPG.name.toLowerCase().includes('ipaymu')) {
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
					buyerEmail: 'sandbox@payment.com',
					buyerPhone: '081234567890',
					amount: $cartTotal.toString(),
					imageUrl: 'https://demo.ipaymu.com/assets/images/product-7.jpg'
				};

				const res = await fetch('/api/checkout/ipaymu', {
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
	import MobileCheckout from '$lib/components/pages/MobileCheckout.svelte';
</script>

<MobileCheckout />

<div class="hidden lg:block">
	<div class="w-full">
		<div class="mb-8 flex items-center justify-between">
			<h1
				class="font-heading text-main text-3xl leading-[1.2] font-bold tracking-tight md:text-4xl"
			>
				Checkout
			</h1>
			{#if $cartCount > 0}
				<button
					onclick={() => (showClearModal = true)}
					class="text-muted rounded-full p-2 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
					title="Clear Cart"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
							d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
						/></svg
					>
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
					class="bg-main/40 fixed inset-0 backdrop-blur-sm"
					onclick={() => (showClearModal = false)}
					onkeydown={(e) => e.key === 'Escape' && (showClearModal = false)}
				></div>

				<div
					transition:fly={{ y: 20, duration: 300 }}
					class="bg-card border-border-light relative z-10 mx-4 w-full max-w-sm rounded-[24px] border p-8 shadow-2xl"
				>
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
					>
						<svg
							class="h-8 w-8 text-red-600"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/></svg
						>
					</div>
					<h3 class="font-heading text-main mb-2 text-center text-xl font-bold">Clear Cart?</h3>
					<p class="font-body text-muted mb-8 text-center text-sm">
						All items in your cart will be permanently removed. Are you sure?
					</p>

					<div class="flex gap-4">
						<button
							onclick={() => (showClearModal = false)}
							type="button"
							class="bg-card-elevated text-main hover:bg-border-light flex-1 rounded-full px-4 py-3 font-semibold transition-colors"
							>Cancel</button
						>
						<button
							onclick={handleClearCart}
							class="flex-1 rounded-full bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700"
							>Yes, Clear</button
						>
					</div>
				</div>
			</div>
		{/if}

		{#if $cartItems.length > 0}
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- Cart Items -->
				<div class="lg:col-span-2">
					<div
						class="bg-card shadow-soft border-border-light overflow-hidden rounded-[20px] border"
					>
						<ul class="divide-border-light divide-y">
							{#each $cartItems as item (item.id)}
								<li class="group flex items-center p-6">
									<div
										class="bg-card-elevated border-border-light h-24 w-24 shrink-0 overflow-hidden rounded-[12px] border"
									>
										<img
											src={item.image}
											alt={item.name}
											class="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
										/>
									</div>
									<div class="ml-6 flex flex-1 flex-col">
										<div>
											<div
												class="font-heading text-main flex justify-between text-base leading-[1.2] font-semibold"
											>
												<h3>{item.name}</h3>
												<p class="font-body text-brand ml-4 font-bold">
													{formatPrice(item.price * item.quantity)}
												</p>
											</div>
											<p class="text-muted font-body mt-1 text-sm leading-[1.7] font-normal">
												Price per unit: {formatPrice(item.price)}
											</p>
										</div>
										<div class="mt-4 flex flex-1 items-end justify-between text-sm">
											<div
												class="border-border-light bg-card-elevated/50 flex items-center rounded-full border p-1"
											>
												<button
													onclick={() => updateQuantity(item.id, 'decrease')}
													class="bg-card text-main border-border-light hover:bg-card-elevated flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-colors"
													title="Decrease quantity"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2.5"
														stroke-linecap="round"
														stroke-linejoin="round"><path d="M5 12h14" /></svg
													>
												</button>
												<span class="font-body text-main w-8 text-center text-sm font-bold"
													>{item.quantity}</span
												>
												<button
													onclick={() => updateQuantity(item.id, 'increase')}
													class="bg-brand hover:bg-brand-hover flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm transition-colors"
													title="Increase quantity"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2.5"
														stroke-linecap="round"
														stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg
													>
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
					<div
						class="bg-card shadow-soft border-border-light sticky top-28 rounded-[24px] border p-6"
					>
						<h2 class="font-heading text-main mb-5 text-lg leading-[1.2] font-bold tracking-tight">
							Order Summary
						</h2>
						<div class="font-body space-y-3 font-normal">
							<div class="text-muted flex justify-between text-sm">
								<p>Subtotal ({$cartCount} Items)</p>
								<p class="text-main font-semibold">{formatPrice($cartTotal)}</p>
							</div>
							<div class="text-muted flex justify-between text-sm">
								<p>Admin Fee</p>
								<p class="font-semibold text-green-600">Free</p>
							</div>
							<div class="border-border-light mt-5 flex items-center justify-between border-t pt-5">
								<p class="font-heading text-main text-base font-bold">Total Bill</p>
								<p class="font-body text-brand text-xl font-bold">{formatPrice($cartTotal)}</p>
							</div>
						</div>

						<div class="mt-6">
							<div class="bg-nav-active border-brand/10 mb-5 rounded-[12px] border p-3">
								<h3
									class="font-body text-brand mb-1 flex items-center text-[13px] leading-[1.2] font-bold"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1.5 h-3.5 w-3.5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
											clip-rule="evenodd"
										/>
									</svg>
									Sandbox Mode
								</h3>
								<p class="text-brand/80 font-body text-[11px] leading-[1.6] font-normal">
									You will be redirected to the secure <strong
										>{selectedPG?.name || 'Gateway'}</strong
									>
									payment {selectedPG?.mode === 'redirect' ? 'simulator' : 'interface'}.
								</p>
							</div>

							<button
								id="pay-button"
								onclick={handleCheckout}
								disabled={isProcessing}
								class="bg-brand font-body hover:bg-brand-hover hover:shadow-brand/30 flex w-full items-center justify-center rounded-full px-4 py-3 text-[13px] font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
							>
								{#if isProcessing}
									<svg
										class="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
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
									Proceed to Payment
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="ml-1.5 h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
										><path
											fill-rule="evenodd"
											d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
											clip-rule="evenodd"
										/></svg
									>
								{/if}
							</button>

							<p
								class="text-muted font-body mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] leading-[1.7] font-normal"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path
										d="M7 11V7a5 5 0 0 1 10 0v4"
									></path></svg
								>
								End-to-end encrypted payment
							</p>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div
				class="bg-card border-border-light shadow-soft relative mx-auto mt-6 flex min-h-[400px] max-w-3xl flex-col items-center justify-center overflow-hidden rounded-[32px] border p-20 text-center"
			>
				<!-- Decorative Background -->
				<div
					class="bg-mint/40 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
				></div>
				<div
					class="bg-nav-active/60 absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl"
				></div>

				<div class="relative z-10">
					<div
						class="bg-card-elevated text-border-light border-card mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border-4 shadow-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"
							></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg
						>
					</div>
					<h2 class="font-heading text-main mb-4 text-3xl leading-[1.2] font-bold tracking-tight">
						Your Cart is Empty
					</h2>
					<p class="text-muted font-body mx-auto mb-10 max-w-md text-lg leading-[1.7] font-normal">
						Start exploring our premium collection. Find your favorite items and enjoy the best
						shopping experience.
					</p>
					<a
						href="/"
						class="bg-brand font-body hover:bg-brand-hover hover:shadow-brand/30 inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
					>
						Start Shopping Now
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>
