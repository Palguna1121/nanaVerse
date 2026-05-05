export interface Product {
    id: number;
    name: string;
    category: 'tech' | 'fashion';
    is_new: boolean;
    is_promo: boolean;
    description: string;
    price: number;
    image: string;
}

export const products: Product[] = [
    // TECHNOLOGY (15)
    { id: 1, name: 'Smart Watch Pro', category: 'tech', is_new: true, is_promo: false, description: 'Jam tangan pintar dengan pemantauan kesehatan lengkap.', price: 750000, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, name: 'Wireless Earbuds', category: 'tech', is_new: false, is_promo: true, description: 'Suara jernih dengan noise cancellation aktif.', price: 450000, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, name: 'Powerbank 20000mAh', category: 'tech', is_new: false, is_promo: false, description: 'Pengisian cepat untuk semua perangkat Anda.', price: 300000, image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80&w=1000&auto=format&fit=crop' },
    { id: 4, name: 'Mechanical Keyboard', category: 'tech', is_new: true, is_promo: false, description: 'Keyboard mekanik dengan RGB backlight.', price: 1200000, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop' },
    { id: 5, name: 'Gaming Mouse', category: 'tech', is_new: false, is_promo: true, description: 'Mouse gaming dengan DPI tinggi dan desain ergonomis.', price: 350000, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop' },
    { id: 6, name: 'Laptop Stand', category: 'tech', is_new: false, is_promo: false, description: 'Stand laptop aluminium yang kokoh dan dilipat.', price: 200000, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop' },
    { id: 7, name: 'Ultra HD Monitor 27"', category: 'tech', is_new: true, is_promo: true, description: 'Monitor bezel-less untuk pengalaman visual yang luas.', price: 3500000, image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1000&auto=format&fit=crop' },
    { id: 8, name: 'Bluetooth Speaker', category: 'tech', is_new: false, is_promo: false, description: 'Speaker portable dengan bass yang mendalam.', price: 550000, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop' },
    { id: 9, name: 'Ergonomic Chair', category: 'tech', is_new: false, is_promo: true, description: 'Kursi ergonomis untuk menunjang postur tubuh.', price: 2500000, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop' },
    { id: 10, name: 'USB-C Hub', category: 'tech', is_new: false, is_promo: false, description: 'Multi-port hub untuk produktivitas maksimal.', price: 450000, image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop' },
    { id: 11, name: 'Noise Cancelling Headset', category: 'tech', is_new: true, is_promo: false, description: 'Fokus maksimal tanpa gangguan suara luar.', price: 1800000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop' },
    { id: 12, name: 'Wireless Charger', category: 'tech', is_new: false, is_promo: true, description: 'Pengisian daya nirkabel yang cepat dan elegan.', price: 250000, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop' },
    { id: 13, name: 'Smart Desk Lamp', category: 'tech', is_new: true, is_promo: false, description: 'Lampu kerja dengan penyesuaian suhu warna.', price: 400000, image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1000&auto=format&fit=crop' },
    { id: 14, name: 'Portable SSD 1TB', category: 'tech', is_new: false, is_promo: false, description: 'Penyimpanan ultra cepat dan ringan.', price: 1500000, image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?q=80&w=1000&auto=format&fit=crop' },
    { id: 15, name: 'Webcam 4K', category: 'tech', is_new: true, is_promo: true, description: 'Kualitas video sejernih kristal untuk meeting.', price: 1200000, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop' },

    // FASHION (15)
    { id: 16, name: 'Minimalist Cotton Tee', category: 'fashion', is_new: true, is_promo: false, description: 'Kaos katun organik yang nyaman dipakai harian.', price: 150000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop' },
    { id: 17, name: 'Classic Denim Jacket', category: 'fashion', is_new: false, is_promo: true, description: 'Jaket denim timeless untuk segala suasana.', price: 450000, image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop' },
    { id: 18, name: 'Linen Trousers', category: 'fashion', is_new: true, is_promo: false, description: 'Celana linen yang sejuk dan bernapas.', price: 350000, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop' },
    { id: 19, name: 'Wool Blend Coat', category: 'fashion', is_new: false, is_promo: false, description: 'Mantel elegan untuk cuaca dingin.', price: 850000, image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000&auto=format&fit=crop' },
    { id: 20, name: 'Leather Crossbody Bag', category: 'fashion', is_new: false, is_promo: true, description: 'Tas selempang kulit asli dengan desain minimalis.', price: 600000, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop' },
    { id: 21, name: 'White Canvas Sneakers', category: 'fashion', is_new: true, is_promo: false, description: 'Sepatu kasual klasik untuk gaya santai.', price: 400000, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop' },
    { id: 22, name: 'Silk Scarf', category: 'fashion', is_new: false, is_promo: true, description: 'Syal sutra premium dengan sentuhan lembut.', price: 250000, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop' },
    { id: 23, name: 'Oversized Knit Sweater', category: 'fashion', is_new: true, is_promo: true, description: 'Sweater rajut nyaman untuk gaya effortlessly chic.', price: 380000, image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1000&auto=format&fit=crop' },
    { id: 24, name: 'Chino Shorts', category: 'fashion', is_new: false, is_promo: false, description: 'Celana pendek chino untuk akhir pekan.', price: 220000, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000&auto=format&fit=crop' },
    { id: 25, name: 'Polarized Sunglasses', category: 'fashion', is_new: true, is_promo: false, description: 'Kacamata hitam dengan proteksi UV penuh.', price: 300000, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop' },
    { id: 26, name: 'Casual Oxford Shirt', category: 'fashion', is_new: false, is_promo: true, description: 'Kemeja oxford serbaguna untuk formal atau santai.', price: 280000, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop' },
    { id: 27, name: 'Leather Chelsea Boots', category: 'fashion', is_new: true, is_promo: false, description: 'Sepatu boots kulit yang awet dan stylish.', price: 950000, image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop' },
    { id: 28, name: 'Pleated Midi Skirt', category: 'fashion', is_new: false, is_promo: false, description: 'Rok plisket anggun yang mudah dipadukan.', price: 320000, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop' },
    { id: 29, name: 'Canvas Tote Bag', category: 'fashion', is_new: true, is_promo: true, description: 'Tas jinjing kanvas kuat untuk belanja.', price: 120000, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop' },
    { id: 30, name: 'Ribbed Beanie', category: 'fashion', is_new: false, is_promo: false, description: 'Topi kupluk hangat dengan bahan rajut.', price: 85000, image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop' },
];
