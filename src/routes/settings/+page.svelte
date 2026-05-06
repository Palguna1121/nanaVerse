<script lang="ts">
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { OAuthClient } from 'xepeng-oauth-js';
	import { PUBLIC_XEPENG_CLIENT_ID, PUBLIC_XEPENG_CLIENT_SECRET } from '$env/static/public';
	import { paymentGateways, activeGatewayId } from '$lib/stores/payment';

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

		if (!PUBLIC_XEPENG_CLIENT_ID) {
			alert('XEPENG_CLIENT_ID is not configured in the .env file!');
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
			console.error('Failed to get authorization URL:', error);
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

    let showPGModal = $state(false);
    let pendingPG = $state<any>(null);

    let showModeModal = $state(false);
    let pendingMode = $state<{ pg: any, mode: 'direct' | 'redirect' } | null>(null);

    function requestPGChange(pg: any) {
        if (pg.enabled) return; 
        pendingPG = pg;
        showPGModal = true;
    }

    function confirmPGChange() {
        if (pendingPG) {
            paymentGateways.update(gateways => 
                gateways.map(g => ({ ...g, enabled: g.id === pendingPG.id }))
            );
			activeGatewayId.set(pendingPG.id);
        }
        showPGModal = false;
        pendingPG = null;
    }

    function requestModeChange(pg: any, mode: 'direct' | 'redirect') {
        if (pg.mode === mode) return;
        pendingMode = { pg, mode };
        showModeModal = true;
    }

    function confirmModeChange() {
        if (pendingMode) {
            const { pg, mode } = pendingMode;
            paymentGateways.update(gateways => 
                gateways.map(g => g.id === pg.id ? { ...g, mode } : g)
            );
        }
        showModeModal = false;
        pendingMode = null;
    }

	import MobileSettings from '$lib/components/pages/MobileSettings.svelte';
</script>

<MobileSettings {isConnected} {isLoading} {handleSSOLogin} {handleDisconnect} />

<div class="hidden lg:block">

<div class="w-full py-4">
	<div class="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
		<h1 class="font-heading text-main text-3xl leading-tight font-bold tracking-tight md:text-4xl">
			Settings
		</h1>

		<div class="bg-card border border-border-light rounded-xl p-1 flex gap-1 shadow-sm shrink-0">
			{#each [
				{ id: 'info', label: 'Profile Info' },
				{ id: 'auth', label: 'Auth & SSO' },
				{ id: 'payment', label: 'Payment PG' }
			] as tab}
				<a 
					href="?tab={tab.id}" 
					class="px-4 py-2 text-xs font-bold rounded-lg transition-all {activeTab === tab.id ? 'bg-main text-white dark:text-card shadow-md' : 'text-caption hover:bg-card-elevated'}"
				>
					{tab.label}
				</a>
			{/each}
		</div>
	</div>

	<!-- Content Detail -->
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
							>Full Name</label
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
							>Email Address</label
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
								>Account Status</span
							>
							<span
								class="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-green-500 uppercase"
							>
								<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
								Verified
							</span>
						</div>
						<div>
							<span
								class="font-heading text-caption mb-2 block text-xs font-bold tracking-wider uppercase"
								>Joined Since</span
							>
							<p class="text-main font-body mt-1 text-sm font-semibold">April 28, 2026</p>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'auth'}
			<div
				in:fade={{ duration: 200 }}
				class="bg-card shadow-soft border-border-light relative overflow-hidden rounded-[24px] border p-6 md:p-8"
			>
				<h3 class="font-heading text-main mb-2 text-xl font-bold">Authentication & SSO</h3>
				<p class="text-caption mb-6 text-sm">Connect your account with third-party services.</p>

				<div class="space-y-4">
					<div
						class="bg-card-elevated border-border-light flex flex-col justify-between gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center"
					>
						<div class="flex items-center gap-4">
							<div
								class="bg-card border border-border-light flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden p-1.5"
							>
								<img src="/logo-xepeng.png" alt="Xepeng Logo" class="w-full h-full object-contain" onerror={(e) => (e.currentTarget as HTMLElement).style.display='none'} />
							</div>
							<div>
								<h4 class="font-heading text-main text-base font-semibold">Xepeng Payment</h4>
								{#if isConnected}
									<p class="mt-0.5 flex items-center gap-1 text-xs font-semibold text-green-500">
										<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
										Connected
									</p>
								{:else}
									<p class="text-caption mt-0.5 text-xs">Automated & instant payment authorization</p>
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
								Processing...
							</button>
						{:else if isConnected}
							<button
								onclick={handleDisconnect}
								class="rounded-full bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-500/20"
							>
								Disconnect
							</button>
						{:else}
							<button
								onclick={handleSSOLogin}
								class="bg-brand hover:bg-brand-hover shadow-soft rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
							>
								Connect SSO
							</button>
						{/if}
					</div>
				</div>
			</div>
		{:else if activeTab === 'payment'}
			<div
				in:fade={{ duration: 200 }}
				class="bg-card shadow-soft border-border-light relative overflow-hidden rounded-[24px] border p-6 md:p-8"
			>
				<h3 class="font-heading text-main mb-2 text-xl font-bold">Payment Gateways</h3>
				<p class="text-caption mb-8 text-sm">Configure available payment providers and checkout flow.</p>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					{#each $paymentGateways as pg}
						<div class="bg-card-elevated border-border-light rounded-2xl border p-6 flex flex-col justify-between gap-6 transition-all hover:border-brand/30">
							<div class="flex items-start justify-between">
								<div class="flex items-center gap-4">
									<div class="w-12 h-12 rounded-xl bg-card border border-border-light flex items-center justify-center overflow-hidden p-1.5 shrink-0">
										<img src="/logo-{pg.id}.png" alt="{pg.name} Logo" class="w-full h-full object-contain" onerror={(e) => (e.currentTarget as HTMLElement).style.display='none'} />
									</div>
									<div>
										<h4 class="font-heading text-main text-base font-semibold">{pg?.name}</h4>
										<p class="text-caption text-xs mt-0.5">{pg?.description}</p>
									</div>
								</div>
								<button 
									aria-label="Toggle {pg?.name}"
									onclick={() => requestPGChange(pg)}
									class="w-12 h-6 rounded-full p-1 transition-colors {pg.enabled ? 'bg-green-500' : 'bg-border-light dark:bg-main/10'}"
								>
									<div class="w-4 h-4 rounded-full bg-white transition-transform {pg.enabled ? 'translate-x-6' : 'translate-x-0'} shadow-sm"></div>
								</button>
							</div>

							{#if pg.enabled && pg.allowModeSwitch}
								<div class="flex flex-col gap-3 pt-4 border-t border-border-light">
									<p class="text-[10px] font-bold text-caption uppercase tracking-widest">Integration Mode</p>
									<div class="flex gap-2 p-1 bg-card rounded-xl border border-border-light">
										<button 
											onclick={() => requestModeChange(pg, 'redirect')}
											class="flex-1 py-2 text-xs font-bold rounded-lg transition-all {pg.mode === 'redirect' ? 'bg-main text-white dark:text-card shadow-md' : 'text-caption hover:bg-card-elevated'}"
										>
											Redirect
										</button>
										<button 
											onclick={() => requestModeChange(pg, 'direct')}
											class="flex-1 py-2 text-xs font-bold rounded-lg transition-all {pg.mode === 'direct' ? 'bg-main text-white dark:text-card shadow-md' : 'text-caption hover:bg-card-elevated'}"
										>
											Direct
										</button>
									</div>
								</div>
							{:else if pg.enabled && !pg.allowModeSwitch}
								<div class="pt-4 border-t border-border-light flex items-center gap-2">
									<div class="px-3 py-1 bg-brand/10 text-brand rounded-full text-[10px] font-bold uppercase">
										Redirect Only
									</div>
									<span class="text-[10px] text-caption font-medium">Locked mode for security</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
</div>

{#if showPGModal}
    <div class="fixed inset-0 z-100 flex items-center justify-center px-6">
        <div role="button" tabindex="0" class="absolute inset-0 bg-main/60 backdrop-blur-sm" onclick={() => showPGModal = false} onkeydown={(e) => e.key === 'Enter' && (showPGModal = false)} aria-label="Close"></div>
        <div class="relative bg-card rounded-[32px] p-8 w-full max-w-sm text-center border border-border-light shadow-2xl">
            <h3 class="text-xl font-heading font-bold text-main mb-2">Change Gateway?</h3>
            <p class="text-sm text-caption mb-8">Are you sure you want to activate <strong>{pendingPG?.name}</strong>? This will disable the currently active gateway.</p>
            <div class="flex gap-4">
                <button onclick={() => showPGModal = false} class="flex-1 py-3 rounded-full bg-card-elevated font-bold text-main">Cancel</button>
                <button onclick={confirmPGChange} class="flex-1 py-3 rounded-full bg-brand text-white font-bold">Yes</button>
            </div>
        </div>
    </div>
{/if}

{#if showModeModal}
    <div class="fixed inset-0 z-100 flex items-center justify-center px-6">
        <div role="button" tabindex="0" class="absolute inset-0 bg-main/60 backdrop-blur-sm" onclick={() => showModeModal = false} onkeydown={(e) => e.key === 'Enter' && (showModeModal = false)} aria-label="Close"></div>
        <div class="relative bg-card rounded-[32px] p-8 w-full max-w-sm text-center border border-border-light shadow-2xl">
            <h3 class="text-xl font-heading font-bold text-main mb-2">Change Mode?</h3>
            <div class="text-sm text-caption mb-8 text-left space-y-3">
                <p>Switch <strong>{pendingMode?.pg?.name}</strong> to <strong class="uppercase text-main">{pendingMode?.mode}</strong> mode?</p>
                <div class="bg-card-elevated p-3 rounded-xl border border-border-light">
                    {#if pendingMode?.mode === 'direct'}
                        <p class="text-xs"><strong>Direct:</strong> User selects payment method (QRIS/VA) within checkout directly.</p>
                    {:else}
                        <p class="text-xs"><strong>Redirect:</strong> User is sent to the gateway's hosted payment page.</p>
                    {/if}
                </div>
            </div>
            <div class="flex gap-4">
                <button onclick={() => showModeModal = false} class="flex-1 py-3 rounded-full bg-card-elevated font-bold text-main">Cancel</button>
                <button onclick={confirmModeChange} class="flex-1 py-3 rounded-full bg-brand text-white font-bold">Confirm</button>
            </div>
        </div>
    </div>
{/if}
