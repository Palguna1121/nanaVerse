<script lang="ts">
	import { products } from '$lib/data';
	import { fade, fly } from 'svelte/transition';
	import MobileProductCard from '$lib/components/MobileProductCard.svelte';

	let activeType = $state('all'); // all, tech, fashion
	let activeStatus = $state('all'); // all, promo, new

	let displayedProducts = $derived(
		products.filter((p) => {
			// Category filter
			if (activeType !== 'all' && p.category !== activeType) return false;

			// Status filter
			if (activeStatus === 'promo' && !p.is_promo) return false;
			if (activeStatus === 'new' && !p.is_new) return false;

			return true;
		})
	);

	let heroProducts = $derived(products.filter((p) => p.is_new).slice(0, 3));
	let activeHero = $state(0);

	import { onMount } from 'svelte';
	onMount(() => {
		const interval = setInterval(() => {
			activeHero = (activeHero + 1) % heroProducts.length;
		}, 5000);
		return () => clearInterval(interval);
	});
</script>

<div class="pb-32 lg:hidden">
	<div class="px-6">
		<div class="mb-8 flex items-center gap-3">
			<a href="/" class="shrink-0 group">
				<h1 class="font-heading text-main text-lg font-bold tracking-tight group-active:text-brand transition-colors">
					nana<span class="text-brand">Verse</span>
				</h1>
			</a>

			<!-- Search Bar (Link to Search Page) -->
			<a href="/search" class="flex-1 flex gap-2 group">
				<div class="relative flex-1">
					<span class="text-caption absolute top-1/2 left-3 -translate-y-1/2">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
					</span>
					<div class="bg-card-elevated border-border-light text-caption w-full rounded-full border py-2.5 pr-4 pl-9 text-[10px] transition-all group-active:ring-2 group-active:ring-brand/20">
						Search...
					</div>
				</div>
			</a>

			<button
				class="bg-card shadow-soft border-border-light text-main relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
			>
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
					><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path
						d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
					/></svg
				>
				<span class="ring-card absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2"
				></span>
			</button>
		</div>

		<!-- Hero Banner (Mobile Style) -->
		<div class="group relative mb-8 overflow-hidden rounded-[32px]">
			<div
				class="bg-card-elevated border-border-light relative flex min-h-[160px] items-center overflow-hidden border p-6"
			>
				<!-- Background Decoration -->
				<div class="bg-brand/10 absolute -right-10 -bottom-10 h-40 w-40 rounded-full blur-3xl"></div>
				<div class="bg-brand/5 absolute -left-10 -top-10 h-32 w-32 rounded-full blur-2xl"></div>

				<div class="relative z-10 w-1/2">
					<span class="bg-brand/10 text-brand mb-2 inline-block rounded-full px-2.5 py-1 text-[8px] font-bold tracking-widest uppercase">
						Limited Edition
					</span>
					<h2 class="font-heading text-main mb-2 text-2xl leading-tight font-bold">
						{heroProducts[activeHero]?.name.split(' ')[0]} <span class="text-brand">Collection</span>
					</h2>
					<p class="text-caption mb-5 text-[10px] leading-relaxed">Exclusive deals for our premium members this season.</p>
					<button
						class="bg-main shadow-main/20 rounded-xl px-5 py-2.5 text-[10px] font-bold text-white dark:text-card shadow-lg transition-transform active:scale-95"
					>
						Explore Now
					</button>
				</div>
				<div class="relative flex w-1/2 justify-end">
					{#key activeHero}
						<div in:fly={{ x: 20, duration: 500 }} out:fade={{ duration: 200 }}>
							<img
								src={heroProducts[activeHero]?.image}
								alt="Hero"
								class="h-32 w-44 rotate-6 rounded-2xl object-cover shadow-2xl transition-transform duration-700 group-hover:rotate-0"
							/>
						</div>
					{/key}
				</div>
			</div>

			<!-- Dots -->
			<div class="mt-4 flex justify-center gap-2">
				{#each heroProducts as _, i}
					<button
						onclick={() => (activeHero = i)}
						class="h-1.5 rounded-full transition-all duration-500 {activeHero === i
							? 'bg-main w-6'
							: 'bg-main/10 w-1.5'}"
					></button>
				{/each}
			</div>
		</div>

		<!-- Explore Heading -->
		<div class="mb-8">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="font-heading text-main text-lg font-bold tracking-tight">Explore Products</h3>
				<span
					class="text-caption bg-card-elevated border-border-light rounded-lg border px-2 py-1 text-[10px] font-bold"
				>
					{displayedProducts.length} Items
				</span>
			</div>

			<div class="bg-card border-border-light space-y-4 rounded-[24px] border p-4 shadow-sm">
				<!-- Row 1: Type -->
				<div class="flex flex-col gap-2">
					<p class="text-caption ml-1 text-[9px] font-bold tracking-widest uppercase">Category</p>
					<div class="no-scrollbar flex gap-2 overflow-x-auto">
						{#each [{ id: 'all', label: 'All Category' }, { id: 'tech', label: 'Technology' }, { id: 'fashion', label: 'Fashion' }] as type}
							<button
								onclick={() => (activeType = type.id)}
								class="rounded-lg border px-3 py-1.5 text-[10px] font-bold whitespace-nowrap transition-all {activeType ===
								type.id
									? 'bg-main border-main text-white dark:text-card shadow-md'
									: 'text-muted border-border-light hover:border-brand/30 bg-card'}"
							>
								{type.label}
							</button>
						{/each}
					</div>
				</div>

				<div class="bg-border-light/50 mx-1 h-px"></div>

				<!-- Row 2: Status -->
				<div class="flex flex-col gap-2">
					<p class="text-caption ml-1 text-[9px] font-bold tracking-widest uppercase">Status</p>
					<div class="no-scrollbar flex gap-2 overflow-x-auto">
						{#each [{ id: 'all', label: 'All Status' }, { id: 'promo', label: 'On Sale' }, { id: 'new', label: 'New Arrival' }] as status}
							<button
								onclick={() => (activeStatus = status.id)}
								class="rounded-lg border px-3 py-1.5 text-[10px] font-bold whitespace-nowrap transition-all {activeStatus ===
								status.id
									? 'bg-brand border-brand text-white shadow-md'
									: 'text-muted border-border-light hover:border-brand/30 bg-card'}"
							>
								{status.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Product Grid -->
		<div class="grid grid-cols-2 gap-4">
			{#each displayedProducts as product (product.id)}
				<div in:fade={{ duration: 300 }}>
					<MobileProductCard {product} />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
