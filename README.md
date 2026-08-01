# Dev Pass

Aplikasi mobile pembangkit kata sandi dan token acak yang aman. Pengguna
menentukan panjang sandi dan kategori karakter yang diikutsertakan, lalu
aplikasi menghasilkan kata sandi acak sekaligus menilai kekuatannya.

**Pemegang Hak Cipta:** Universitas Insan Mahardika
**Identitas aplikasi (Android):** `ac.id.mahardika.devpass`
**Versi:** 1.0.0

## Fitur

- Pengaturan panjang kata sandi melalui kontrol geser (minimal 8 karakter).
- Pemilihan kategori karakter: huruf kecil, huruf besar, angka, dan simbol.
- Jaminan minimal satu karakter dari setiap kategori yang diaktifkan, sehingga
  hasil selalu memenuhi kriteria yang dipilih.
- Indikator kekuatan sandi (*complexity matrix*) yang dihitung dari panjang dan
  ragam karakter.
- Salin hasil ke papan klip satu ketuk, dengan umpan balik keberhasilan/kegagalan.
- Antarmuka bertema *cyber security* dengan mode gelap.

## Teknologi

- React Native 0.85 dengan Expo SDK 56
- `@react-native-community/slider` untuk kontrol panjang sandi
- `expo-clipboard` untuk operasi papan klip

## Menjalankan Proyek

```bash
npm install          # pasang dependensi
npm start            # jalankan Metro bundler (Expo)
npm run android      # bangun & jalankan di perangkat/emulator Android
```

## Struktur

| Berkas | Keterangan |
| --- | --- |
| `App.js` | Logika pembangkit sandi, penilaian kekuatan, antarmuka, dan gaya |
| `index.js` | Titik masuk aplikasi (`registerRootComponent`) |
| `app.json` | Konfigurasi Expo: nama, ikon, splash, paket Android |
| `assets/` | Ikon aplikasi dan gambar splash |

## Lisensi

Hak Cipta © 2026 Universitas Insan Mahardika. Seluruh hak dilindungi
undang-undang. Lihat berkas [LICENSE](LICENSE).
