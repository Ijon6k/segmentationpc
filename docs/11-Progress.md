# 11 - Project Progress & Technical Overview

> **Version**: 1.1  
> **Last Updated**: 2026-07-06  
> **Status**: Phase 4 Complete (Pre-processing Pipeline & UI Integration)

---

## 1. Executive Summary

Aplikasi **Image Segmentation Comparison** telah di-bootstrap dengan arsitektur multi-container yang ramping dan optimal. Proyek ini berjalan sepenuhnya di dalam container Docker menggunakan Docker Compose, sehingga tidak memerlukan instalasi runtime Node.js/Bun atau Python di sistem host.

Seluruh repositori telah diatur dengan Git, dan infrastruktur container telah dirancang agar sangat optimal dari sisi ukuran dan keamanan (menggunakan private container networking dan reverse proxy).

---

## 2. Project Status & Roadmap Tracker

Berdasarkan panduan `docs/06-Development-Phases.md`, status implementasi saat ini adalah:

*   **Phase 1 — Project Bootstrap**: **[COMPLETED]**
    *   Setup Next.js + Bun di folder `frontend/`
    *   Setup FastAPI + Python 3.13 di folder `backend/`
    *   Setup Nginx Reverse Proxy di folder `nginx/`
    *   Konfigurasi multi-container `docker-compose.yml`
    *   Implementasi health check route `/api/health`
    *   Optimasi image size via Docker Multi-stage & `.dockerignore`
*   **Phase 2 — Upload UI**: **[COMPLETED]**
    *   Integrasi font *Inter Tight* dan skema warna akademis (Pure White, Gray-50, Gray-950, Gray-200) di `globals.css`.
    *   Implementasi komponen `AppHeader`, `UploadDropzone` (dengan hover-scale animation), dan `UploadPreview` (dengan metadata ukuran file dan tombol discard).
*   **Phase 3 — Upload API**: **[COMPLETED]**
    *   Pembuatan endpoint `POST /api/segment` dengan validasi file (ekstensi `.jpg`/`.jpeg`/`.png` dan ukuran maksimum 10MB).
    *   Implementasi `ImageService` untuk decode bytes gambar menjadi NumPy array dengan OpenCV, serta Pydantic schemas untuk kesesuaian API contract.
    *   Penyusunan API fetcher di frontend (`lib/api.ts`) dan custom hook `useSegmentation` untuk mengatur status upload.
*   **Phase 4 — Pre-processing**: **[COMPLETED]**
    *   Pembuatan `PreprocessingService` di backend: resizing proporsional (max 800px untuk optimasi performa), konversi BGR ke Grayscale (`cv2.COLOR_BGR2GRAY`), dan Gaussian Blur 5x5 (`cv2.GaussianBlur`).
    *   Modifikasi endpoint `/api/segment` untuk memproses preprocessing dan mengembalikan string base64 untuk gambar original, grayscale, dan blurred.
    *   Implementasi komponen `PreprocessingGrid` (2 kolom desktop, 1 kolom mobile) untuk menampilkan hasil pemrosesan awal di UI secara visual.
*   **Phase 5 — Threshold Algorithms**: **[COMPLETED]**
    *   Pembuatan `ThresholdService` di backend: Global Thresholding (`cv2.threshold` di 127), Adaptive Thresholding (`cv2.adaptiveThreshold` gaussian), dan Otsu's Thresholding (`cv2.THRESH_OTSU`).
    *   Modifikasi router `/api/segment` untuk mengukur waktu pemrosesan riil (dalam milidetik) dan mengembalikan masker biner dalam format Base64.
    *   Pembuatan komponen frontend `SegmentationGrid` (3 kolom) untuk merender visualisasi masker biner dan badge execution time.
*   **Phase 6 — Advanced Algorithms**: **[COMPLETED]**
    *   Pembuatan `AdvancedService` di backend: Region Growing (dengan optimasi multi-resolution BFS untuk kecepatan), Watershed (marker-controlled berbasis distance transform), dan K-Means Clustering ($K=3$ pada warna BGR).
    *   Modifikasi router `/api/segment` untuk mengukur waktu pemrosesan riil (dalam milidetik) dari ketiga algoritma ini dan mengembalikan masker biner Base64.
    *   Pembaruan komponen `SegmentationGrid` untuk menonaktifkan status placeholder sehingga merender visualisasi biner riil untuk seluruh 6 algoritma.
*   **Phase 7 — Comparison**: **[COMPLETED]**
    *   Pembuatan komponen `ComparisonTable` di frontend untuk menampilkan ringkasan data algoritma, detail cara kerja, dan waktu eksekusi riil.
    *   Implementasi logika penandaan otomatis untuk algoritma tercepat (*fastest badge*) pada baris tabel metrics.
    *   Integrasi tabel perbandingan ke dalam halaman utama Next.js di bawah grid segmentasi.
*   **Phase 8 — Analysis**: **[COMPLETED]**
    *   Pembuatan `AnalysisService` di backend: rule-based evaluation engine untuk menganalisis metrics latensi performa algoritma dan membuat rekomendasi akademis dinamis.
    *   Penyusunan rasionalisasi perbandingan efisiensi algoritma threshold (Otsu/Global) terhadap clustering (K-Means) dan topografi (Watershed).
    *   Pembuatan komponen `AnalysisCard` di frontend dengan visualisasi recommended method dan ikon medali.
*   **Phase 9 — Final Polish**: **[COMPLETED]**
    *   Pembuatan komponen `SkeletonCard` di frontend untuk merender placeholder pulsa (pulse animation) selama proses komputasi asinkron berjalan di area hasil.
    *   Optimasi tata letak: mempertahankan penayangan berkas asli (`UploadPreview`) saat memproses segmentasi agar user experience mengalir.
    *   Pembersihan elemen integrasi sementara (green check card) dan penyesuaian estetika (spasing responsif, rounding radius border, font contrast).

