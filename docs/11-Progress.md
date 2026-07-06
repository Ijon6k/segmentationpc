# 11 - Project Progress & Technical Overview

> **Version**: 1.3  
> **Last Updated**: 2026-07-06  
> **Status**: All Phases Complete + Dynamic Analysis Engine + Desktop Layout Revision

---

## 1. Executive Summary

Aplikasi **Image Segmentation Comparison** telah diselesaikan sepenuhnya dengan arsitektur multi-container yang ramping dan optimal. Proyek ini berjalan di dalam container Docker menggunakan Docker Compose, sehingga tidak memerlukan instalasi runtime Node.js/Bun atau Python di sistem host.

Seluruh repositori telah diatur dengan Git, infrastruktur container telah dioptimalkan secara mendalam, UI telah dipoles dengan desain flat bebas bayangan, sudut melengkung kecil rapi, teks berbahasa Indonesia, dan peninjauan citra interaktif *Click to Zoom*.

Sistem analisis telah direfaktor dari rekomendasi statis menjadi **observation-based rule engine** yang sepenuhnya deterministik — rekomendasi algoritma berubah secara dinamis berdasarkan karakteristik citra yang diuji.

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
*   **Phase 8 — Analysis (Refactored)**: **[COMPLETED]**
    *   Pembuatan modular analysis engine menggantikan rekomendasi statis. Lihat **Section 3B** untuk detail arsitektur.
    *   Rekomendasi algoritma bersifat dinamis — berubah berdasarkan metrik terukur dari citra yang diunggah.
    *   Tidak ada algoritma yang di-hardcode sebagai pemenang; sepenuhnya deterministik tanpa AI/LLM.
