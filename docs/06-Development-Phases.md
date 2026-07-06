# 06 - Development Phases

Version: 1.0

> Dokumen ini menjadi panduan implementasi bertahap untuk AI coding
> agent. Setiap fase harus selesai, diuji, dan di-commit sebelum
> melanjutkan.

------------------------------------------------------------------------

# Global Rules

## Wajib

-   Ikuti PRD.
-   Ikuti UI Specification.
-   Ikuti API Contract.
-   Gunakan Docker Compose.
-   Gunakan Bun untuk frontend.
-   Gunakan FastAPI untuk backend.

## Dilarang

-   Menambah fitur di luar PRD.
-   Mengubah struktur API tanpa memperbarui API Contract.
-   Menambahkan database.
-   Menambahkan authentication.
-   Mengubah design system.

------------------------------------------------------------------------

# Phase 1 --- Project Bootstrap

## Objective

Membuat fondasi proyek.

## Deliverables

-   docker-compose.yml
-   frontend/
-   backend/
-   nginx/
-   README

## Tasks

-   Setup Next.js + Bun
-   Setup FastAPI
-   Setup Dockerfile frontend
-   Setup Dockerfile backend
-   Setup nginx.conf
-   Setup docker-compose
-   Health endpoint

## Done

-   docker compose up berhasil
-   Frontend tampil
-   Backend health OK
-   Nginx reverse proxy bekerja

------------------------------------------------------------------------

# Phase 2 --- Upload UI

## Objective

Membangun tampilan utama.

## Tasks

-   Header
-   Upload Area
-   Empty State
-   Drag & Drop
-   Preview Image

Belum ada backend integration.

## Done

Upload area responsif. Preview muncul.

------------------------------------------------------------------------

# Phase 3 --- Upload API

## Objective

Menghubungkan frontend dengan backend.

## Tasks

-   Endpoint upload
-   Multipart parsing
-   Validasi file
-   Error handling

## Done

Upload berhasil. Invalid file ditolak.

------------------------------------------------------------------------

# Phase 4 --- Pre-processing

## Objective

Menghasilkan preprocessing.

## Tasks

-   Resize
-   Grayscale
-   Gaussian Blur

## Done

Frontend dapat menampilkan hasil preprocessing.

------------------------------------------------------------------------

# Phase 5 --- Threshold Algorithms

Implement:

-   Threshold
-   Adaptive Threshold
-   Otsu

Acceptance:

Ketiga hasil tampil dalam grid.

------------------------------------------------------------------------

# Phase 6 --- Advanced Algorithms

Implement:

-   Region Growing
-   Watershed
-   K-Means

Acceptance:

Seluruh algoritma menghasilkan output.

------------------------------------------------------------------------

# Phase 7 --- Comparison

Tasks

-   Comparison Table
-   Execution Time
-   Notes

Jika ground truth tersedia:

-   IoU
-   Dice

------------------------------------------------------------------------

# Phase 8 --- Analysis

Tasks

-   Ringkasan algoritma terbaik
-   Penjelasan singkat
-   UI polishing

------------------------------------------------------------------------

# Phase 9 --- Final Polish

Tasks

-   Responsive
-   Loading state
-   Error state
-   Empty state
-   README
-   Final testing

------------------------------------------------------------------------

# Manual Testing Checklist

-   Docker Compose berjalan.
-   Upload JPG berhasil.
-   Upload PNG berhasil.
-   Invalid file ditolak.
-   Semua algoritma menghasilkan gambar.
-   UI tetap rapi pada desktop dan mobile.
-   Tidak ada console error.
-   Tidak ada API error.

------------------------------------------------------------------------

# Git Workflow

Setelah setiap phase:

1.  Review
2.  Manual testing
3.  Commit
4.  Lanjut ke phase berikutnya

Commit format:

feat: bootstrap project

feat: upload api

feat: preprocessing

feat: segmentation

feat: comparison

feat: ui polish

------------------------------------------------------------------------

# Acceptance Criteria

Proyek dianggap selesai apabila:

-   Semua requirement PRD terpenuhi.
-   Semua algoritma tersedia.
-   UI mengikuti UI Specification.
-   API mengikuti API Contract.
-   Docker Compose menjadi satu-satunya cara menjalankan proyek.
