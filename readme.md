# 🛒 Dashboard Admin Pembelian

Dashboard Admin sederhana menggunakan **Node.js**, **Express**, **EJS**, dan **MySQL**. Fitur dasar: menampilkan data pesanan (_orders_), layout admin, dan siap dikembangkan menjadi sistem pembelian lengkap.

> ⚠️ **Catatan:** Proyek ini **belum selesai** karena keterbatasan waktu. Masih banyak fitur yang direncanakan seperti login, CRUD data, dan lainnya yang belum sempat diimplementasikan sepenuhnya.

---

## 📦 Fitur

- Tampilan dashboard responsive (menggunakan Bootstrap)
- Halaman pesanan (_orders_) dari database MySQL
- Fitur **detail order** untuk melihat rincian pesanan
- Tombol **Approve** dan **Reject** untuk memverifikasi pesanan
- Tombol **Finish Order** untuk menyelesaikan pesanan
- Saat pesanan selesai:
  - **Stok dikurangi otomatis** sesuai item yang dipesan
  - **Riwayat perubahan stok** disimpan ke tabel `stock_log`
- Menggunakan template engine **EJS**
- Struktur proyek modular (routes, views, public)
- Koneksi ke database melalui konfigurasi `.env`

---

## 🚀 #Cara Install

## 🛠️ Cara Install & Menjalankan

### 1. Clone Project

```bash
git clone https://github.com/rikydwianto/test_xionco_.git
cd test_xionco_
### Install Dependency

npm install

3. Buat File .env
   Buat file .env di root folder dan isi seperti ini:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dashboard_app

4. Database Import
   DATABASE/bmc_db.sql

```

## ℹ️ Informasi

> _Mohon maaf, proyek ini belum selesai 100% karena keterbatasan waktu._  
> Beberapa fitur sudah disiapkan namun belum sepenuhnya diimplementasikan. Proyek ini tetap dapat dijadikan dasar untuk pengembangan sistem pembelian lebih lanjut.

Saya sangat senang bisa mengikuti test ini — ini menjadi tantangan dan pengalaman berharga bagi saya.  
Namun karena keterbatasan waktu, saya hanya sempat menyelesaikan salah satu dari dua soal yang diberikan, dan itu pun belum tuntas 100%.

Saya sudah berusaha semaksimal mungkin dalam waktu yang ada. Semoga hasil ini tetap dapat memberikan gambaran niat dan kemampuan saya.  
Jika diperlukan, saya sangat terbuka dan akan lebih senang jika bisa berdiskusi langsung dengan Bapak/Ibu terkait proses atau hal-hal teknis lainnya.

Terima kasih atas kesempatan yang diberikan. Semoga saya bisa mendapatkan hasil yang terbaik.
