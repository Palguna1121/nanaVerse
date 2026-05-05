<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { theme } from '$lib/stores/theme';
    let location = $state('New York, USA');

    function toggleTheme() {
        theme.update(t => t === 'dark' ? 'light' : 'dark');
    }
</script>

<div class="lg:hidden pb-32">
    <div class="px-6">
        <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-heading font-bold text-main">Profile</h1>
        <button class="w-10 h-10 rounded-full bg-card-elevated border border-border-light flex items-center justify-center text-main">
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
            <h3 class="text-xs font-bold text-caption uppercase tracking-wider px-2 mb-4">Personal Info</h3>
            <div class="bg-card border border-border-light rounded-[24px] overflow-hidden divide-y divide-border-light shadow-soft transition-colors">
                <div class="p-5 flex items-center justify-between active:bg-card-elevated transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-card-elevated flex items-center justify-center text-main">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <span class="text-sm font-bold text-main">Edit Profile</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-caption"><path d="m9 18 6-6-6-6"/></svg>
                </div>
                <div class="p-5 flex items-center justify-between active:bg-card-elevated transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-card-elevated flex items-center justify-center text-main">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <span class="text-sm font-bold text-main">Shipping Address</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-caption"><path d="m9 18 6-6-6-6"/></svg>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <button class="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold text-sm active:scale-95 transition-all">Logout Account</button>
        </div>
    </div>
    </div>
</div>
