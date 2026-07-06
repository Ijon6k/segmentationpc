# 09 - Docker Infrastructure

Version: 1.0

## Purpose

Dokumen ini mendefinisikan standar environment development menggunakan
Docker Compose. Seluruh developer menjalankan aplikasi dengan satu
perintah:

``` bash
docker compose up --build
```

Python, Bun, Node.js, dan dependency lain **tidak perlu diinstal pada
host**.

------------------------------------------------------------------------

# Architecture

``` text
                 Browser
                    │
                    ▼
            localhost:8080
                    │
                 Nginx
          ┌─────────┴─────────┐
          ▼                   ▼
   Next.js (Bun)         FastAPI (Python)
                              │
                    OpenCV + NumPy
```

Browser hanya berkomunikasi dengan Nginx.

------------------------------------------------------------------------

# Services

## nginx

Responsibilities

-   Reverse Proxy
-   Single Entry Point
-   Route `/` ke frontend
-   Route `/api` ke backend

Expose

80 (container)

8080 (host)

------------------------------------------------------------------------

## frontend

Responsibilities

-   Menjalankan Next.js development server
-   Hot reload
-   Render UI

Internal Port

3000

Tidak diakses langsung oleh browser.

------------------------------------------------------------------------

## backend

Responsibilities

-   FastAPI
-   Image Processing
-   Segmentasi

Internal Port

8000

Tidak diekspos langsung.

------------------------------------------------------------------------

# Docker Network

Gunakan satu bridge network.

``` text
segmentation-network
```

Komunikasi antarkontainer menggunakan nama service.

Contoh:

``` text
http://backend:8000
```

Jangan menggunakan localhost antar container.

------------------------------------------------------------------------

# Volumes

## Frontend

Bind mount source code agar hot reload bekerja.

Pisahkan `node_modules` sebagai anonymous volume agar tidak bentrok
dengan host.

## Backend

Bind mount source code.

Direktori upload bersifat sementara (temporary).

Tidak menyimpan hasil permanen.

------------------------------------------------------------------------

# Startup Order

``` text
backend

↓

frontend

↓

nginx
```

Gunakan `depends_on` agar urutan startup lebih konsisten.

Healthcheck digunakan sebelum service lain bergantung padanya.

------------------------------------------------------------------------

# Health Check

Backend

GET /api/health

Frontend

HTTP GET /

Docker Compose dapat menggunakan endpoint tersebut untuk healthcheck.

------------------------------------------------------------------------

# Nginx Routing

``` text
/

↓

frontend:3000
```

``` text
/api

↓

backend:8000
```

Seluruh request dari browser melewati Nginx.

------------------------------------------------------------------------

# Environment Variables

Frontend

-   NEXT_PUBLIC_API_BASE=/api

Backend

-   PYTHONUNBUFFERED=1

Tambahkan variabel baru hanya jika benar-benar diperlukan.

------------------------------------------------------------------------

# Development Workflow

1.  Clone repository.
2.  Jalankan `docker compose up --build`.
3.  Buka browser ke http://localhost:8080.
4.  Lakukan perubahan kode.
5.  Hot reload berjalan otomatis.

Tidak menjalankan aplikasi langsung dari host.

------------------------------------------------------------------------

# Production Notes

Dokumen ini berfokus pada development.

Untuk production nantinya dapat ditambahkan:

-   multi-stage Docker build
-   image optimization
-   HTTPS
-   gzip
-   caching
-   security headers

Tanpa mengubah arsitektur utama.

------------------------------------------------------------------------

# Design Decisions

Mengapa Docker Compose?

-   setup satu perintah
-   environment konsisten
-   tidak perlu install Python lokal
-   mudah dipindahkan ke komputer lain

Mengapa memakai Nginx?

-   satu origin untuk browser
-   menghindari masalah CORS
-   mudah dikembangkan ke production

Mengapa backend tidak diekspos?

-   meningkatkan keamanan
-   seluruh akses melalui reverse proxy

------------------------------------------------------------------------

# Acceptance Criteria

-   `docker compose up --build` berhasil.
-   Frontend dapat diakses melalui Nginx.
-   Backend hanya dapat diakses melalui `/api`.
-   Hot reload berjalan.
-   Tidak diperlukan instalasi Python pada host.
-   Seluruh service berada pada network yang sama.
