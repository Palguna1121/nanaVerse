<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { theme } from '$lib/stores/theme';
    import { paymentGateways, activeGatewayId, type PaymentGateway } from '$lib/stores/payment';
    let location = $state('New York, USA');

    let { isConnected = false, isLoading = false, handleSSOLogin, handleDisconnect } = $props<{
        isConnected?: boolean;
        isLoading?: boolean;
        handleSSOLogin?: () => void;
        handleDisconnect?: () => void;
    }>();
    function toggleTheme() {
        theme.update(t => t === 'dark' ? 'light' : 'dark');
    }

    let showPGModal = $state(false);
    let pendingPG = $state<PaymentGateway | null>(null);

    let showModeModal = $state(false);
    let pendingMode = $state<{ pg: PaymentGateway, mode: 'direct' | 'redirect' } | null>(null);

    function requestPGChange(pg: PaymentGateway) {
        if (pg.enabled) return; 
        pendingPG = pg;
        showPGModal = true;
    }

    function confirmPGChange() {
        if (pendingPG) {
            paymentGateways.update(gateways => 
                gateways.map(g => ({ ...g, enabled: g.id === pendingPG!.id }))
            );
            activeGatewayId.set(pendingPG.id);
        }
        showPGModal = false;
        pendingPG = null;
    }

    function requestModeChange(pg: PaymentGateway, mode: 'direct' | 'redirect') {
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
</script>

<div class="lg:hidden pb-32">
    <div class="px-6">
        <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-heading font-bold text-main">Profile</h1>
        <button aria-label="Toggle Theme" onclick={toggleTheme} class="w-10 h-10 rounded-full bg-card shadow-soft border border-border-light flex items-center justify-center text-main">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
    </div>

    <!-- User Info Card -->
    <div class="bg-main dark:bg-card-elevated border border-border-light text-white dark:text-main rounded-[32px] p-8 mb-8 relative overflow-hidden shadow-xl shadow-main/20 dark:shadow-none transition-colors duration-300">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 dark:bg-brand/10 rounded-full blur-3xl"></div>
        <div class="flex items-center gap-6 relative z-10">
            <div class="w-20 h-20 rounded-full bg-white/20 dark:bg-brand/20 backdrop-blur-md border-2 border-white/30 dark:border-brand/30 flex items-center justify-center text-3xl font-bold">
                DU
            </div>
            <div>
                <h2 class="text-xl font-heading font-bold">Demo User</h2>
                <p class="text-sm opacity-60">sandbox@payment.com</p>
            </div>
        </div>
    </div>

    <!-- Menu List -->
    <div class="space-y-6">
        <div>
            <h3 class="text-xs font-bold text-caption uppercase tracking-wider px-2 mb-4">Settings</h3>
            <div class="bg-card border border-border-light rounded-[24px] overflow-hidden divide-y divide-border-light shadow-soft transition-colors">
                <button onclick={toggleTheme} class="w-full p-5 flex items-center justify-between text-left active:bg-card-elevated transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-card-elevated flex items-center justify-center text-main">
                            {#if $theme === 'dark'}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                            {:else}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                            {/if}
                        </div>
                        <div>
                            <span class="text-sm font-bold text-main block">Dark Mode</span>
                            <span class="text-[10px] text-caption font-medium">Currently {$theme}</span>
                        </div>
                    </div>
                    <div class="w-12 h-6 rounded-full p-1 transition-colors {$theme === 'dark' ? 'bg-brand' : 'bg-border-light'}">
                        <div class="w-4 h-4 rounded-full bg-white transition-transform {$theme === 'dark' ? 'translate-x-6' : 'translate-x-0'} shadow-sm"></div>
                    </div>
                </button>
            </div>
        </div>

        <div>
            <h3 class="text-xs font-bold text-caption uppercase tracking-wider px-2 mb-4">Authentication & SSO</h3>
            <div class="bg-card border border-border-light rounded-[24px] overflow-hidden shadow-soft transition-colors p-5">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-card-elevated flex items-center justify-center overflow-hidden p-1 shrink-0">
                        <img src="/logo-xepeng.png" alt="Xepeng Logo" class="w-full h-full object-contain" onerror={(e) => (e.currentTarget as HTMLElement).style.display='none'} />
                    </div>
                    <div>
                        <span class="text-sm font-bold text-main block">Xepeng Payment</span>
                        {#if isConnected}
                            <span class="mt-0.5 flex items-center gap-1 text-xs font-semibold text-green-500">
                                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                Connected
                            </span>
                        {:else}
                            <span class="text-[10px] text-caption font-medium">Automated payment authorization</span>
                        {/if}
                    </div>
                </div>

                {#if isLoading}
                    <button disabled class="w-full bg-brand/50 flex justify-center items-center gap-2 rounded-xl py-3 text-sm font-semibold text-white">
                        <svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </button>
                {:else if isConnected}
                    <button onclick={handleDisconnect} class="w-full rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/20">
                        Disconnect
                    </button>
                {:else}
                    <button onclick={handleSSOLogin} class="w-full bg-brand hover:bg-brand-hover shadow-sm rounded-xl py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5">
                        Connect SSO
                    </button>
                {/if}
            </div>
        </div>

        <div>
            <h3 class="text-xs font-bold text-caption uppercase tracking-wider px-2 mb-4">Payment Gateways</h3>
            <div class="bg-card border border-border-light rounded-[24px] overflow-hidden divide-y divide-border-light shadow-soft transition-colors">
                {#each $paymentGateways as pg}
                    <div class="p-5 space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-card-elevated flex items-center justify-center overflow-hidden p-1 shrink-0">
                                    <img src="/logo-{pg.id}.png" alt="{pg.name} Logo" class="w-full h-full object-contain" onerror={(e) => (e.currentTarget as HTMLElement).style.display='none'} />
                                </div>
                                <div>
                                    <span class="text-sm font-bold text-main block">{pg?.name}</span>
                                    <span class="text-[10px] text-caption font-medium">{pg?.description}</span>
                                </div>
                            </div>
                            <button 
                                aria-label="Toggle {pg?.name}"
                                onclick={() => requestPGChange(pg)}
                                class="w-12 h-6 rounded-full p-1 transition-colors {pg.enabled ? 'bg-green-500' : 'bg-border-light'}"
                            >
                                <div class="w-4 h-4 rounded-full bg-white transition-transform {pg.enabled ? 'translate-x-6' : 'translate-x-0'} shadow-sm"></div>
                            </button>
                        </div>

                        {#if pg.enabled && pg.allowModeSwitch}
                            <div class="flex gap-2 p-1 bg-card-elevated rounded-xl border border-border-light">
                                <button 
                                    onclick={() => requestModeChange(pg, 'redirect')}
                                    class="flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all {pg.mode === 'redirect' ? 'bg-card text-main shadow-sm border border-border-light' : 'text-caption'}"
                                >
                                    Redirect
                                </button>
                                <button 
                                    onclick={() => requestModeChange(pg, 'direct')}
                                    class="flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all {pg.mode === 'direct' ? 'bg-card text-main shadow-sm border border-border-light' : 'text-caption'}"
                                >
                                    Direct
                                </button>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

    </div>
    </div>
</div>

{#if showPGModal}
    <div class="fixed inset-0 z-100 flex items-center justify-center px-6">
        <div role="button" tabindex="0" class="absolute inset-0 bg-main/60 backdrop-blur-sm" onclick={() => showPGModal = false} onkeydown={(e) => e.key === 'Enter' && (showPGModal = false)} aria-label="Close"></div>
        <div in:fly={{ y: 20 }} class="relative bg-card rounded-[32px] p-8 w-full max-w-sm text-center border border-border-light shadow-2xl">
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
        <div in:fly={{ y: 20 }} class="relative bg-card rounded-[32px] p-8 w-full max-w-sm text-center border border-border-light shadow-2xl">
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
