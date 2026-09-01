# Masjid Annur Shobar Rahman — Digital Signage

Website statis HTML + CSS + JavaScript yang siap dideploy ke GitHub Pages.

## Fitur
- Jam real-time perangkat.
- Tanggal Masehi + Hijriah.
- Jadwal Subuh, Dzuhur, Ashar, Maghrib, Isya.
- Countdown menuju salat berikutnya.
- Deteksi lokasi browser untuk menghitung jadwal sesuai koordinat perangkat.
- Fallback ke area Ciangsana jika izin lokasi ditolak/tidak tersedia.
- Metode perhitungan **Kementerian Agama Republik Indonesia**.
- Tampilan responsif, fluid, modern, dan minimalis.
- Tombol refresh dan tombol gunakan lokasi saya.
- Informasi masjid, pengumuman, pengingat, dan info infak.

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub.
2. Upload `index.html`, `style.css`, dan `app.js`.
3. Masuk **Settings → Pages**.
4. Pilih **Deploy from a branch**, branch `main`, folder `/root`.
5. Simpan dan tunggu GitHub Pages aktif.

## Catatan penting tentang akurasi
Jadwal salat diambil secara online dari AlAdhan API menggunakan latitude/longitude perangkat dan metode Kementerian Agama RI. Browser hanya dapat memberikan lokasi setelah pengguna memberi izin, dan Geolocation membutuhkan HTTPS pada web modern. Karena itu, GitHub Pages sangat cocok untuk fitur lokasi.

Untuk layar masjid yang dipasang permanen, sebaiknya perangkat diberi izin lokasi dan koneksi internet. Jika izin lokasi gagal, aplikasi menggunakan koordinat cadangan area Ciangsana.

## Kustomisasi
Semua teks pengumuman dapat diubah di `index.html`.
Warna utama ada di bagian `:root` pada `style.css`.
Pengaturan lokasi cadangan dan metode perhitungan ada di `CONFIG` pada `app.js`.

## API
Project ini menggunakan AlAdhan Prayer Times API. Silakan perhatikan ketentuan layanan/API pihak ketiga yang digunakan sebelum pemakaian produksi.
