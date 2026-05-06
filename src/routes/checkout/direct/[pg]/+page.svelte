<script lang="ts">
	import { page } from '$app/stores';
	import { paymentGateways } from '$lib/stores/payment';
	import { cartTotal, cartItems } from '$lib/stores/cart';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { theme } from '$lib/stores/theme';

	const pgId = $page.params.pg;
	const pg = $derived($paymentGateways.find((g) => g.id === pgId));

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		})
			.format(price)
			.replace('IDR', 'Rp');
	};

	let step = $state(1);
	let ssoError = $state(false);

	// Definisi payment method dengan logo asli
	const paymentMethods = [
		{
			id: 'qris',
			name: 'QRIS',
			type: 'qr',
			payMethod: 'qris',
			payChannel: 'qris',
			logo: '/payment_method_direct_logo/qris-logo-black.svg',
			logoDark: '/payment_method_direct_logo/qris-logo-white.png',
			description: 'Scan QR dengan semua banking app'
		},
		{
			id: 'va_bca',
			name: 'BCA Virtual Account',
			type: 'va',
			payMethod: 'va',
			payChannel: 'bca',
			logo: '/payment_method_direct_logo/bca-logo-color.png',
			logoDark: '/payment_method_direct_logo/bca-logo-white.png',
			description: 'Transfer via m-BCA atau ATM BCA'
		},
		{
			id: 'va_mandiri',
			name: 'Mandiri Virtual Account',
			type: 'va',
			payMethod: 'va',
			payChannel: 'mandiri',
			logo: '/payment_method_direct_logo/livin-logo-black.png',
			logoDark: '/payment_method_direct_logo/livin-logo-white.png',
			description: 'Transfer via Livin by Mandiri'
		},
		{
			id: 'retail',
			name: 'Alfamart',
			type: 'retail',
			payMethod: 'cstore',
			payChannel: 'alfamart',
			logo: '/payment_method_direct_logo/alfamart-logo-black.png',
			logoDark: '/payment_method_direct_logo/alfamart-logo-white.png',
			description: 'Bayar langsung di kasir Alfamart'
		}
	];

	let selectedMethod = $state<any>(null);
	let paymentData = $state<any>(null);
	let isProcessing = $state(false);

	// Validasi SSO Xepeng saat halaman dimount
	onMount(() => {
		if (pgId === 'xepeng' && browser) {
			const isConnected = !!localStorage.getItem('oauth_tokens');
			if (!isConnected) {
				ssoError = true;
			}
		}
	});

	async function selectMethod(method: any) {
		if (ssoError) return;
		const currentPgId = pg?.id;

		// PG yang punya integrasi real API
		// const realPGs = ['ipaymu', 'midtrans'];
		const realPGs = ['ipaymu'];

		if (currentPgId && realPGs.includes(currentPgId)) {
			isProcessing = true;
			selectedMethod = method;
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
					name: 'Demo User',
					buyerName: 'Demo User',
					email: 'sandbox@payment.com',
					buyerEmail: 'sandbox@payment.com',
					phone: '081234567890',
					buyerPhone: '081234567890',
					amount: $cartTotal.toString(),
					paymentMethod: method.payMethod,
					paymentChannel: method.payChannel,
					imageUrl: 'https://demo.ipaymu.com/assets/images/product-7.jpg'
				};

				const endpoint = `/api/checkout/${currentPgId}`;
				const res = await fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ mode: 'direct', carts, userData })
				});

				const data = await res.json();

				if (data.success && data.data?.Data) {
					paymentData = data.data.Data;
					step = 2;
				} else {
					alert('Gagal mendapatkan kode pembayaran: ' + (data.message || 'Unknown error'));
					selectedMethod = null;
				}
			} catch (err) {
				console.error(err);
				alert('Terjadi kesalahan saat menghubungi payment gateway.');
				selectedMethod = null;
			} finally {
				isProcessing = false;
			}
		} else {
			// Simulasi dummy untuk PG yang belum terintegrasi
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

<div class="bg-warm-bg flex min-h-screen items-center justify-center p-6 lg:p-10">
	<div class="w-full max-w-2xl">
		{#if pg}
			<div class="mb-10 text-center">
				<div class="mx-auto mb-8 flex h-12 items-center justify-center">
					<img
						src="/logo-{pg.id}.png"
						alt="{pg.name} Logo"
						class="h-full w-auto max-w-[160px] object-contain"
						onerror={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
					/>
				</div>
				<h1 class="font-heading text-main text-2xl font-bold md:text-3xl">{pg.name} Checkout</h1>
				<p class="mt-1 text-xs font-bold tracking-widest uppercase opacity-60">
					Sandbox Environment
				</p>
			</div>

			{#if step === 1}
				<div in:fade={{ duration: 300 }} class="mx-auto w-full max-w-lg">
					{#if isProcessing}
						<div
							class="bg-card md:border-border-light flex w-full animate-pulse flex-col items-center p-8 md:rounded-2xl md:border"
						>
							<div class="bg-border-light mb-8 h-4 w-24 rounded-full"></div>
							<div class="bg-border-light mb-6 h-40 w-40 rounded-2xl"></div>
							<div class="bg-border-light mb-2 h-3 w-32 rounded-full"></div>
							<div class="bg-border-light mb-8 h-6 w-48 rounded-full"></div>
							<div class="border-border-light mb-6 flex w-full justify-between border-t pt-4">
								<div class="bg-border-light h-4 w-20 rounded-full"></div>
								<div class="bg-border-light h-5 w-28 rounded-full"></div>
							</div>
							<div class="bg-border-light h-12 w-full rounded-xl"></div>
						</div>
					{:else}
						{#if ssoError}
							<div
								class="mx-4 mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 md:mx-0"
							>
								<div class="mt-0.5 shrink-0 text-red-500">
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
										><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line
											x1="12"
											y1="16"
											x2="12.01"
											y2="16"
										/></svg
									>
								</div>
								<div>
									<p class="text-sm font-bold text-red-600 dark:text-red-400">
										Xepeng SSO Belum Terhubung
									</p>
									<p class="mt-0.5 text-xs text-red-500/80">
										Hubungkan akun Xepeng di <a
											href="/settings?tab=auth"
											class="font-semibold underline">Settings → Authentication & SSO</a
										>
									</p>
								</div>
							</div>
						{/if}
						<h2 class="text-caption mb-3 px-4 text-xs font-bold tracking-wider uppercase md:px-0">
							Payment Method
						</h2>
						<div
							class="border-border-light divide-border-light bg-card flex flex-col divide-y border-y md:overflow-hidden md:rounded-[20px] md:border"
						>
							{#each paymentMethods as method}
								<button
									onclick={() => selectMethod(method)}
									disabled={ssoError}
									class="hover:bg-card-elevated active:bg-border-light group flex w-full items-center justify-between p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40"
								>
									<div class="flex items-center gap-4">
										<div class="flex h-8 w-12 shrink-0 items-center justify-start">
											<img
												src={$theme === 'dark' ? method.logoDark : method.logo}
												alt="{method.name} logo"
												class="max-h-full max-w-full object-contain"
												onerror={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
											/>
										</div>
										<div>
											<span class="text-main block text-sm font-semibold">{method.name}</span>
											<span class="text-caption text-xs">{method.description}</span>
										</div>
									</div>
									<svg
										class="text-caption group-hover:text-brand shrink-0 transition-colors"
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
									>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{:else if step === 2}
				<div
					in:fly={{ y: 20, duration: 400 }}
					class="mx-auto flex w-full max-w-lg flex-col items-center"
				>
					<button
						onclick={() => (step = 1)}
						class="text-caption hover:text-main mb-8 flex items-center gap-2 self-start px-4 text-sm font-bold transition-colors md:px-0"
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
							stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
						>
						Back
					</button>

					<div class="mb-10 text-center">
						<div class="mx-auto mb-4 flex h-10 w-16 items-center justify-center">
							<img
								src={$theme === 'dark' ? selectedMethod.logoDark : selectedMethod.logo}
								alt="{selectedMethod.name} logo"
								class="max-h-full max-w-full object-contain"
								onerror={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
							/>
						</div>
						<h2 class="font-heading text-main text-2xl font-bold">{selectedMethod.name}</h2>
						<p class="text-caption mt-1 text-sm">Please complete your payment</p>
					</div>

					{#if selectedMethod.type === 'qr'}
						<div
							class="border-border-light mx-auto mb-6 h-56 w-56 rounded-[32px] border bg-white p-4 shadow-sm"
						>
							<!-- Dummy QR Code Pattern (atau QR asli dari iPaymu jika tersedia) -->
							{#if paymentData?.QrString}
								<img
									src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={encodeURIComponent(
										paymentData.QrString
									)}"
									alt="QRIS"
									class="h-full w-full object-contain"
								/>
							{:else}
								<div
									class="bg-main aspect-square w-full rounded-2xl opacity-80"
									style="background-image: repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000); background-position: 0 0, 10px 10px; background-size: 20px 20px;"
								></div>
							{/if}
						</div>
						{#if paymentData?.TransactionId}
							<div class="mb-8 text-center">
								<p class="text-caption mb-2 text-xs font-bold tracking-wider uppercase">
									Transaction ID
								</p>
								<p class="text-main font-mono text-lg font-bold">{paymentData.TransactionId}</p>
							</div>
						{/if}
						<p class="text-main mb-10 text-center text-sm font-bold">
							Scan QR Code with your banking app
						</p>
					{:else if selectedMethod.type === 'va'}
						<div
							class="bg-card md:border-border-light border-border-light mb-10 w-full border-y py-8 text-center md:border"
						>
							<p class="text-caption mb-3 text-xs font-bold tracking-wider uppercase">
								Virtual Account Number
							</p>
							<p class="text-main font-mono text-3xl font-bold tracking-widest">
								{paymentData?.PaymentNo || '8801 2345 6789'}
							</p>
						</div>
					{:else}
						<div
							class="bg-card md:border-border-light border-border-light mb-10 w-full border-y py-8 text-center md:border"
						>
							<p class="text-caption mb-3 text-xs font-bold tracking-wider uppercase">
								Payment Code
							</p>
							<p class="text-main font-mono text-3xl font-bold tracking-widest">
								{paymentData?.PaymentNo || 'PAY-1234-ABCD'}
							</p>
						</div>
					{/if}

					<div class="w-full max-w-sm">
						<div class="border-border-light mb-8 flex items-center justify-between border-t py-5">
							<span class="text-muted text-base font-bold">Total Amount</span>
							<span class="text-brand text-2xl font-bold">{formatPrice($cartTotal)}</span>
						</div>

						<button
							onclick={handleSimulatePayment}
							class="bg-brand w-full rounded-2xl py-4 font-bold text-white transition-all active:scale-95"
						>
							Simulate Payment Success
						</button>
					</div>
				</div>
			{:else if step === 3}
				<div in:fade class="flex flex-col items-center justify-center py-24 text-center">
					<div
						class="border-brand/20 border-t-brand mb-8 h-16 w-16 animate-spin rounded-full border-4"
					></div>
					<h2 class="font-heading text-main text-2xl font-bold">Confirming Payment...</h2>
					<p class="text-caption mt-2 text-base">Waiting for the gateway sandbox response.</p>
				</div>
			{:else if step === 4}
				<div
					in:fly={{ y: 20 }}
					class="mx-auto flex max-w-sm flex-col items-center justify-center py-20 text-center"
				>
					<div
						class="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
						>
					</div>
					<h2 class="font-heading text-main text-3xl font-bold">Payment Successful!</h2>
					<p class="text-caption mt-3 mb-12 text-base">
						Your transaction via {selectedMethod?.name} was successful.
					</p>
					<a
						href="/"
						class="bg-main w-full rounded-2xl py-4 font-bold text-white transition-all active:scale-95"
					>
						Return to Store
					</a>
				</div>
			{/if}
		{:else}
			<div class="bg-card border-border-light rounded-[32px] border p-12 text-center shadow-xl">
				<h1 class="font-heading text-main text-xl font-bold">Gateway Not Found</h1>
				<p class="text-caption mt-2 mb-8 text-sm">
					The requested payment gateway is not available.
				</p>
				<a href="/checkout" class="bg-brand rounded-full px-8 py-3 font-bold text-white"
					>Back to Cart</a
				>
			</div>
		{/if}
	</div>
</div>
