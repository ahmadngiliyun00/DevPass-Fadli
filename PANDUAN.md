# Panduan Penggunaan Dev Pass

Panduan ini menjelaskan cara memakai aplikasi Dev Pass dari sisi pengguna:
mengenal setiap bagian layar, langkah membuat sandi/PIN/token, membaca analisis
kekuatan, dan memakai riwayat.

Untuk informasi teknis proyek (struktur kode, dependensi, cara membangun),
lihat [README](README.md).

## Daftar Isi

- [Sekilas Aplikasi](#sekilas-aplikasi)
- [Mengenal Layar](#mengenal-layar)
- [Panduan Langkah demi Langkah](#panduan-langkah-demi-langkah)
  - [Membuat kata sandi](#membuat-kata-sandi)
  - [Membuat PIN](#membuat-pin)
  - [Membuat token](#membuat-token)
- [Membaca Analisis Kekuatan](#membaca-analisis-kekuatan)
- [Memakai Riwayat](#memakai-riwayat)
- [Rekomendasi Pengaturan](#rekomendasi-pengaturan)
- [Pertanyaan Umum](#pertanyaan-umum)

## Sekilas Aplikasi

Dev Pass membangkitkan rahasia acak yang sulit ditebak: **kata sandi**, **PIN**,
dan **token** berformat serial. Seluruh proses berjalan di dalam perangkat —
tidak ada data yang dikirim ke internet.

Satu hal yang perlu diketahui sejak awal: **aplikasi membuat nilai baru secara
otomatis** setiap kali kamu mengubah tipe, panjang, atau jenis karakter. Kamu
tidak perlu menekan tombol apa pun untuk melihat hasil pengaturan baru.

## Mengenal Layar

Seluruh aplikasi berada dalam satu layar yang dapat digulir, tersusun dari atas
ke bawah sebagai berikut.

### 1. Kartu Hasil

Bagian paling atas, berisi nilai yang sedang aktif.

- **Label kekuatan** di kanan atas menampilkan tingkat hasil saat ini
  (Lemah / Sedang / Kuat / Sangat Kuat) beserta warnanya.
- **Kotak hasil** menampilkan nilai dengan huruf monospace. Warna karakter
  membantu membacanya:

  | Warna | Jenis karakter |
  | --- | --- |
  | Putih | Huruf `a-z` dan `A-Z` |
  | Emas | Angka `0-9` |
  | Oranye | Simbol `!@#$%^&*()-_=+[]{}:;,.?` |
  | Abu-abu | Tanda hubung pemisah pada token |

  Ukuran huruf mengecil otomatis untuk nilai yang panjang agar tetap muat.
  Kamu juga bisa menekan lama pada nilai untuk menyeleksinya secara manual.
- **Tombol Salin** menyalin nilai ke papan klip.
- **Tombol Acak Ulang** membuat nilai baru dengan pengaturan yang sama persis.

### 2. Tipe Keluaran

Tiga pilihan: **Sandi**, **PIN**, dan **Token**. Keterangan singkat di bawah
tombol menjelaskan tipe yang sedang aktif.

Saat kamu berpindah tipe, panjang menyesuaikan sendiri ke rentang tipe yang
baru. Contoh: dari Sandi 16 karakter berpindah ke PIN, panjang otomatis menjadi
12 karena itulah batas maksimum PIN.

### 3. Panjang

- Angka besar di tengah menunjukkan panjang yang sedang dipakai.
- Tombol **−** dan **+** mengubah panjang satu langkah. Tombol meredup saat
  batas rentang tercapai.
- **Penggeser** dipakai untuk perubahan besar dengan cepat. Nilai baru
  diterapkan saat jari diangkat, sehingga geseran terasa mulus.

| Tipe | Panjang minimum | Panjang maksimum | Kelipatan |
| --- | --- | --- | --- |
| Sandi | 8 | 64 | 1 |
| PIN | 4 | 12 | 1 |
| Token | 8 | 32 | 4 |

### 4. Jenis Karakter

Empat saklar yang menentukan isi kata sandi:

| Saklar | Karakter yang disertakan |
| --- | --- |
| Huruf kecil | `a` sampai `z` |
| Huruf besar | `A` sampai `Z` |
| Angka | `0` sampai `9` |
| Simbol | `! @ # $ % ^ & * ( ) - _ = + [ ] { } : ; , . ?` |

Ketentuan yang berlaku:

- Setiap kategori yang aktif **dijamin muncul minimal satu kali** pada hasil.
- **Kategori terakhir tidak dapat dimatikan.** Jika dicoba, muncul notifikasi
  "Minimal satu jenis karakter harus aktif." Ini menjaga aplikasi agar tidak
  pernah menghasilkan nilai kosong.
- Saklar dinonaktifkan saat tipe PIN atau Token dipilih, karena kedua tipe itu
  memakai kumpulan karakter tetap. Keterangan alasannya muncul di atas daftar.

### 5. Analisis Kekuatan

Empat bilah tingkat, disusul tiga baris statistik: Tingkat, Entropi, dan
Perkiraan waktu bobol. Penjelasan lengkapnya ada di
[bagian berikutnya](#membaca-analisis-kekuatan).

### 6. Riwayat

Delapan hasil terakhir yang kamu simpan, lengkap dengan penanda tipe. Tombol
**Bersihkan** muncul di kanan judul saat riwayat berisi.

## Panduan Langkah demi Langkah

### Membuat kata sandi

1. Pada bagian **Tipe keluaran**, pilih **Sandi**.
2. Atur **Panjang** ke angka yang diminta oleh layanan tujuan. Bila tidak ada
   ketentuan khusus, 16–20 karakter adalah titik aman.
3. Pada **Jenis karakter**, aktifkan kategori yang diizinkan layanan tersebut.
   Semakin banyak kategori aktif, semakin tinggi entropinya.
   > Sebagian layanan menolak simbol tertentu. Bila pendaftaran gagal, matikan
   > saklar **Simbol** lalu tambah panjangnya sebagai gantinya.
4. Periksa **Analisis kekuatan**. Usahakan tingkatnya minimal **Kuat**.
5. Tekan **Salin**. Notifikasi "Tersalin ke papan klip." akan muncul sebentar,
   dan hasilnya otomatis tercatat ke riwayat.
6. Tempel sandi tersebut di kolom pendaftaran atau di pengelola kata sandi.

Belum cocok dengan hasilnya? Tekan **Acak Ulang** untuk memperoleh nilai baru
dengan pengaturan yang sama.

### Membuat PIN

1. Pilih tipe **PIN**.
2. Atur panjang antara 4 sampai 12 digit — ikuti ketentuan perangkat atau kartu
   yang akan memakainya.
3. Tekan **Salin**, lalu masukkan PIN ke perangkat tujuan.

> PIN hanya memakai angka, sehingga entropinya jauh lebih rendah daripada kata
> sandi. PIN 6 digit hanya bernilai sekitar 20 bit. Pakai PIN hanya untuk
> perangkat yang membatasi jumlah percobaan salah, misalnya kartu ATM atau kunci
> layar ponsel.

### Membuat token

1. Pilih tipe **Token**.
2. Atur panjang; nilainya selalu kelipatan 4 karena token dikelompokkan menjadi
   blok empat karakter, misalnya `AB3K-X92P-Q8TR-M4WD`.
3. Tekan **Salin**.

Format ini cocok untuk kunci lisensi, kode undangan, atau pengenal acak yang
perlu dibacakan atau diketik ulang oleh manusia. Tanda hubung hanya pemisah
visual dan tidak dihitung sebagai bagian dari rahasia.

## Membaca Analisis Kekuatan

**Entropi** adalah ukuran seberapa banyak kemungkinan nilai yang harus dicoba
penyerang, dinyatakan dalam bit. Setiap tambahan 1 bit berarti jumlah
kemungkinan berlipat dua. Nilainya dihitung dari panjang dan ragam karakter yang
benar-benar terpakai:

```text
entropi = panjang × log2(jumlah kemungkinan karakter per posisi)
```

Contohnya, sandi 16 karakter yang memakai keempat kategori memiliki 85
kemungkinan karakter per posisi (26 + 26 + 10 + 23), sehingga entropinya sekitar
103 bit.

**Tingkat** ditentukan dari entropi tersebut:

| Tingkat | Entropi | Makna praktis |
| --- | --- | --- |
| Lemah | di bawah 36 bit | Dapat ditebak dalam hitungan menit sampai hari |
| Sedang | 36 – 59 bit | Memadai untuk akun berisiko rendah |
| Kuat | 60 – 79 bit | Aman untuk hampir semua layanan daring |
| Sangat Kuat | 80 bit ke atas | Praktis mustahil ditebak dengan perangkat masa kini |

**Perkiraan waktu bobol** menerjemahkan entropi menjadi satuan waktu dengan
asumsi penyerang mampu mencoba 10 miliar tebakan per detik — kecepatan yang
masuk akal untuk serangan luring terhadap basis data yang bocor. Angka ini
adalah perkiraan kasar untuk membandingkan pilihan, bukan jaminan.

Dua hal yang sering ditanyakan:

- **Menambah panjang lebih ampuh daripada menambah jenis karakter.** Sandi 24
  huruf kecil saja lebih kuat daripada sandi 10 karakter dengan seluruh
  kategori aktif.
- **Kata sandi terpendek yang bisa dibuat aplikasi ini (8 huruf kecil) sudah
  bernilai 38 bit**, jadi tipe Sandi tidak pernah jatuh ke tingkat Lemah.
  Tingkat Lemah hanya muncul pada PIN pendek.

## Memakai Riwayat

Riwayat menyimpan **8 hasil terakhir** dan berguna saat kamu tidak sengaja
menimpa papan klip atau perlu menyalin ulang nilai sebelumnya.

Sebuah nilai masuk riwayat ketika kamu:

- menekan tombol **Salin**, atau
- menekan tombol **Acak Ulang**.

Nilai yang muncul otomatis saat kamu menggeser penggeser **tidak** dicatat,
sehingga riwayat tidak penuh oleh hasil sementara.

Ketentuan lain:

- Ketuk baris mana pun untuk menyalinnya kembali; baris itu akan pindah ke
  posisi teratas.
- Setiap baris menampilkan penanda tipe dengan warna sesuai tingkat kekuatannya.
- Tombol **Bersihkan** mengosongkan seluruh riwayat.
- **Riwayat hanya tersimpan di memori.** Menutup aplikasi akan menghapusnya.
  Ini disengaja: rahasia tidak ditulis ke penyimpanan perangkat.

## Rekomendasi Pengaturan

| Kebutuhan | Tipe | Panjang | Jenis karakter |
| --- | --- | --- | --- |
| Akun email atau perbankan | Sandi | 20–24 | Semua aktif |
| Akun umum / media sosial | Sandi | 16 | Semua aktif |
| Layanan yang menolak simbol | Sandi | 24 | Simbol dimatikan |
| Kata sandi Wi-Fi | Sandi | 20 | Simbol dimatikan agar mudah diketik |
| Kunci layar ponsel | PIN | 6–8 | — |
| Kunci lisensi / kode undangan | Token | 16–20 | — |

## Pertanyaan Umum

**Apakah kata sandi saya dikirim ke server?**
Tidak. Seluruh nilai dibuat di dalam perangkat memakai sumber acak sistem
operasi. Aplikasi ini tidak memiliki akses jaringan sama sekali.

**Mengapa hasilnya berubah saat saya menggeser panjang?**
Karena setiap perubahan pengaturan langsung membuat nilai baru. Selesaikan dulu
seluruh pengaturan, baru tekan **Salin**.

**Saya menekan Salin tapi tidak ada yang tertempel.**
Periksa apakah notifikasi yang muncul bertuliskan "Gagal menyalin." Sebagian
peluncur atau pengelola papan klip pihak ketiga dapat memblokir akses. Sebagai
alternatif, tekan lama pada nilai di kartu hasil untuk menyeleksi dan
menyalinnya secara manual.

**Bisakah saya mengembalikan sandi yang sudah hilang dari riwayat?**
Tidak. Riwayat dibatasi delapan entri dan hilang saat aplikasi ditutup. Simpan
sandi penting di pengelola kata sandi segera setelah dibuat.

**Mengapa saklar jenis karakter tidak bisa disentuh?**
Kamu sedang berada di tipe PIN atau Token, yang memakai kumpulan karakter tetap.
Kembali ke tipe **Sandi** untuk mengaturnya.

**Apakah dua orang bisa mendapat sandi yang sama?**
Secara teori mungkin, tetapi peluangnya dapat diabaikan. Untuk sandi 16 karakter
dengan seluruh kategori aktif, jumlah kemungkinannya sekitar 2¹⁰³.

---

Hak Cipta © 2026 Universitas Insan Mahardika.
