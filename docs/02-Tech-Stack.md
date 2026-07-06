# 02 - Tech Stack

## Overview

Project ini menggunakan arsitektur Fullstack dengan frontend dan backend
terpisah yang dijalankan menggunakan Docker Compose.

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   Next.js 16 (App Router)
-   React 19
-   Bun
-   Tailwind CSS
-   shadcn/ui
-   Lucide Icons

### Responsibilities

-   Upload gambar
-   Preview gambar
-   Menampilkan hasil preprocessing
-   Menampilkan hasil segmentasi
-   Menampilkan tabel perbandingan
-   Menampilkan analisis

------------------------------------------------------------------------

## Backend

-   FastAPI
-   Python 3.13
-   OpenCV
-   NumPy
-   scikit-image
-   Pillow

### Responsibilities

-   Menerima upload gambar
-   Melakukan preprocessing
-   Menjalankan seluruh algoritma segmentasi
-   Mengukur waktu eksekusi
-   Mengembalikan hasil dalam bentuk JSON

------------------------------------------------------------------------

## Container

Docker Compose digunakan untuk menjalankan seluruh service.

Services:

-   frontend
-   backend

Tidak menggunakan database karena tidak diperlukan oleh tugas.

------------------------------------------------------------------------

# Folder Structure

project/

├── frontend/ │ ├── app/ │ ├── components/ │ ├── lib/ │ └── public/ │
├── backend/ │ ├── app/ │ ├── algorithms/ │ ├── preprocessing/ │ ├──
routes/ │ ├── services/ │ └── utils/ │ ├── docs/ ├── docker-compose.yml
└── README.md

------------------------------------------------------------------------

# Development Rules

-   Gunakan Bun untuk frontend.
-   Gunakan Docker Compose selama development.
-   Tidak perlu install Python pada host.
-   Seluruh komunikasi frontend-backend menggunakan REST API.
-   Semua hasil segmentasi diproses di backend.

------------------------------------------------------------------------

# Ports

Frontend : 3000

Backend : 8000

------------------------------------------------------------------------

# Future Extension (Optional)

Dokumen ini tidak mencakup:

-   Database
-   Authentication
-   User Management
-   Cloud Deployment
-   Machine Learning
