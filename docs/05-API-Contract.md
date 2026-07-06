# 05 - API Contract

Version: 1.0

------------------------------------------------------------------------

# Purpose

Dokumen ini mendefinisikan kontrak komunikasi antara Frontend (Next.js)
dan Backend (FastAPI).

Kontrak API bersifat stabil. Perubahan endpoint atau struktur JSON harus
dilakukan dengan memperbarui dokumen ini terlebih dahulu.

------------------------------------------------------------------------

# API Principles

-   REST API
-   JSON response
-   multipart/form-data untuk upload
-   Stateless
-   Satu request memproses seluruh algoritma
-   Tidak menggunakan authentication

------------------------------------------------------------------------

# Base URL

Development

/api

Production

/api

Nginx akan melakukan reverse proxy ke backend.

------------------------------------------------------------------------

# Endpoints

## Health Check

GET /api/health

Response

``` json
{
  "status":"ok"
}
```

Digunakan Docker Healthcheck dan pengecekan frontend.

------------------------------------------------------------------------

## Segment Image

POST /api/segment

Content-Type

multipart/form-data

Field

image

Accepted

-   jpg
-   jpeg
-   png

Maximum Size

10 MB

------------------------------------------------------------------------

# Processing Flow

1.  Validasi file
2.  Decode image
3.  Resize (jika diperlukan)
4.  Convert grayscale
5.  Gaussian blur
6.  Jalankan seluruh algoritma
7.  Hitung execution time
8.  Bangun response JSON
9.  Kirim ke frontend

------------------------------------------------------------------------

# Successful Response

``` json
{
  "success": true,
  "data": {
    "original": "",
    "preprocessing": {
      "grayscale": "",
      "gaussianBlur": ""
    },
    "segmentation": {
      "threshold": "",
      "adaptiveThreshold": "",
      "otsu": "",
      "regionGrowing": "",
      "watershed": "",
      "kmeans": ""
    },
    "metrics": [
      {
        "algorithm": "Threshold",
        "executionTimeMs": 2.4,
        "iou": null,
        "dice": null,
        "notes": ""
      }
    ],
    "analysis": {
      "bestAlgorithm": "",
      "reason": ""
    }
  }
}
```

------------------------------------------------------------------------

# Image Format

Seluruh hasil gambar dikirim sebagai Base64 PNG pada fase awal
pengembangan.

Catatan: - Lebih sederhana untuk tugas kuliah. - Tidak memerlukan
penyimpanan file permanen.

Apabila ukuran payload menjadi besar, implementasi dapat diubah menjadi
URL file sementara tanpa mengubah struktur JSON.

------------------------------------------------------------------------

# Error Response

``` json
{
  "success": false,
  "error": {
    "code": "INVALID_IMAGE",
    "message": "Unsupported image format."
  }
}
```

Kode error:

-   INVALID_IMAGE
-   FILE_TOO_LARGE
-   EMPTY_FILE
-   INTERNAL_SERVER_ERROR

------------------------------------------------------------------------

# Frontend Responsibilities

-   Validasi ukuran file dasar.
-   Menampilkan loading.
-   Menampilkan error API.
-   Menampilkan hasil sesuai urutan algoritma.

Frontend tidak melakukan manipulasi hasil segmentasi.

------------------------------------------------------------------------

# Backend Responsibilities

-   Seluruh proses image processing.
-   Validasi file.
-   Pengukuran execution time.
-   Menjaga format response tetap konsisten.

------------------------------------------------------------------------

# API Stability Rules

-   Jangan mengubah nama field tanpa alasan.
-   Jangan menghapus endpoint yang sudah digunakan frontend.
-   Tambahan field baru harus bersifat opsional.
-   Response harus backward compatible.

------------------------------------------------------------------------

# Acceptance Criteria

API dianggap selesai apabila:

-   Health endpoint berfungsi.
-   Upload gambar berhasil.
-   Seluruh algoritma diproses dalam satu request.
-   Response mengikuti spesifikasi ini.
-   Error ditangani dengan format yang konsisten.
