<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { OAuthClient } from 'xepeng-oauth-js';
    import { PUBLIC_XEPENG_CLIENT_ID, PUBLIC_XEPENG_CLIENT_SECRET } from '$env/static/public';

    let errorMsg = $state('');

    onMount(async () => {
        if (browser) {
            if (!PUBLIC_XEPENG_CLIENT_ID || !PUBLIC_XEPENG_CLIENT_SECRET) {
                errorMsg = 'Kredensial SSO belum dikonfigurasi di file .env!';
                return;
            }

            try {
                const oauth = new OAuthClient({
                    clientId: PUBLIC_XEPENG_CLIENT_ID,
                    clientSecret: PUBLIC_XEPENG_CLIENT_SECRET,
                    baseUrl: 'https://staging-app.xepeng.com',
                    redirectUri: `${window.location.origin}/auth/callback`,
                    storage: 'localStorage',
                    scopes: ['profile', 'email']
                });

                // Menangani callback otomatis
                const response = await oauth.handleCallback();
                
                // Simpan tokens standard
                localStorage.setItem('oauth_tokens', JSON.stringify(response));
                
                // Simpan RAW data untuk debugging user
                localStorage.setItem('xepeng_raw_sso', JSON.stringify(response));
                console.log('Xepeng SSO Raw Response:', response);

                // Redirect kembali ke halaman settings
                window.location.href = '/settings?tab=auth';
            } catch (error: any) {
                console.error('Auth Callback Gagal:', error);
                errorMsg = error.message || 'Terjadi kesalahan saat memproses otorisasi SSO.';
            }
        }
    });
</script>

<div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="bg-card max-w-md w-full rounded-[32px] p-8 md:p-12 shadow-soft border border-border-light text-center">
        {#if errorMsg}
            <div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h2 class="text-xl font-heading font-bold text-main mb-3">Autentikasi Gagal</h2>
            <p class="text-sm text-caption mb-8">{errorMsg}</p>
            <a href="/settings?tab=auth" class="inline-block w-full py-3.5 rounded-full bg-brand text-white font-heading font-semibold text-center text-sm shadow-soft hover:bg-brand-hover transition-colors duration-200">
                Kembali ke Pengaturan
            </a>
        {:else}
            <div class="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg class="animate-spin h-8 w-8 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <h2 class="text-xl font-heading font-bold text-main mb-2">Memproses Otorisasi</h2>
            <p class="text-sm text-caption">Harap tunggu sebentar, kami sedang menukar kredensial akses Anda...</p>
        {/if}
    </div>
</div>
