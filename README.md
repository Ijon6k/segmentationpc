# Image Segmentation Comparison Tool

A minimalist, academic web application to compare **6 classical image segmentation algorithms** side-by-side. The application is completely containerized and runs using Docker Compose.

---

## 🚀 Features

1.  **Academic UI**: Built with a clean, typography-focused, spacious aesthetic utilizing *Inter Tight* font.
2.  **Drag & Drop Upload**: Support for JPG, JPEG, and PNG images up to 10MB, with client and server-side validation.
3.  **Pre-processing Pipeline**: Displays intermediate steps of Grayscale Conversion and Gaussian Blur.
4.  **6 Segmentation Algorithms**:
    *   *Global Thresholding* (fixed threshold of 127)
    *   *Adaptive Thresholding* (local Gaussian windowing)
    *   *Otsu's Thresholding* (automatic threshold selection)
    *   *Region Growing* (BFS seed pixel grouping optimized to sub-50ms)
    *   *Marker-Controlled Watershed* (distance-transform based marking)
    *   *K-Means Clustering* ($K=3$ color grouping)
5.  **Comparative Metrics**: A side-by-side performance table displaying execution times in milliseconds, automatically highlighting the fastest algorithm.
6.  **Rule-Based Recommendation Card**: An academic rationale selecting and describing the best algorithm dynamically.
7.  **UX Polish**: Loading states are mapped using animated skeletons that hold the original preview layout.

---

## 🛠️ Architecture

The stack consists of three isolated services communicating over a private Docker network (`segmentation-network`):

*   **Ingress Proxy (`nginx`)**: Directs external requests on host port `3333` to corresponding internal services.
*   **Presentation Layer (`frontend`)**: Next.js 16 compiled in standalone mode running via Bun.
*   **Computational Engine (`backend`)**: FastAPI running on Python 3.13-slim with OpenCV headless packages.

---

## 🖥️ How to Run

### Prerequisites
Make sure you have **Docker** and **Docker Compose** installed on your system.

### Build and Start Stack
In the root directory, execute:
```bash
docker compose up -d --build --force-recreate
```

### Access Application
Open your web browser and navigate to:
```
http://localhost:3333/
```

### Check Logs
To monitor internal server logs, run:
```bash
docker compose logs -f
```

### Stop Application
To take down all containers and networks:
```bash
docker compose down
```
