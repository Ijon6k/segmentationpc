import cv2
import numpy as np
from typing import Dict

class PreprocessingService:
    @staticmethod
    def process(image: np.ndarray) -> Dict[str, np.ndarray]:
        h, w = image.shape[:2]
        max_dim = 800
        
        # 1. Conditional Resize (Preserve Aspect Ratio)
        if max(h, w) > max_dim:
            if w > h:
                scale = max_dim / w
                new_w = max_dim
                new_h = int(h * scale)
            else:
                scale = max_dim / h
                new_h = max_dim
                new_w = int(w * scale)
            
            resized_original = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
        else:
            resized_original = image.copy()
            
        # 2. Grayscale Conversion
        grayscale = cv2.cvtColor(resized_original, cv2.COLOR_BGR2GRAY)
        
        # 3. Gaussian Blur (5x5 kernel)
        gaussian_blur = cv2.GaussianBlur(grayscale, (5, 5), 0)
        
        return {
            "original": resized_original,
            "grayscale": grayscale,
            "gaussian_blur": gaussian_blur
        }
