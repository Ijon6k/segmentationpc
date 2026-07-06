# 07 - Backend Specification

Version: 1.0

------------------------------------------------------------------------

# Purpose

Dokumen ini mendefinisikan struktur backend FastAPI, tanggung jawab
setiap module, alur pemrosesan gambar, serta standar implementasi agar
kode tetap konsisten.

Backend hanya bertanggung jawab pada business logic dan image
processing.

------------------------------------------------------------------------

# Responsibilities

Backend WAJIB:

-   menerima upload gambar
-   memvalidasi file
-   melakukan preprocessing
-   menjalankan seluruh algoritma segmentasi
-   menghitung execution time
-   menyusun response JSON

Backend TIDAK BOLEH:

-   merender HTML
-   menyimpan data permanen
-   memiliki autentikasi
-   mengandung logika UI

------------------------------------------------------------------------

# Directory Structure

``` text
backend/

app/
│
├── main.py
├── config.py
├── routes/
│     health.py
│     segment.py
│
├── schemas/
│     response.py
│     error.py
│
├── services/
│     image_service.py
│     preprocessing_service.py
│     segmentation_service.py
│     metrics_service.py
│
├── algorithms/
│     threshold.py
│     adaptive_threshold.py
│     otsu.py
│     region_growing.py
│     watershed.py
│     kmeans.py
│
├── utils/
│     timer.py
│     validator.py
│     image_encoder.py
│
└── core/
      exceptions.py
```

------------------------------------------------------------------------

# Request Lifecycle

``` text
HTTP Request

↓

segment.py

↓

ImageService

↓

Validator

↓

PreprocessingService

↓

SegmentationService

↓

MetricsService

↓

Response Builder

↓

JSON Response
```

------------------------------------------------------------------------

# Route Layer

## health.py

GET /api/health

Hanya mengembalikan status aplikasi.

Tidak memiliki business logic.

------------------------------------------------------------------------

## segment.py

POST /api/segment

Tanggung jawab:

-   menerima multipart
-   memanggil service
-   mengembalikan response

Route tidak boleh menjalankan algoritma secara langsung.

------------------------------------------------------------------------

# Service Layer

## ImageService

Bertanggung jawab untuk:

-   membaca file
-   decode image
-   konversi ke NumPy array

Tidak melakukan segmentasi.

------------------------------------------------------------------------

## PreprocessingService

Urutan preprocessing:

1.  resize (opsional)
2.  grayscale
3.  gaussian blur

Output preprocessing dipakai oleh seluruh algoritma agar perbandingan
konsisten.

------------------------------------------------------------------------

## SegmentationService

Menjalankan seluruh algoritma.

Urutan:

1.  Threshold
2.  Adaptive Threshold
3.  Otsu
4.  Region Growing
5.  Watershed
6.  K-Means

Service ini hanya mengorkestrasi, implementasi algoritma tetap berada
pada folder algorithms/.

------------------------------------------------------------------------

## MetricsService

Menghitung:

-   execution time
-   IoU (opsional)
-   Dice (opsional)

Jika ground truth tidak tersedia maka hanya execution time yang
dikembalikan.

------------------------------------------------------------------------

# Algorithms Layer

Setiap algoritma berada pada file terpisah.

Contoh:

threshold.py

Fungsi utama:

run(image)

Return:

hasil segmentasi.

Setiap algoritma memiliki antarmuka yang sama agar mudah dipanggil oleh
SegmentationService.

------------------------------------------------------------------------

# Error Handling

Semua error dikonversi menjadi response JSON.

Contoh:

-   invalid image
-   unsupported format
-   empty file
-   internal error

Tidak boleh mengembalikan HTML error page.

------------------------------------------------------------------------

# Logging

Gunakan logging standar Python.

Log yang dicatat:

-   request diterima
-   ukuran gambar
-   waktu preprocessing
-   waktu setiap algoritma
-   total processing time

Jangan mencetak log menggunakan print().

------------------------------------------------------------------------

# Performance

Target:

-   ukuran gambar ≤ 10 MB
-   proses selesai \< 5 detik pada komputer modern
-   seluruh algoritma dijalankan dalam satu request

Tidak perlu asynchronous worker.

------------------------------------------------------------------------

# Dependencies

-   FastAPI
-   OpenCV
-   NumPy
-   scikit-image
-   Pillow

Hindari dependency tambahan jika tidak benar-benar diperlukan.

------------------------------------------------------------------------

# Coding Rules

-   Satu file satu tanggung jawab.
-   Hindari fungsi lebih dari ±100 baris.
-   Gunakan type hint Python.
-   Nama fungsi menggunakan snake_case.
-   Semua service harus mudah diuji secara terpisah.

------------------------------------------------------------------------

# Acceptance Criteria

Backend dianggap selesai apabila:

-   Struktur folder sesuai dokumen.
-   Semua endpoint berjalan.
-   Semua algoritma dapat dipanggil melalui SegmentationService.
-   Tidak ada logika image processing pada route.
-   Response mengikuti API Contract.
