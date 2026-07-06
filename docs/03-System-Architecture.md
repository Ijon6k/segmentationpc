# 03 - System Architecture

> Version: 1.0

------------------------------------------------------------------------

# Purpose

Dokumen ini menjelaskan arsitektur aplikasi secara menyeluruh agar
seluruh developer dan AI coding agent memiliki pemahaman yang sama
sebelum implementasi dimulai.

Aplikasi merupakan web application sederhana untuk membandingkan hasil
beberapa algoritma segmentasi citra klasik.

------------------------------------------------------------------------

# High Level Architecture

``` text
                User
                  │
                  ▼
           Web Browser
                  │
                  ▼
              Nginx
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 Next.js Frontend      FastAPI Backend
                              │
                              ▼
                OpenCV + NumPy + scikit-image
```

Seluruh image processing dilakukan **hanya** pada backend.

Frontend hanya bertanggung jawab terhadap antarmuka pengguna.

------------------------------------------------------------------------

# Technology Decisions

## Frontend

-   Next.js 16
-   React
-   Bun
-   Tailwind CSS
-   shadcn/ui

Tanggung jawab:

-   Upload gambar
-   Preview gambar
-   Menampilkan hasil
-   Menampilkan tabel perbandingan
-   Menampilkan analisis

Frontend **tidak boleh** melakukan image processing.

------------------------------------------------------------------------

## Backend

-   FastAPI
-   Python
-   OpenCV
-   NumPy
-   scikit-image
-   Pillow

Tanggung jawab:

-   Validasi file
-   Pre-processing
-   Menjalankan seluruh algoritma
-   Mengukur execution time
-   Mengembalikan response

------------------------------------------------------------------------

## Reverse Proxy

Menggunakan Nginx.

Tujuan:

-   Single entry point
-   Reverse proxy
-   Routing request
-   Siap untuk production

Semua request browser akan masuk ke Nginx terlebih dahulu.

------------------------------------------------------------------------

# Docker Architecture

Container yang digunakan:

``` text
docker-compose

├── nginx
├── frontend
└── backend
```

## frontend

Menjalankan Next.js menggunakan Bun.

Port internal:

3000

## backend

Menjalankan FastAPI.

Port internal:

8000

## nginx

Expose port:

80

Browser hanya mengakses Nginx.

Backend tidak diekspos langsung ke internet.

------------------------------------------------------------------------

# Docker Network

Semua service berada pada satu network docker.

``` text
segmentation-network

nginx
frontend
backend
```

Keuntungan:

-   komunikasi menggunakan nama service
-   lebih aman
-   tidak perlu mengetahui IP container

Contoh:

Frontend memanggil

http://backend:8000

bukan localhost.

------------------------------------------------------------------------

# Docker Volumes

Frontend

-   bind mount source code
-   node_modules di dalam container

Backend

-   bind mount source code
-   temporary upload directory

Tujuan:

-   Hot reload
-   Development lebih cepat

------------------------------------------------------------------------

# Nginx Routing

``` text
/

↓

Frontend
```

``` text
/api

↓

Backend
```

Contoh:

GET /

→ frontend

POST /api/segment

→ backend

------------------------------------------------------------------------

# Image Processing Pipeline

``` text
Upload

↓

Validate extension

↓

Decode image

↓

Resize

↓

Convert grayscale

↓

Gaussian Blur

↓

Run Algorithms
```

Urutan algoritma:

1.  Threshold
2.  Adaptive Threshold
3.  Otsu
4.  Region Growing
5.  Watershed
6.  K-Means

Setiap algoritma bekerja pada hasil preprocessing yang sama agar
perbandingan adil.

------------------------------------------------------------------------

# Request Flow

``` text
Browser

↓

POST /api/segment

↓

Nginx

↓

FastAPI

↓

Validation

↓

Pre-processing

↓

Segmentation

↓

Metrics

↓

JSON Response

↓

Frontend
```

------------------------------------------------------------------------

# Response Structure

Backend mengembalikan:

-   original image
-   grayscale
-   blur
-   threshold
-   adaptive threshold
-   otsu
-   region growing
-   watershed
-   kmeans
-   execution time setiap algoritma
-   analysis sederhana

------------------------------------------------------------------------

# Folder Structure

``` text
project/

frontend/
    app/
    components/
    lib/
    services/

backend/
    app/
    routes/
    services/
    algorithms/
    preprocessing/
    utils/

nginx/
    nginx.conf

docs/

docker-compose.yml
```

------------------------------------------------------------------------

# Design Decisions

## Mengapa tidak menggunakan database?

Aplikasi bersifat stateless. Semua proses selesai dalam satu request
sehingga penyimpanan permanen tidak diperlukan.

## Mengapa tidak menggunakan Redis?

Tidak ada background job atau queue.

## Mengapa tidak menggunakan Celery?

Seluruh algoritma selesai dalam hitungan milidetik hingga detik sehingga
asynchronous worker belum diperlukan.

## Mengapa menggunakan Docker Compose?

-   setup satu perintah
-   lingkungan development konsisten
-   tidak perlu install Python lokal

------------------------------------------------------------------------

# Development Workflow

1.  Jalankan Docker Compose.
2.  Buka frontend.
3.  Upload gambar.
4.  Frontend mengirim multipart request ke backend.
5.  Backend memproses seluruh algoritma.
6.  Backend mengembalikan hasil.
7.  Frontend menampilkan grid hasil segmentasi dan tabel perbandingan.

------------------------------------------------------------------------

# Future Extension

Dokumen ini dirancang agar mudah dikembangkan di masa depan, misalnya:

-   penyimpanan riwayat
-   autentikasi
-   upload batch
-   evaluasi menggunakan ground truth
-   akselerasi GPU
-   model deep learning
