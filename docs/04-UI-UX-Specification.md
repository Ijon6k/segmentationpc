# 04 - UI / UX Specification

Version: 1.0

------------------------------------------------------------------------

# Purpose

Dokumen ini menjadi acuan visual aplikasi. Tujuannya adalah menghasilkan
antarmuka yang bersih, profesional, dan timeless, tanpa terlihat seperti
template AI generik.

Aplikasi bukan dashboard administrasi, melainkan sebuah tool akademik
dengan satu fokus utama: membandingkan hasil segmentasi citra.

------------------------------------------------------------------------

# Design Philosophy

Keywords

-   Minimalist
-   Premium
-   Elegant
-   Spacious
-   Calm
-   Academic
-   Functional

Aplikasi harus terasa seperti software desktop modern, bukan landing
page marketing dan bukan dashboard SaaS yang penuh widget.

------------------------------------------------------------------------

# What "Not AI Slop" Means

Hindari ciri-ciri desain yang sering muncul dari generator AI.

JANGAN:

-   terlalu banyak card
-   terlalu banyak shadow
-   gradient berlebihan
-   icon di setiap teks
-   border warna-warni
-   statistik palsu
-   sidebar yang tidak diperlukan
-   dashboard penuh grafik yang tidak digunakan
-   tombol besar tanpa fungsi
-   badge berlebihan
-   animasi berlebihan

Gunakan hanya elemen yang memang memiliki fungsi.

------------------------------------------------------------------------

# Visual Style

## Typography

Primary Font

Inter Tight

Menggunakan weight:

-   400
-   500
-   600

Hindari penggunaan terlalu banyak bold.

Gunakan ukuran tipografi yang konsisten.

------------------------------------------------------------------------

## Colors

Background

Pure White

Secondary Background

Gray-50

Primary Text

Gray-950

Secondary Text

Gray-500

Border

Gray-200

Accent

Slate / Zinc

Tidak menggunakan warna mencolok kecuali diperlukan.

------------------------------------------------------------------------

## Spacing

Whitespace adalah elemen utama desain.

Prioritaskan:

-   padding besar
-   section yang lega
-   alignment konsisten
-   grid sederhana

Lebih baik memiliki ruang kosong daripada memenuhi layar dengan
komponen.

------------------------------------------------------------------------

# Component Library

Gunakan shadcn/ui sebagai fondasi.

Komponen boleh dimodifikasi agar sesuai desain.

Apabila komponen bawaan tidak cukup bersih, buat custom component
sendiri.

Tidak menggunakan library dashboard template.

------------------------------------------------------------------------

# Layout

Single Page Application.

Urutan halaman:

1.  Header
2.  Upload Area
3.  Original Image
4.  Pre-processing
5.  Segmentation Results
6.  Comparison Table
7.  Analysis

Tidak ada:

-   Sidebar
-   Multi menu
-   Widget
-   Notification center

------------------------------------------------------------------------

# Header

Sangat sederhana.

Kiri

-   Logo
-   Judul aplikasi

Kanan

-   Theme Toggle (optional)

Tidak ada navbar.

------------------------------------------------------------------------

# Upload Area

Merupakan fokus pertama pengguna.

Komponen:

-   Drag and Drop
-   Upload Button
-   Supported format
-   Preview setelah upload

Desain:

-   border halus
-   rounded-xl
-   tanpa ilustrasi besar

------------------------------------------------------------------------

# Original Image

Menampilkan gambar asli.

Tidak lebih besar dari area kerja.

Gunakan aspect ratio yang dipertahankan.

------------------------------------------------------------------------

# Pre-processing Section

Grid dua kolom.

-   Grayscale
-   Gaussian Blur

Setiap gambar memiliki:

-   Title
-   Preview

Tidak ada caption panjang.

------------------------------------------------------------------------

# Segmentation Results

Grid responsif.

Desktop:

3 kolom.

Tablet:

2 kolom.

Mobile:

1 kolom.

Setiap kartu hanya berisi:

-   Nama algoritma
-   Hasil gambar

Tidak perlu statistik di setiap card.

------------------------------------------------------------------------

# Comparison Table

Satu tabel sederhana.

Kolom:

Algorithm

Execution Time

IoU (optional)

Dice (optional)

Notes

Tidak menggunakan chart kecuali benar-benar dibutuhkan.

------------------------------------------------------------------------

# Analysis

Section terakhir.

Berisi:

-   Algoritma terbaik
-   Alasan
-   Kelebihan
-   Kekurangan

Format berupa paragraph sederhana.

------------------------------------------------------------------------

# Motion

Animasi sangat ringan.

Gunakan:

-   fade
-   opacity
-   subtle scale

Durasi maksimal sekitar 150-200 ms.

Tidak menggunakan animasi yang mengganggu.

------------------------------------------------------------------------

# Border Radius

Gunakan konsisten.

rounded-xl

atau

rounded-2xl

Jangan mencampur banyak radius berbeda.

------------------------------------------------------------------------

# Shadows

Gunakan shadow sangat tipis.

Sebagian besar komponen cukup menggunakan border.

------------------------------------------------------------------------

# Icons

Gunakan Lucide.

Icon hanya jika membantu pemahaman.

Jangan menghias setiap heading dengan icon.

------------------------------------------------------------------------

# Responsive Rules

Desktop adalah prioritas.

Tablet tetap nyaman.

Mobile tetap dapat digunakan tanpa mengurangi fungsi.

------------------------------------------------------------------------

# Accessibility

-   Kontras teks tinggi.
-   Fokus keyboard terlihat.
-   Tombol memiliki area klik memadai.
-   Alt text pada gambar.

------------------------------------------------------------------------

# Design References

Nuansa yang ingin dicapai:

-   Linear
-   Raycast
-   Arc Browser
-   Vercel Dashboard
-   Apple Developer
-   GitHub
-   Notion

Inspirasi hanya pada kualitas visual, bukan menyalin layout.

------------------------------------------------------------------------

# Acceptance Criteria

UI dianggap selesai apabila:

-   bersih
-   konsisten
-   whitespace cukup
-   tidak terasa seperti dashboard template
-   tidak terasa seperti hasil generator AI
-   seluruh fitur tugas mudah ditemukan dalam satu halaman
-   fokus pengguna langsung menuju proses segmentasi
