# Dev Pass

Aplikasi mobile pembangkit kata sandi, PIN, dan token acak yang aman. Pengguna
menentukan tipe keluaran, panjang, dan kategori karakter; aplikasi membangkitkan
nilai acak di perangkat lalu menilai kekuatannya berdasarkan entropi.

**Pemegang Hak Cipta:** Universitas Insan Mahardika
**Identitas aplikasi (Android):** `ac.id.mahardika.devpass`
**Versi:** 1.0.0

## Fitur

- **Tiga tipe keluaran** dengan rentang panjangnya masing-masing (lihat tabel di bawah).
- **Sumber acak kriptografis** melalui `expo-crypto` (bukan `Math.random`), dengan
  *rejection sampling* agar tidak ada karakter yang berpeluang lebih besar muncul.
- **Jaminan komposisi**: minimal satu karakter dari setiap kategori yang aktif.
- **Analisis kekuatan berbasis entropi**: nilai bit, tingkat (Lemah → Sangat Kuat),
  dan perkiraan waktu bobol dengan asumsi 10 miliar tebakan per detik.
- **Pengatur panjang ganda**: penggeser untuk perubahan cepat, tombol `−` / `+`
  untuk penyetelan presisi.
- **Riwayat 8 hasil terakhir**; ketuk satu baris untuk menyalinnya kembali.
- **Salin sekali ketuk** ke papan klip dengan notifikasi dan umpan balik getar.
- Antarmuka gelap dengan aksen warna resmi universitas dan penanganan *safe area*.

| Tipe | Rentang | Langkah | Kumpulan karakter |
| --- | --- | --- | --- |
| Sandi | 8–64 | 1 | Sesuai kategori yang diaktifkan |
| PIN | 4–12 | 1 | `0-9` |
| Token | 8–32 | 4 | `A-Z0-9`, dipisah `-` tiap 4 karakter |

Kategori karakter terakhir yang aktif tidak dapat dimatikan, sehingga aplikasi
tidak pernah berada dalam keadaan tanpa keluaran.

## Teknologi

- React Native 0.85 dengan Expo SDK 56
- `expo-crypto` — sumber bilangan acak kriptografis
- `expo-clipboard` — operasi papan klip
- `expo-haptics` — umpan balik getar
- `react-native-safe-area-context` — batas aman layar (mode *edge-to-edge*)
- `@react-native-community/slider` — kontrol panjang

## Menjalankan Proyek

```bash
npm install          # pasang dependensi
npm start            # jalankan Metro bundler (Expo)
npm run android      # bangun & jalankan di perangkat/emulator Android
npm run ios          # bangun & jalankan di perangkat/simulator iOS
```

## Struktur

| Berkas / Folder | Keterangan |
| --- | --- |
| `index.js` | Titik masuk aplikasi (`registerRootComponent`) |
| `App.js` | Akar aplikasi: penyedia *safe area* dan bilah status |
| `src/theme.js` | Sistem desain: warna, jarak, radius, tipografi |
| `src/lib/random.js` | Sumber acak kriptografis (kolam entropi, `randomInt`, `shuffle`) |
| `src/lib/generator.js` | Kumpulan karakter, rentang panjang, dan pembangkit sandi/PIN/token |
| `src/lib/strength.js` | Perhitungan entropi, tingkat kekuatan, dan perkiraan waktu bobol |
| `src/lib/feedback.js` | Pembungkus getaran yang aman gagal |
| `src/lib/levelColor.js` | Pemetaan tingkat kekuatan ke warna |
| `src/hooks/useGenerator.js` | Seluruh state dan aksi aplikasi |
| `src/components/` | Komponen antarmuka (kartu hasil, pemilih tipe, riwayat, dll.) |
| `src/screens/GeneratorScreen.js` | Susunan layar |
| `app.json` | Konfigurasi Expo: nama, ikon, splash, paket Android |
| `assets/` | Ikon aplikasi dan gambar splash |

Logika di `src/lib` murni dan tidak bergantung pada komponen antarmuka, sehingga
dapat diuji terpisah.

## Catatan Keamanan

Seluruh nilai dibangkitkan di perangkat dan tidak pernah dikirim ke jaringan.
Riwayat hanya disimpan di memori dan hilang saat aplikasi ditutup.

## Lisensi

Hak Cipta © 2026 Universitas Insan Mahardika. Seluruh hak dilindungi
undang-undang. Lihat berkas [LICENSE](LICENSE).
