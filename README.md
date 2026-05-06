# NanaVerse 🚀

**NanaVerse** adalah aplikasi demo e-commerce modern yang dibangun menggunakan **SvelteKit**. Aplikasi ini dirancang untuk mendemonstrasikan integrasi berbagai *payment gateway* populer seperti **Xepeng (Crypto)** dan **iPaymu**, dengan antarmuka yang sangat premium, responsif, dan mendukung fitur mode gelap/terang secara dinamis.

## 🛠️ Tech Stack

- **Framework**: SvelteKit (Svelte 5 Runes)
- **Styling**: Tailwind CSS 4.0
- **State Management**: Svelte Stores
- **Payment SDKs**: 
  - `xepeng-oauth-js` v1.1.2
  - `ipaymu-nodejs-api`
  - `midtrans-client` (Optional)

---

## ⚙️ Instalasi & Setup

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di mesin lokal Anda:

### 1. Clone & Install Dependencies
Pastikan Anda sudah menginstal [Bun](https://bun.sh/) atau Node.js di sistem Anda.

```bash
# Clone repositori
git clone git@github.com:Palguna1121/nanaVerse.git
cd svelte_demo_mart

# Install dependensi menggunakan Bun
bun install
```

### 2. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan isi kredensial API Anda.

```bash
cp .env.example .env
```

Isi variabel berikut di dalam `.env`:
- `PUBLIC_XEPENG_CLIENT_ID`: Client ID aplikasi Xepeng Anda.
- `PUBLIC_XEPENG_CLIENT_SECRET`: Client Secret aplikasi Xepeng Anda.
- `PUBLIC_IPAYMU_VA`: Virtual Account iPaymu.
- `PUBLIC_IPAYMU_API_KEY`: API Key iPaymu.

### 3. Jalankan Aplikasi
```bash
# Mode Development
bun dev

# Buka di browser: http://localhost:5173
```

---

## 💳 Alur Pembayaran (Payment Flows)

Aplikasi ini memiliki alur pembayaran yang cerdas dan terintegrasi:

### 1. Xepeng (SSO & Crypto Integration)
Xepeng menggunakan alur **OAuth 2.0 + PKCE** yang sangat aman.
- **SSO Connection**: User harus menghubungkan akun Xepeng melalui halaman **Settings > Auth & SSO**.
- **Authorization**: Aplikasi melakukan redirect ke server Xepeng untuk mendapatkan otorisasi.
- **Credential Exchange**: Setelah sukses, server Xepeng mengembalikan `client_id` dan `client_secret` unik untuk integrasi merchant.
- **Checkout**: Saat checkout, aplikasi menggunakan kredensial tersebut untuk:
  1. Membuat Order (`create`).
  2. Mengaktifkan Order (`update` status ke `active`).
  3. Membuat Link Pembayaran (`generate payment link`).
  4. User melakukan pembayaran melalui link Xepeng.

### 2. iPaymu
Mendukung dua mode integrasi:
- **Redirect Mode**: User akan diarahkan ke halaman pembayaran iPaymu.
- **Direct Mode**: User dapat memilih metode pembayaran (QRIS, VA BCA, VA Mandiri, Alfamart) langsung di dalam aplikasi NanaVerse tanpa meninggalkan halaman checkout.

---

## 🚀 Build & Deployment

Aplikasi ini menggunakan **Dual Adapter Strategy**:
- **Local Build**: Menggunakan `@sveltejs/adapter-static` untuk hasil build statis di folder `build/`.
- **Production (Cloudflare)**: Menggunakan `@sveltejs/adapter-cloudflare` secara otomatis jika mendeteksi environment `CF_PAGES`. Ini diperlukan agar API Routes (SSR) dapat berjalan di Cloudflare Workers.

### ⚙️ Pengaturan di Dashboard Cloudflare Pages:
Agar deployment berhasil, pastikan pengaturan di dashboard Cloudflare Pages Anda adalah sebagai berikut:
- **Framework Preset**: `SvelteKit`
- **Build Command**: `bun run build`
- **Output Directory**: `.svelte-kit/cloudflare`
- **Deploy Command**: (Kosongkan/Hapus jika ada)
- **Environment Variables**: Masukkan semua variabel dari `.env.example` ke bagian Settings > Variables.

Untuk membuat build produksi secara lokal:

```bash
# Build aplikasi
bun run build

# Preview build produksi
bun run preview
```

Hasil build akan berada di folder `build/` (menggunakan `@sveltejs/adapter-static` untuk performa maksimal).

---

## 🎨 Fitur Utama

- **Responsive Design**: Pengalaman belanja yang mulus baik di desktop maupun mobile.
- **Real-time Validation**: Validasi koneksi SSO sebelum mengizinkan checkout menggunakan Xepeng.
- **Premium UI**: Animasi halus menggunakan `svelte/transition` dan desain kartu yang modern.

---

Dibuat oleh [Palguna1121](https://github.com/Palguna1121)
