# Dev Pass

Aplikasi mobile pembangkit kata sandi, PIN, dan token acak yang aman. Pengguna
menentukan tipe keluaran, panjang, dan kategori karakter; aplikasi membangkitkan
nilai acak di perangkat lalu menilai kekuatannya berdasarkan entropi.

**Pemegang Hak Cipta:** Universitas Insan Mahardika
**Identitas aplikasi (Android):** `ac.id.mahardika.devpass`
**Versi:** 1.0.0

> Cara memakai aplikasinya ada di [Panduan Penggunaan](PANDUAN.md).

## Fitur

### Pembangkitan

- **Tiga tipe keluaran** — kata sandi, PIN numerik, dan token berformat serial
  (`AB3K-X92P-Q8TR`), masing-masing dengan rentang panjang sendiri.
- **Sumber acak kriptografis** melalui `expo-crypto` yang meneruskan permintaan
  ke penyedia acak sistem operasi, bukan `Math.random`.
- **Pengambilan tanpa bias** dengan *rejection sampling*, sehingga tidak ada
  karakter yang berpeluang lebih besar muncul daripada yang lain.
- **Kolam entropi 1024 byte** — membangkitkan 64 karakter hanya butuh satu
  panggilan native.
- **Jaminan komposisi** — minimal satu karakter dari setiap kategori yang aktif,
  lalu seluruh hasil diacak ulang dengan Fisher-Yates.
- **Penyesuaian panjang otomatis** saat berpindah tipe; panjang token selalu
  dinormalkan ke kelipatan empat.

| Tipe | Rentang | Langkah | Kumpulan karakter |
| --- | --- | --- | --- |
| Sandi | 8–64 | 1 | Sesuai kategori yang diaktifkan |
| PIN | 4–12 | 1 | `0-9` |
| Token | 8–32 | 4 | `A-Z0-9`, dipisah `-` tiap 4 karakter |

### Analisis kekuatan

- **Entropi sesungguhnya** dihitung sebagai `panjang × log2(ukuran pool)` dari
  karakter yang benar-benar terpakai, bukan skor poin buatan.
- **Empat tingkat** mengikuti skala entropi yang lazim: Lemah (<36 bit), Sedang
  (36–59), Kuat (60–79), Sangat Kuat (≥80).
- **Perkiraan waktu bobol** dengan asumsi serangan luring 10 miliar tebakan per
  detik, disajikan dalam satuan yang mudah dibaca.
- Penilaian dihitung dari isi nilai itu sendiri, sehingga entri riwayat pun
  dapat dinilai tanpa menyimpan konfigurasinya.

### Antarmuka

- **Pewarnaan per kelas karakter** pada kartu hasil — huruf putih, angka emas,
  simbol oranye — dengan ukuran huruf yang menyesuaikan panjang nilai.
- **Pengatur panjang ganda**: penggeser untuk perubahan cepat dan tombol
  `−` / `+` untuk penyetelan presisi, lengkap dengan keadaan nonaktif di batas
  rentang.
- **Riwayat 8 hasil terakhir** dengan penanda tipe; ketuk satu baris untuk
  menyalinnya kembali, atau kosongkan seluruhnya.
- **Salin sekali ketuk** ke papan klip disertai notifikasi beranimasi dan umpan
  balik getar.
- **Pencegahan keadaan tidak sah** — kategori karakter terakhir tidak dapat
  dimatikan, sehingga aplikasi tidak pernah menghasilkan nilai kosong.
- Tema gelap dengan aksen warna resmi universitas, penanganan *safe area* untuk
  mode *edge-to-edge*, serta label aksesibilitas pada seluruh kontrol.

## Yang Diperbaiki pada Desain Ulang

Versi sebelumnya berupa satu berkas `App.js` sepanjang 1.172 baris. Berikut
perubahan yang dikerjakan pada desain ulang ini.

### Keamanan

| Sebelum | Sesudah |
| --- | --- |
| `Math.random()` sebagai sumber acak — keluarannya dapat diprediksi dan tidak layak untuk rahasia | `expo-crypto` yang memakai penyedia acak sistem operasi |
| Indeks karakter diambil dari bilangan pecahan `Math.random()` | Indeks diturunkan dari bilangan bulat 32-bit dengan *rejection sampling*, agar ukuran pool yang tidak membagi habis 2³² tidak menimbulkan bias modulo |

### Cacat fungsional

- **Dua tombol dengan fungsi identik.** `EXECUTE GENERATE` dan
  `RE-GENERATE SOURCE` memanggil `handleGenerate(true)` yang sama persis;
  kini disatukan menjadi satu tombol **Acak Ulang**.
- **Rentang panjang seragam untuk semua tipe.** PIN dipaksa minimal 8 digit dan
  token bisa mencapai 64 karakter. Setiap tipe kini punya rentangnya sendiri,
  dan panjang menyesuaikan otomatis saat tipe diganti.
- **Tipe entri riwayat ditebak dengan regex.** Kata sandi yang kebetulan
  seluruhnya angka dinilai sebagai PIN sehingga kekuatannya salah hitung. Tipe
  kini disimpan bersama entrinya.
- **Keadaan "semua kategori mati"** menghasilkan layar galat dan tombol yang
  dinonaktifkan. Keadaan itu kini mustahil terjadi, sehingga seluruh jalur kode
  penanganannya dapat dihapus.
- **Skor kekuatan ad-hoc** (maksimum 7 poin dari panjang dan ragam karakter)
  tidak mencerminkan ketahanan sesungguhnya, dan token tidak pernah bisa
  bernilai Lemah. Diganti perhitungan entropi.

### Antarmuka dan platform

- `Alert` modal setiap kali menyalin diganti notifikasi ringkas beranimasi yang
  tidak memutus alur kerja.
- Padding bilah status yang dihitung manual (`Platform.OS === 'ios' ? 50 : ...`)
  diganti `react-native-safe-area-context`, sesuai mode *edge-to-edge* yang
  berlaku pada Expo SDK 56.
- Prop `backgroundColor` pada `StatusBar` dihapus karena tidak lagi didukung
  pada SDK 56.
- Warna splash dan ikon adaptif di `app.json` diselaraskan dengan latar tema
  baru.
- Antarmuka bertema terminal berbahasa Inggris (`SYSTEM_KEY_READOUT`,
  `DECRYPTION DEFENSE METRICS`) diganti tata letak berbahasa Indonesia yang
  konsisten dengan dokumentasi proyek.

### Struktur kode

`App.js` yang berisi logika, antarmuka, dan gaya sekaligus dipecah menjadi
lapisan terpisah: logika murni di `src/lib`, state di `src/hooks`, tampilan di
`src/components` dan `src/screens`, serta token desain di `src/theme.js`.
Pemisahan ini membuat logika pembangkitan dapat diuji tanpa merender komponen.

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

Proyek memakai modul native (`expo-crypto`, `expo-haptics`,
`react-native-safe-area-context`), sehingga perubahan dependensi memerlukan
build ulang native — memuat ulang Metro saja tidak cukup.

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
