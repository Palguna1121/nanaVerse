<script lang="ts">
	import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Toast from '$lib/components/Toast.svelte';
    import { onMount } from 'svelte';

    let { children } = $props();

    let showToast = $state(false);
    let toastMessage = $state('');

    onMount(() => {
        const layoutRoot = document.getElementById('layout-root');
        if (layoutRoot) {
            const listener = (e: any) => handleAddToCartEffect(e);
            layoutRoot.addEventListener('add', listener);
            return () => layoutRoot.removeEventListener('add', listener);
        }
    });

    function handleAddToCartEffect(event: any) {
        const { product, x, y } = event.detail;
        
        toastMessage = `${product.name} berhasil ditambahkan ke keranjang!`;
        showToast = true;

        // Fly effect
        const cartIcon = document.getElementById('cart-icon');
        if (!cartIcon) return;
        
        const cartRect = cartIcon.getBoundingClientRect();
        const flyingObj = document.createElement('img');
        flyingObj.src = product.image;
        flyingObj.classList.add('fly-to-cart');
        
        flyingObj.style.top = `${y - 25}px`;
        flyingObj.style.left = `${x - 25}px`;
        document.body.appendChild(flyingObj);

        setTimeout(() => {
            flyingObj.style.top = `${cartRect.top}px`;
            flyingObj.style.left = `${cartRect.left}px`;
            flyingObj.style.transform = 'scale(0.3)';
            flyingObj.style.opacity = '0.5';
        }, 50);

        setTimeout(() => {
            flyingObj.remove();
            // Shake effect on cart icon
            cartIcon.style.transform = 'scale(1.1) rotate(10deg)';
            setTimeout(() => {
                if (cartIcon) cartIcon.style.transform = 'scale(1) rotate(0)';
            }, 200);
        }, 600);
    }
</script>

<div id="layout-root" class="flex flex-col min-h-screen">
    <Navbar />
    
    <div class="flex-1 flex max-w-7xl mx-auto w-full px-6">
        <Sidebar />
        
        <main class="flex-1 py-10 lg:pl-10 relative">
            <Toast 
                message={toastMessage} 
                visible={showToast} 
                onComplete={() => showToast = false} 
            />
            
            {@render children()}
        </main>
    </div>

    <Footer />
</div>
