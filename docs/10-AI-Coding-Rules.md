# 10 - AI Coding Rules

Version: 1.0

> Dokumen ini mengatur cara AI mengembangkan proyek. Jika bertentangan
> dengan dokumen lain, ikuti PRD, API Contract, dan System Architecture.

------------------------------------------------------------------------

# Core Principles

1.  Ikuti requirement, jangan menambah fitur.
2.  Prioritaskan maintainability daripada kecepatan implementasi.
3.  Tulis kode yang mudah dibaca oleh manusia.
4.  Refactor jika struktur mulai memburuk.
5.  Setiap perubahan harus tetap dapat dijalankan melalui Docker
    Compose.

------------------------------------------------------------------------

# Architecture Rules

-   Jangan mengubah arsitektur tanpa instruksi.
-   Frontend hanya presentation layer.
-   Backend hanya business logic.
-   Image processing hanya di backend.
-   Jangan menambahkan database, cache, queue, websocket, atau
    authentication.

------------------------------------------------------------------------

# Clean Code

AI WAJIB:

-   Nama variabel jelas.
-   Nama fungsi berupa kata kerja.
-   Hindari singkatan yang tidak umum.
-   Hindari magic number.
-   Hindari duplikasi.
-   Gunakan early return.
-   Pisahkan business logic dari UI.

AI DILARANG:

-   Fungsi raksasa.
-   Nested if berlebihan.
-   Komentar yang menjelaskan hal yang sudah jelas.

------------------------------------------------------------------------

# File Organization

Target ukuran:

-   Component ≤ 200 baris
-   Service ≤ 250 baris
-   Utility ≤ 150 baris

Jika melebihi, pecah menjadi beberapa file.

Satu file memiliki satu tanggung jawab utama.

------------------------------------------------------------------------

# Component Rules (Frontend)

-   Gunakan functional component.
-   Pecah menjadi komponen kecil.
-   Jangan fetch API langsung dari UI; gunakan lib/api atau custom hook.
-   Gunakan shadcn/ui sebagai fondasi, modifikasi bila perlu agar sesuai
    desain.
-   Gunakan Tailwind utility, bukan CSS terpisah kecuali benar-benar
    diperlukan.

------------------------------------------------------------------------

# Backend Rules

-   Route hanya menerima request dan mengembalikan response.
-   Semua business logic berada di service.
-   Setiap algoritma memiliki file sendiri.
-   Utility tidak boleh bergantung pada route.

------------------------------------------------------------------------

# Dependency Rules

Jangan menambah library jika dapat diselesaikan dengan dependency yang
sudah ada.

Jika perlu dependency baru:

-   jelaskan alasan,
-   gunakan library yang populer,
-   minimalkan ukuran dependency.

------------------------------------------------------------------------

# Error Handling

-   Tangani seluruh error yang diperkirakan.
-   Jangan menampilkan stack trace ke pengguna.
-   Gunakan response JSON yang konsisten.
-   Logging dilakukan di backend, bukan frontend.

------------------------------------------------------------------------

# UI Rules

UI harus:

-   Minimalis
-   Konsisten
-   Banyak whitespace
-   Fokus pada konten

Hindari:

-   Shadow berlebihan
-   Gradient mencolok
-   Animasi berlebihan
-   Dashboard template
-   Card yang tidak memiliki fungsi

------------------------------------------------------------------------

# Performance

-   Hindari render ulang yang tidak perlu.
-   Hindari perhitungan berat di browser.
-   Optimalkan ukuran gambar bila diperlukan.
-   Jangan melakukan request API berulang tanpa alasan.

------------------------------------------------------------------------

# Naming Convention

Frontend

-   PascalCase untuk komponen.
-   camelCase untuk variabel dan fungsi.

Backend

-   snake_case untuk file dan fungsi Python.
-   PascalCase hanya untuk class.

------------------------------------------------------------------------

# Git Rules

Satu phase = satu commit.

Contoh:

feat: bootstrap docker environment feat: implement preprocessing feat:
add threshold segmentation feat: build comparison table

------------------------------------------------------------------------

# Documentation

Jika membuat:

-   endpoint baru,
-   komponen besar,
-   service baru,

perbarui dokumentasi terkait.

------------------------------------------------------------------------

# Before Finishing Any Phase

Pastikan:

-   Build berhasil.
-   Docker Compose berjalan.
-   Tidak ada lint error.
-   Tidak ada console error.
-   Tidak ada warning penting.
-   Struktur folder tetap konsisten.
-   Tidak ada fitur di luar scope.

------------------------------------------------------------------------

# Definition of Done

Sebuah phase dianggap selesai apabila:

-   Acceptance criteria pada Development Phases terpenuhi.
-   Kode mengikuti dokumen ini.
-   Tidak merusak phase sebelumnya.
-   Siap di-review tanpa refactor besar.

------------------------------------------------------------------------

# Absolute Constraints

AI tidak boleh:

-   Mengubah PRD.
-   Mengubah API Contract.
-   Mengubah UI tanpa mengikuti UI Specification.
-   Menambah fitur yang tidak diminta.
-   Mengganti framework.
-   Menghapus struktur folder yang telah disepakati.
