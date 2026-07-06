import cv2
import numpy as np
from dataclasses import dataclass


@dataclass
class AlgorithmMetrics:
    algorithm: str
    execution_time_ms: float
    foreground_ratio: float
    connected_components: int
    contour_count: int
    noise_ratio: float


class MaskMetricsService:
    @staticmethod
    def extract(algorithm: str, mask: np.ndarray, execution_time_ms: float) -> AlgorithmMetrics:
        """Extract observable metrics from a single segmentation mask."""
        if len(mask.shape) == 3:
            gray = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
        else:
            gray = mask

        # Binarize: treat any non-zero pixel as foreground
        _, binary = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)

        total_pixels = binary.shape[0] * binary.shape[1]
        fg_pixels = int(cv2.countNonZero(binary))
        foreground_ratio = fg_pixels / total_pixels if total_pixels > 0 else 0.0

        # Connected components (excluding background label 0)
        num_labels, _ = cv2.connectedComponents(binary)
        connected_components = max(num_labels - 1, 0)

        # Contours
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contour_count = len(contours)

        # Noise ratio: fraction of contours with area < 50px
        small_contours = sum(1 for c in contours if cv2.contourArea(c) < 50)
        noise_ratio = small_contours / contour_count if contour_count > 0 else 0.0

        return AlgorithmMetrics(
            algorithm=algorithm,
            execution_time_ms=round(execution_time_ms, 3),
            foreground_ratio=round(foreground_ratio, 4),
            connected_components=connected_components,
            contour_count=contour_count,
            noise_ratio=round(noise_ratio, 4),
        )