---

## 3. Technical Architecture & Component Interaction

Sistem beroperasi di bawah payung Docker Compose dengan diagram alur komunikasi berikut:

```
                  Browser (Host)
                        │
                        ▼ (Port 3333)
                ┌───────────────┐
                │     Nginx     │  (Reverse Proxy)
                └───────┬───────┘
                        │
           ┌────────────┴────────────┐ (Local DNS Bridge Network)
           ▼                         ▼
   ┌───────────────┐         ┌───────────────┐
   │   Frontend    │         │    Backend    │
   │ (Next.js/Bun) │         │ (FastAPI/Py)  │
   │   Port 3000   │         │   Port 8000   │
   └───────────────┘         └───────────────┘
```

### Component Details

#### A. Reverse Proxy (Nginx)
*   **Peran**: Single Entry Point untuk browser client. Menghilangkan masalah CORS dan mengamankan container internal.
*   **Ports**: Mengekspos port `3333` ke host.
*   **Routing Rules**:
    *   `/` -> di-proxy ke `http://frontend:3000` (Next.js Application)
    *   `/api` -> di-proxy ke `http://backend:8000` (FastAPI Application)
*   **Konfigurasi file**: [nginx/nginx.conf](file:///home/pixy/Projects/segmentasipc/nginx/nginx.conf) dan [nginx/Dockerfile](file:///home/pixy/Projects/segmentasipc/nginx/Dockerfile).

#### B. Frontend (Next.js 16)
*   **Peran**: Presentation layer, bertugas untuk menerima input gambar dari user, menampilkan visualisasi pre-processing, grid segmentasi, tabel perbandingan, dan summary analisis.
*   **Ports**: Port internal `3000` (tidak diekspos ke host).
*   **Cara Kerja**:
    *   Next.js dikonfigurasi untuk memproduksi build **Standalone** (`output: "standalone"` di [frontend/next.config.ts](file:///home/pixy/Projects/segmentasipc/frontend/next.config.ts)).
    *   Ketika container di-build, Docker mengompilasi seluruh file React Server Components dan membundel dependency minimal ke dalam file `server.js` mandiri.
    *   Container berjalan menggunakan runtime Bun (`bun server.js`).
*   **Konfigurasi file**: [frontend/Dockerfile](file:///home/pixy/Projects/segmentasipc/frontend/Dockerfile) dan [frontend/package.json](file:///home/pixy/Projects/segmentasipc/frontend/package.json).

#### C. Backend (FastAPI)
*   **Peran**: Core processing engine. Menangani validasi berkas, decoding gambar, kalkulasi pre-processing (Grayscale, Gaussian Blur), eksekusi algoritma segmentasi, dan perhitungan metrics waktu eksekusi.
*   **Ports**: Port internal `8000` (tidak diekspos ke host).
*   **Cara Kerja**:
    *   FastAPI diinisialisasi menggunakan standard logging dan lifecycle lifespan context manager di [backend/app/main.py](file:///home/pixy/Projects/segmentasipc/backend/app/main.py).
    *   Mendefinisikan endpoint `/api/health` di [backend/app/routes/health.py](file:///home/pixy/Projects/segmentasipc/backend/app/routes/health.py) untuk integrasi healthcheck container.
*   **Konfigurasi file**: [backend/Dockerfile](file:///home/pixy/Projects/segmentasipc/backend/Dockerfile) dan [backend/requirements.txt](file:///home/pixy/Projects/segmentasipc/backend/requirements.txt).

---

## 4. Docker Network & Security Policy

*   **Isolated Bridge Network**: Semua service tergabung dalam network bridge bernama `segmentation-network`.
*   **DNS Resolution**: Komunikasi antarkontainer menggunakan nama service internal Docker DNS (contoh: Nginx memanggil `frontend` dan `backend`).
*   **Host Isolation**: Hanya container `nginx` yang memetakan port ke host (`3333:80`). Container `frontend` dan `backend` tidak memiliki port mapping ke host, mencegah akses luar langsung tanpa melewati routing Nginx.

---

## 5. Docker Optimization Metrics

Untuk memperkecil ukuran image Docker dan mempercepat proses build, diterapkan teknik berikut:
1.  **Multi-stage builds**: Memisahkan layer build tools/compilers (seperti `build-essential` untuk python/C++ compiling) dari target runtime image.
2.  **Context Exclusions** ([.dockerignore](file:///home/pixy/Projects/segmentasipc/frontend/.dockerignore)): Mengabaikan direktori lokal host (`node_modules`, `.next`, `__pycache__`, `.venv`) agar tidak menyumbang duplikasi file saat proses copy context build.
3.  **Next.js Standalone**: Membuang library development Node/Bun yang tidak terpakai di runtime.

### Size Comparison Table

| Service | Image Name | Size Sebelum Optimasi | Size Setelah Optimasi | Net Reduction |
| --- | --- | --- | --- | --- |
| **Backend** | `segmentasipc-backend` | 1.25 GB | **811 MB** | **~35% (Saved 440 MB)** |
| **Frontend** | `segmentasipc-frontend` | 1.79 GB | **964 MB** | **~46% (Saved 830 MB)** |
| **Nginx** | `segmentasipc-nginx` | 92.5 MB | **92.5 MB** | — |

---

## 6. How to Run & Verify

### Jalankan Stack:
```bash
docker compose up -d --build
```

### Verifikasi Service:
*   Akses Aplikasi (Frontend): `http://localhost:3333/`
*   Akses Health Check (Backend): `http://localhost:3333/api/health` (Harus mengembalikan `{"status":"ok"}`)
*   Cek status container: `docker compose ps`
