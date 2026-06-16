<div align="center">
  
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sprout.svg" alt="Logo" width="80" height="80">

  <h1 align="center">Central Melon SmartFarm B2B</h1>

  <p align="center">
    <strong>Sistem Informasi Manajemen Cerdas untuk Distribusi Melon B2B Premium</strong><br>
    <em>Dilengkapi dengan Dashboard Terpisah (Admin & Supplier), Simulasi AI, dan Transaksi Internal.</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  </p>
</div>

<br><hr><br>

## Tim Pengembang (Kelompok 5 Praktikum Database)

Proyek ini dikembangkan dan disusun oleh:

<table width="100%">
  <tr align="center" style="background-color: #f8f9fa;">
    <th width="10%">No</th>
    <th width="60%">Nama Mahasiswa</th>
    <th width="30%">NIM</th>
  </tr>
  <tr align="center">
    <td>1</td>
    <td align="left"><strong>Rafiq Alhariri Andriansyah</strong></td>
    <td><code>240605110178</code></td>
  </tr>
  <tr align="center">
    <td>2</td>
    <td align="left"><strong>Toni Abiyu Daffa</strong></td>
    <td><code>240506110163</code></td>
  </tr>
  <tr align="center">
    <td>3</td>
    <td align="left"><strong>Muhammad Aditya Dermawan</strong></td>
    <td><code>240605110172</code></td>
  </tr>
</table>

<br>

## Fitur Utama

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>Panel Admin (Manajemen)</h3>
      <ul>
        <li>Monitoring Penjualan Real-Time</li>
        <li>Manajemen Request For Quotation (RFQ)</li>
        <li>Kelola Produk & Harga</li>
        <li>Prediksi Panen Cerdas (Machine Learning)</li>
        <li>Simulasi Logistik & Kualitas (Runge-Kutta)</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>Panel Supplier (B2B Partner)</h3>
      <ul>
        <li>Katalog Produk Premium Terintegrasi</li>
        <li>Checkout RFQ Langsung di Aplikasi</li>
        <li>Lacak Status Pengajuan (Pending/Accepted)</li>
        <li>Daftar Kontrak Suplai & Harga Terkunci</li>
      </ul>
    </td>
  </tr>
</table>

<br>

## Cara Menjalankan Project (Panduan Lengkap)

Project ini sangat mudah dijalankan. Cukup ikuti langkah-langkah di bawah ini:

### Persiapan Sistem
1. Pastikan **Node.js** (v18+) sudah terinstall.
2. Pastikan **XAMPP** atau MySQL Server sudah terinstall dan berjalan.

### 1. Clone & Install Dependencies
Buka terminal/command prompt, lalu jalankan:

```bash
# Clone repository
git clone https://github.com/your-repo/centralmelon-smartfarm.git

# Masuk ke folder project
cd centralmelon-smartfarm

# Install semua library yang dibutuhkan
npm install
```

### 2. Konfigurasi Database

1. Buka XAMPP dan **Start MySQL**.
2. Buka PhpMyAdmin (`http://localhost/phpmyadmin`).
3. Anda memiliki **dua opsi** untuk mengatur database:

#### Opsi A: Import Langsung (Paling Mudah!)
- Buat database baru bernama `centralmelon_db`.
- Klik tab **Import**, lalu pilih file `centralmelon_db.sql` yang ada di dalam folder project ini.
- Selesai! Semua tabel dan data dummy sudah terisi.

#### Opsi B: Menggunakan Prisma Migrate
Jika Anda ingin generate dari awal menggunakan Prisma, siapkan file `.env`:

```env
# Buat file .env di folder project utama dan isi dengan ini:
DATABASE_URL="mysql://root:@localhost:3306/centralmelon_db"
JWT_SECRET="centralmelon_super_secret_key_2026"
```
Kemudian jalankan perintah berikut di terminal:
```bash
npx prisma generate
npx prisma db push
```

### 3. Jalankan Aplikasi
Setelah database siap, saatnya menyalakan server lokal:

```bash
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

<br>

## Akses Login Default

Gunakan kredensial ini untuk menguji fitur otentikasi dan mencoba dashboard:

<table width="100%">
  <tr align="center" style="background-color: #f8f9fa;">
    <th>Role / Peran</th>
    <th>Email</th>
    <th>Password</th>
    <th>Dashboard URL</th>
  </tr>
  <tr align="center">
    <td><b>Admin</b></td>
    <td><code>admin@centralmelon.com</code></td>
    <td><code>password123</code></td>
    <td><code>/dashboard</code></td>
  </tr>
  <tr align="center">
    <td><b>Supplier</b></td>
    <td><code>budi@supplier.com</code></td>
    <td><code>password123</code></td>
    <td><code>/supplier</code></td>
  </tr>
</table>

*(Catatan: Anda juga dapat membuat akun supplier baru secara langsung melalui halaman Register di website.)*

<br><hr><br>

<div align="center">
  <p>Dibuat oleh Kelompok 5.</p>
</div>
