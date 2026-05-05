<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { onMount } from 'svelte';

    let { message = '', visible = false, onComplete }: { message?: string, visible?: boolean, onComplete: () => void } = $props();

    $effect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onComplete();
            }, 3000);
            return () => clearTimeout(timer);
        }
    });
</script>

{#if visible}
    <div 
        in:fly={{ y: 20, duration: 300 }}
        out:fade={{ duration: 200 }}
        class="fixed top-24 right-6 lg:right-10 z-50 flex items-center gap-3 bg-card px-5 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border-light max-w-sm"
    >
        <svg class="w-5 h-5 text-green-500 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <p class="text-sm font-normal text-main">{message}</p>
    </div>
{/if}
