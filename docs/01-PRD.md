# 01 - Product Requirements Document (PRD)

## Project

Image Segmentation Comparison

## Purpose

Membangun aplikasi web yang membandingkan hasil segmentasi citra
menggunakan algoritma klasik pada satu gambar yang diunggah pengguna.

## Objectives

-   Mengimplementasikan minimal 5 algoritma segmentasi.
-   Menampilkan hasil setiap algoritma.
-   Membandingkan hasil segmentasi.
-   Memberikan analisis sederhana terhadap hasil.

## Required Algorithms

1.  Thresholding
2.  Adaptive Thresholding
3.  Otsu
4.  Region Growing
5.  Watershed
6.  K-Means Clustering

## User Flow

Upload Image

↓

Pre-processing

↓

Run All Algorithms

↓

Display Results

↓

Comparison

↓

Analysis

## Features

### Upload Image

-   Upload JPG, JPEG, PNG
-   Preview gambar

### Pre-processing

-   Resize
-   Grayscale
-   Gaussian Blur

### Segmentation

-   Threshold
-   Adaptive Threshold
-   Otsu
-   Region Growing
-   Watershed
-   K-Means

### Comparison

-   Menampilkan seluruh hasil dalam bentuk grid.
-   Menampilkan waktu eksekusi tiap algoritma.
-   Menampilkan tabel perbandingan.

### Analysis

-   Menentukan algoritma terbaik.
-   Menampilkan penjelasan singkat.

## Non Functional Requirements

-   Responsive
-   Clean UI
-   Docker Compose
-   Tidak membutuhkan instalasi Python di host
-   Frontend dan Backend berjalan melalui Docker

## Out of Scope

-   Login
-   Database
-   Riwayat upload
-   AI
-   Cloud deployment
