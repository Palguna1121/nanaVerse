<script lang="ts">
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { OAuthClient } from 'xepeng-oauth-js';
	import { PUBLIC_XEPENG_CLIENT_ID, PUBLIC_XEPENG_CLIENT_SECRET } from '$env/static/public';

	let activeTab = $derived(browser ? $page.url.searchParams.get('tab') || 'info' : 'info');

	let isConnected = $state(false);
	let isLoading = $state(false);
	let userInfo = $state<{ name?: string; email?: string } | null>(null);

	onMount(async () => {
		if (browser) {
			const storedTokens = localStorage.getItem('oauth_tokens');
			if (storedTokens) {
				isConnected = true;
				userInfo = { name: 'Demo User nanaVerse', email: 'sandbox@payment.com' };
			}
		}
	});

	async function handleSSOLogin() {
		if (!browser) return;

		if (!PUBLIC_XEPENG_CLIENT_ID || !PUBLIC_XEPENG_CLIENT_SECRET) {
			alert('Kredensial SSO belum dikonfigurasi di file .env!');
			return;
		}

		isLoading = true;
		try {
			const oauth = new OAuthClient({
				clientId: PUBLIC_XEPENG_CLIENT_ID,
				clientSecret: PUBLIC_XEPENG_CLIENT_SECRET,
				baseUrl: 'https://staging-app.xepeng.com',
				redirectUri: `${window.location.origin}/auth/callback`,
				storage: 'localStorage',
				scopes: ['profile', 'email']
			});

			const url = await oauth.getAuthorizationUrl();
			window.location.href = url;
		} catch (error) {
			console.error('Gagal mendapatkan URL otorisasi:', error);
			isLoading = false;
		}
	}

	function handleDisconnect() {
		if (browser) {
			localStorage.removeItem('oauth_tokens');
			localStorage.removeItem('xepeng_raw_sso');
			isConnected = false;
			userInfo = null;
		}
	}
</script>

<div class="w-full py-4">
	<div class="mb-10 flex items-center gap-4">
		<h1 class="font-heading text-main text-3xl leading-tight font-bold tracking-tight md:text-4xl">
			Pengaturan
		</h1>
	</div>

	<!-- Detail Konten -->
	<div class="w-full">
		{#if activeTab === 'info'}
			<div
				in:fade={{ duration: 200 }}
				class="bg-card shadow-soft border-border-light relative overflow-hidden rounded-[24px] border p-6 md:p-8"
			>
				<div class="border-border-light/50 mb-8 flex items-center gap-6 border-b pb-6">
					<div
						class="bg-brand/10 text-brand border-brand/20 font-heading flex h-20 w-20 items-center justify-center rounded-full border text-3xl font-bold"
					>
						DU
					</div>
					<div>
						<h2 class="font-heading text-main text-xl font-bold">Demo User</h2>
						<p class="text-caption mt-1 text-sm">sandbox@payment.com</p>
					</div>
				</div>

				<div class="space-y-6">
					<div>
						<label
							for="full-name"
							class="font-heading text-caption mb-2 block text-xs font-bold tracking-wider uppercase"
							>Nama Lengkap</label
						>
						<input
							id="full-name"
							type="text"
							value="Demo User"
							disabled
							class="bg-card-elevated border-border-light text-main font-body w-full cursor-not-allowed rounded-xl border px-4 py-3 text-sm focus:outline-none"
						/>
					</div>

					<div>
						<label
							for="email"
							class="font-heading text-caption mb-2 block text-xs font-bold tracking-wider uppercase"
							>Alamat Email</label
						>
						<input
							id="email"
							type="email"
							value="sandbox@payment.com"
							disabled
							class="bg-card-elevated border-border-light text-main font-body w-full cursor-not-allowed rounded-xl border px-4 py-3 text-sm focus:outline-none"
						/>
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<span
								class="font-heading text-caption mb-2 block text-xs font-bold tracking-wider uppercase"
								>Status Akun</span
							>
							<span
								class="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-green-500 uppercase"
							>
								<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
								Terverifikasi
							</span>
						</div>
						<div>
							<span
								class="font-heading text-caption mb-2 block text-xs font-bold tracking-wider uppercase"
								>Bergabung Sejak</span
							>
							<p class="text-main font-body mt-1 text-sm font-semibold">28 April 2026</p>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'auth'}
			<div
				in:fade={{ duration: 200 }}
				class="bg-card shadow-soft border-border-light relative overflow-hidden rounded-[24px] border p-6 md:p-8"
			>
				<h3 class="font-heading text-main mb-2 text-xl font-bold">Autentikasi & SSO</h3>
				<p class="text-caption mb-6 text-sm">Hubungkan akun Anda dengan layanan pihak ketiga.</p>

				<div class="space-y-4">
					<div
						class="bg-card-elevated border-border-light flex flex-col justify-between gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center"
					>
						<div class="flex items-center gap-4">
							<div
								class="bg-brand/10 text-brand flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold"
							>
								X
							</div>
							<div>
								<h4 class="font-heading text-main text-base font-semibold">Xepeng Payment</h4>
								{#if isConnected}
									<p class="mt-0.5 flex items-center gap-1 text-xs font-semibold text-green-500">
										<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
										Terhubung
									</p>
								{:else}
									<p class="text-caption mt-0.5 text-xs">Otorisasi pembayaran otomatis & instan</p>
								{/if}
							</div>
						</div>

						{#if isLoading}
							<button
								disabled
								class="bg-brand/50 flex cursor-wait items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
							>
								<svg
									class="h-4 w-4 animate-spin text-white"
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
								Memproses...
							</button>
						{:else if isConnected}
							<button
								onclick={handleDisconnect}
								class="rounded-full bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-500/20"
							>
								Putuskan Koneksi
							</button>
						{:else}
							<button
								onclick={handleSSOLogin}
								class="bg-brand hover:bg-brand-hover shadow-soft rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
							>
								Hubungkan SSO
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