*   **Phase 9 & Polish — UI Polish, Zoom Modals & Desktop Layout**: **[COMPLETED]**
    *   Penerjemahan teks halaman ke Bahasa Indonesia dengan tetap mempertahankan penamaan istilah teknis bahasa Inggris standar (seperti *Global Thresholding*, *Adaptive Thresholding*, *Otsu's Thresholding*, *Region Growing*, *Watershed Segmentation*, *K-Means Clustering*).
    *   Penghapusan seluruh drop shadows (`shadow-sm`, `shadow`) untuk mengimplementasikan *academic flat layout*.
    *   Penyesuaian radius sudut border menjadi kecil rapi (`rounded-md` untuk kartu, `rounded-sm` untuk badge dan tombol).
    *   Implementasi fitur *Click to Zoom* di frontend: overlay bertuliskan `"Click to Zoom"` saat hover gambar asli/hasil pemrosesan, dan modal pop-up interaktif untuk melihat gambar resolusi tinggi beserta judul metodenya saat diklik.
    *   Pembuatan komponen `SkeletonCard` untuk placeholder pulsa pemuatan.
    *   Pembuatan dokumen [README.md](file:///home/pixy/Projects/segmentasipc/README.md) di direktori utama.
    *   **Layout Revision**: Perluasan area konten dari `max-w-4xl` (~896px) menjadi `max-w-[1600px]` untuk pemanfaatan layar desktop yang optimal, dengan padding horizontal `px-6 lg:px-8`.

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

### A. Component Details

#### A1. Reverse Proxy (Nginx)
*   **Peran**: Single Entry Point untuk browser client. Menghilangkan masalah CORS dan mengamankan container internal.
*   **Ports**: Mengekspos port `3333` ke host.
*   **Routing Rules**:
    *   `/` -> di-proxy ke `http://frontend:3000` (Next.js Application)
    *   `/api` -> di-proxy ke `http://backend:8000` (FastAPI Application)
*   **Konfigurasi file**: [nginx/nginx.conf](file:///home/pixy/Projects/segmentasipc/nginx/nginx.conf) dan [nginx/Dockerfile](file:///home/pixy/Projects/segmentasipc/nginx/Dockerfile).

#### A2. Frontend (Next.js 16)
*   **Peran**: Presentation layer, bertugas untuk menerima input gambar dari user, menampilkan visualisasi pre-processing, grid segmentasi, tabel perbandingan, dan summary analisis.
*   **Ports**: Port internal `3000` (tidak diekspos ke host).
*   **Cara Kerja**:
    *   Next.js dikonfigurasi untuk memproduksi build **Standalone** (`output: "standalone"` di [frontend/next.config.ts](file:///home/pixy/Projects/segmentasipc/frontend/next.config.ts)).
    *   Ketika container di-build, Docker mengompilasi seluruh file React Server Components dan membundel dependency minimal ke dalam file `server.js` mandiri.
    *   Container berjalan menggunakan runtime Bun (`bun server.js`).
*   **Konfigurasi file**: [frontend/Dockerfile](file:///home/pixy/Projects/segmentasipc/frontend/Dockerfile) dan [frontend/package.json](file:///home/pixy/Projects/segmentasipc/frontend/package.json).

#### A3. Backend (FastAPI)
*   **Peran**: Core processing engine. Menangani validasi berkas, decoding gambar, kalkulasi pre-processing (Grayscale, Gaussian Blur), eksekusi algoritma segmentasi, ekstraksi metrik mask, dan analisis rekomendasi berbasis aturan.
*   **Ports**: Port internal `8000` (tidak diekspos ke host).
*   **Cara Kerja**:
    *   FastAPI diinisialisasi menggunakan standard logging dan lifecycle lifespan context manager di [backend/app/main.py](file:///home/pixy/Projects/segmentasipc/backend/app/main.py).
    *   Mendefinisikan endpoint `/api/health` di [backend/app/routes/health.py](file:///home/pixy/Projects/segmentasipc/backend/app/routes/health.py) untuk integrasi healthcheck container.
*   **Konfigurasi file**: [backend/Dockerfile](file:///home/pixy/Projects/segmentasipc/backend/Dockerfile) dan [backend/requirements.txt](file:///home/pixy/Projects/segmentasipc/backend/requirements.txt).

---

### B. Dynamic Analysis Engine — Arsitektur & Cara Kerja

Sistem analisis menggunakan arsitektur modular 4-layer yang sepenuhnya deterministik (tanpa AI/LLM/ML):

```
segment.py (route)
    │
    ├── MaskMetricsService       ← Mengekstrak metrik observasi dari mask
    │
    └── AnalysisService          ← Orchestrator
            ├── RuleEngine       ← Scoring berbasis observasi
            ├── TemplateEngine   ← Generator kalimat dari template
            └── AnalysisBuilder  ← Merangkai laporan terstruktur
```

#### B1. MaskMetricsService

**File**: [mask_metrics.py](file:///home/pixy/Projects/segmentasipc/backend/app/services/mask_metrics.py)

Mengekstrak metrik kuantitatif dari setiap mask segmentasi menggunakan OpenCV:

| Metrik | Deskripsi | Metode |
|--------|-----------|--------|
| `foreground_ratio` | Persentase piksel foreground | `cv2.countNonZero / total pixels` |
| `connected_components` | Jumlah objek terpisah yang terdeteksi | `cv2.connectedComponents` |
| `contour_count` | Jumlah kontur yang terdeteksi | `cv2.findContours` |
| `noise_ratio` | Rasio kontur kecil (<50px) terhadap total kontur | Hitung kontur berarea kecil |

Setiap algoritma menghasilkan satu `AlgorithmMetrics` dataclass yang berisi metrik di atas beserta `execution_time_ms`.

#### B2. RuleEngine — Observation-Based Scoring

**File**: [rule_engine.py](file:///home/pixy/Projects/segmentasipc/backend/app/services/analysis/rule_engine.py)

Sistem scoring deterministik — setiap algoritma dinilai berdasarkan **temuan observasi yang terukur**, bukan asumsi tetap. Tidak ada algoritma yang di-hardcode sebagai pemenang.

| Observasi | Kondisi | Skor |
|-----------|---------|------|
| Fast execution | `time < median × 0.5` | +10 |
| Slow execution | `time > median × 2.0` | −10 |
| Low noise | `noise_ratio < 0.1` | +20 |
| Moderate noise | `0.1 ≤ noise_ratio < 0.4` | +5 |
| Excessive noise | `noise_ratio ≥ 0.4` | −20 |
| Object mostly preserved | `1 ≤ components ≤ 5` | +20 |
| Fragmented object | `components > 20` | −20 |
| Possible over-segmentation | `components > 50` | −15 |
| Possible under-segmentation | `fg_ratio < 0.02 or > 0.98` | −15 |
| Stable segmentation | `0.05 ≤ fg_ratio ≤ 0.90` | +10 |

**Prinsip desain**:
*   Tidak mengasumsikan "foreground ratio ideal" yang universal.
*   Tidak mengasumsikan lebih sedikit komponen selalu lebih baik.
*   Hanya mengevaluasi **temuan yang dapat diukur** — menghasilkan *findings*, bukan *absolute truths*.
*   Algoritma dengan skor total tertinggi menjadi rekomendasi untuk citra tersebut.

#### B3. TemplateEngine — Generasi Teks Dinamis

**File**: [template_engine.py](file:///home/pixy/Projects/segmentasipc/backend/app/services/analysis/template_engine.py)

Menghasilkan kalimat rekomendasi dari template reusable berdasarkan observasi aktual. Teks **selalu berbeda** tergantung gambar yang diuji.

**Prinsip teks**:
*   Tidak mengekspos skor internal (tidak ada angka "poin" yang tampil ke pengguna).
*   Selalu menyebut "pada citra yang diuji" untuk menghindari klaim rekomendasi universal.
*   Menjelaskan **mengapa** algoritma direkomendasikan berdasarkan metrik terukur.

Contoh output:

> "Pada citra yang diuji, metode Watershed direkomendasikan karena menghasilkan preservasi objek utama yang baik dan tingkat noise yang rendah, meskipun memiliki waktu komputasi yang lebih tinggi dibanding beberapa algoritma lainnya."

**Komponen teks yang dihasilkan**:
*   `reason`: 2-3 kalimat penjelasan mengapa algoritma direkomendasikan + perbandingan dengan runner-up.
*   `strengths`: Daftar kelebihan berdasarkan observasi positif + karakteristik algoritma.
*   `weaknesses`: Daftar kelemahan berdasarkan observasi negatif + karakteristik algoritma.
*   `executionSummary`: Urutan kecepatan eksekusi semua algoritma.
*   `conclusion`: Satu kalimat penutup tentang hasil pengujian citra tersebut.

#### B4. AnalysisBuilder — Perangkai Laporan

**File**: [analysis_builder.py](file:///home/pixy/Projects/segmentasipc/backend/app/services/analysis/analysis_builder.py)

Layer tipis yang menghubungkan output `RuleEngine` ke `TemplateEngine`, memproduksi objek `AnalysisSchema` final yang dikirim ke frontend.

#### B5. AnalysisSchema — Struktur Data Respons

```python
class AnalysisSchema(BaseModel):
    bestAlgorithm: str        # Nama algoritma terbaik
    reason: str               # Penjelasan dinamis berbasis metrik
    strengths: List[str]      # Daftar kelebihan
    weaknesses: List[str]     # Daftar kelemahan
    executionSummary: str     # Urutan kecepatan eksekusi
    conclusion: str           # Kalimat penutup
```

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
