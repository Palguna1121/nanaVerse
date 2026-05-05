<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { theme, toggleTheme } from '$lib/stores/theme';
	import { cartCount } from '$lib/stores/cart';

	let isAllActive = $derived(
		browser ? !$page.url.searchParams.has('promo') && !$page.url.searchParams.has('new') : true
	);
	let isPromoActive = $derived(browser ? $page.url.searchParams.has('promo') : false);
	let isNewActive = $derived(browser ? $page.url.searchParams.has('new') : false);
</script>

<header class="bg-card border-border-light sticky top-0 z-50 h-20 border-b shadow-sm hidden lg:block">
	<div class="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
		<div class="flex items-center gap-4 flex-1">
			<a href="/" class="font-heading text-main text-xl font-bold tracking-tight shrink-0"
				>nana<span class="text-brand">Verse</span></a
			>
			
			<div class="relative w-full max-w-xs hidden lg:block ml-4">
				<form action="/search" method="GET">
					<span class="absolute top-1/2 left-4 -translate-y-1/2 text-muted">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
					</span>
					<input 
						type="text" 
						name="q"
						placeholder="Search products..." 
						class="w-full bg-card-elevated border border-border-light rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
					/>
				</form>
			</div>
		</div>

		<div class="flex items-center gap-6">
			<!-- Theme Toggle -->
			<button
				onclick={toggleTheme}
				class="text-muted hover:text-brand bg-card-elevated border-border-light rounded-full border p-2 transition-colors"
			>
				{#if $theme === 'dark'}
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						><path
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						></path></svg
					>
				{:else}
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						><path
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						></path></svg
					>
				{/if}
			</button>

			<a
				href="/settings"
				class="border-border-light hidden items-center gap-3 border-r pr-6 transition-all duration-200 hover:opacity-80 lg:flex"
			>
				<div
					class="bg-card-elevated text-muted border-border-light flex h-10 w-10 items-center justify-center rounded-full border"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"
						></circle></svg
					>
				</div>
				<div class="hidden flex-col sm:flex">
					<p class="text-main text-sm leading-tight font-semibold">Demo User</p>
					<p class="text-caption text-xs leading-tight font-normal">sandbox@payment.com</p>
				</div>
			</a>

			<a
				href="/checkout"
				id="cart-icon"
				class="text-main hover:text-brand hover:border-brand/50 bg-card-elevated border-border-light relative flex items-center justify-center rounded-full border p-2.5 transition-all duration-200"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
					<path d="M3 6h18"></path>
					<path d="M16 10a4 4 0 0 1-8 0"></path>
				</svg>
				{#if $cartCount > 0}
					<span
						class="bg-brand absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm ring-2 ring-white"
						>{$cartCount}</span
					>
				{/if}
			</a>
		</div>
	</div>
</header>
