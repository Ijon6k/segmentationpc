# 08 - Frontend Specification

Version: 1.0

------------------------------------------------------------------------

# Purpose

Dokumen ini mendefinisikan implementasi frontend menggunakan Next.js App
Router. Frontend bertanggung jawab sebagai presentation layer dan tidak
melakukan image processing.

------------------------------------------------------------------------

# Tech Stack

-   Next.js 16
-   React 19
-   Bun
-   Tailwind CSS
-   shadcn/ui
-   Lucide Icons
-   Inter Tight

State management cukup menggunakan React Hooks. Tidak menggunakan Redux,
Zustand, atau library global state karena kompleksitas aplikasi rendah.

------------------------------------------------------------------------

# Responsibilities

Frontend WAJIB:

-   Upload gambar
-   Validasi dasar file
-   Preview gambar
-   Memanggil API backend
-   Menampilkan loading
-   Menampilkan hasil segmentasi
-   Menampilkan tabel perbandingan
-   Menampilkan error

Frontend TIDAK BOLEH:

-   Menjalankan algoritma segmentasi
-   Mengubah hasil backend
-   Menyimpan data permanen

------------------------------------------------------------------------

# Folder Structure

``` text
frontend/

app/
│
├── layout.tsx
├── page.tsx
│
components/
│
├── header/
│     app-header.tsx
│
├── upload/
│     upload-dropzone.tsx
│     upload-preview.tsx
│
├── preprocessing/
│     preprocessing-grid.tsx
│
├── segmentation/
│     result-card.tsx
│     result-grid.tsx
│
├── comparison/
│     comparison-table.tsx
│
├── analysis/
│     analysis-card.tsx
│
└── ui/
      shadcn components

lib/
    api.ts
    constants.ts

types/
    api.ts

hooks/
    use-segmentation.ts
```

------------------------------------------------------------------------

# Page Layout

Hanya terdapat SATU halaman utama.

Urutan:

1.  Header
2.  Upload
3.  Original Image
4.  Pre-processing
5.  Segmentation Grid
6.  Comparison Table
7.  Analysis

Tidak ada sidebar. Tidak ada menu admin. Tidak ada halaman tambahan.

------------------------------------------------------------------------

# Component Principles

-   Small and reusable.
-   Satu komponen memiliki satu tanggung jawab.
-   Hindari file \> 200 baris.
-   Gunakan composition daripada komponen raksasa.

------------------------------------------------------------------------

# API Layer

Seluruh request backend dilakukan melalui:

lib/api.ts

Komponen tidak melakukan fetch secara langsung.

------------------------------------------------------------------------

# Loading States

Saat request berjalan:

-   tombol upload dinonaktifkan
-   tampilkan skeleton pada area hasil
-   tampilkan progress sederhana

Tidak menggunakan spinner fullscreen.

------------------------------------------------------------------------

# Error States

Jika upload gagal:

-   tampilkan alert sederhana
-   jangan menghapus preview gambar

Jika backend gagal:

-   tampilkan pesan error
-   pengguna dapat mencoba kembali

------------------------------------------------------------------------

# Result Grid

Desktop:

3 kolom

Tablet:

2 kolom

Mobile:

1 kolom

Setiap kartu hanya berisi:

-   nama algoritma
-   gambar hasil

Tidak ada statistik berlebihan.

------------------------------------------------------------------------

# Comparison Table

Kolom:

-   Algorithm
-   Execution Time
-   IoU (optional)
-   Dice (optional)
-   Notes

Gunakan tabel sederhana dengan border halus.

------------------------------------------------------------------------

# Theme

Default:

Light

Dark mode bersifat opsional.

------------------------------------------------------------------------

# Styling Rules

-   Tailwind utility classes.
-   Tidak menggunakan CSS framework tambahan.
-   Hindari hardcoded pixel jika tersedia utility Tailwind yang setara.
-   Prioritaskan whitespace daripada dekorasi.

------------------------------------------------------------------------

# Accessibility

-   Keyboard friendly.
-   Focus ring terlihat.
-   Kontras tinggi.
-   Alt text untuk gambar.

------------------------------------------------------------------------

# Acceptance Criteria

Frontend dianggap selesai apabila:

-   Layout mengikuti UI Specification.
-   Seluruh data berasal dari API.
-   Tidak ada image processing di browser.
-   Responsif pada desktop, tablet, dan mobile.
-   Konsisten menggunakan design system yang telah ditentukan.
