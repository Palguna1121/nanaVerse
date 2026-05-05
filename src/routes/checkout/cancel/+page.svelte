<script lang="ts">
    import { fly } from 'svelte/transition';
</script>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-linear-to-b from-transparent to-warm-bg/30">
    <div 
        in:fly={{ y: 30, duration: 600 }}
        class="bg-card max-w-xl w-full rounded-[40px] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border-light text-center relative overflow-hidden"
    >
        <!-- Premium Glow Effects -->
        <div class="absolute -top-20 -right-20 w-60 h-60 bg-red-500/15 rounded-full blur-[80px]"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-brand/15 rounded-full blur-[80px]"></div>

        <!-- Cancel Icon with rich animation -->
        <div class="w-24 h-24 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 relative -rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </div>

        <h1 class="text-3xl md:text-4xl font-heading font-bold text-main mb-3 tracking-tight leading-tight">Pembayaran Dibatalkan</h1>
        <p class="text-muted font-body text-base md:text-lg mb-10 max-w-md mx-auto">
            Proses transaksi Anda telah dihentikan. Semua item di keranjang belanja Anda tetap tersimpan dengan aman.
        </p>

        <!-- Transaction Summary - Premium Design -->
        <div class="bg-card-elevated rounded-[24px] p-6 md:p-8 border border-border-light mb-10 text-left relative z-10">
            <h3 class="text-sm font-heading font-bold text-main uppercase tracking-wider mb-4 pb-2 border-b border-border-light/50">Ringkasan</h3>
            
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <span class="text-caption text-sm font-body">Status Transaksi</span>
                    <span class="flex items-center gap-2 font-semibold text-red-500 font-body text-sm">
                        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Batal / Gagal
                    </span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-caption text-sm font-body">Tindakan</span>
                    <span class="text-main font-medium font-body text-sm">Tidak ada saldo yang terpotong</span>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 relative z-10">
            <a 
                href="/checkout" 
                class="flex-1 py-4 rounded-full bg-brand text-white font-heading font-semibold text-center text-base shadow-soft hover:bg-brand-hover hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
                Coba Bayar Lagi
            </a>
            <a 
                href="/" 
                class="flex-1 py-4 rounded-full bg-card-elevated text-muted border border-border-light font-heading font-semibold text-center text-base hover:text-main hover:border-brand/30 transition-all duration-200"
            >
                Kembali Belanja
            </a>
        </div>
    </div>
</div>
