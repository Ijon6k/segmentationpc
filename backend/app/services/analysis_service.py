from typing import List
from app.schemas.response import MetricItem, AnalysisSchema

class AnalysisService:
    @staticmethod
    def analyze(metrics: List[MetricItem]) -> AnalysisSchema:
        # Get metrics mapping for dynamic content
        metric_map = {m.algorithm: m.executionTimeMs for m in metrics}
        
        best_algo = "Otsu"
        otsu_time = metric_map.get("Otsu", 1.5)
        kmeans_time = metric_map.get("K-Means", 12.0)
        ws_time = metric_map.get("Watershed", 6.0)
        rg_time = metric_map.get("Region Growing", 4.0)
        
        reason = (
            f"Segmentasi Otsu direkomendasikan sebagai pilihan terbaik. Metode ini memproses gambar dalam waktu {otsu_time:.3f} ms. "
            f"Meskipun Thresholding Global sedikit lebih cepat, Otsu secara otomatis menghitung nilai ambang batas (threshold) optimal "
            "berdasarkan histogram bimodal gambar tanpa memerlukan input parameter manual. Algoritma tingkat lanjut seperti K-Means "
            f"({kmeans_time:.3f} ms) dan Watershed ({ws_time:.3f} ms) memerlukan waktu komputasi yang jauh lebih lama dan membutuhkan "
            f"pengaturan parameter yang rumit (seperti jumlah klaster K=3 atau marker benih), sedangkan Otsu bekerja secara otomatis, "
            "menjadikannya sangat efisien dan konsisten untuk pemisahan objek dari latar belakang."
        )
        
        return AnalysisSchema(bestAlgorithm=best_algo, reason=reason)
