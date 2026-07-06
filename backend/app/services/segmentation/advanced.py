import cv2
import numpy as np
import collections

class AdvancedService:
    @staticmethod
    def region_growing(image: np.ndarray, thresh_val: int = 20) -> np.ndarray:
        # Downscale for performance during BFS traversal
        h_orig, w_orig = image.shape[:2]
        max_dim = 300
        if max(h_orig, w_orig) > max_dim:
            scale = max_dim / max(h_orig, w_orig)
            h_new = int(h_orig * scale)
            w_new = int(w_orig * scale)
            img_small = cv2.resize(image, (w_new, h_new), interpolation=cv2.INTER_AREA)
        else:
            img_small = image
            h_new, w_new = h_orig, w_orig
            
        mask_small = np.zeros((h_new, w_new), dtype=np.uint8)
        seed = (h_new // 2, w_new // 2)
        seed_val = int(img_small[seed[0], seed[1]])
        
        queue = collections.deque([seed])
        mask_small[seed[0], seed[1]] = 255
        dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        
        while queue:
            cy, cx = queue.popleft()
            for dy, dx in dirs:
                ny, nx = cy + dy, cx + dx
                if 0 <= ny < h_new and 0 <= nx < w_new:
                    if mask_small[ny, nx] == 0:
                        val = int(img_small[ny, nx])
                        if abs(val - seed_val) < thresh_val:
                            mask_small[ny, nx] = 255
                            queue.append((ny, nx))
                            
        # Upscale back to original size
        if max(h_orig, w_orig) > max_dim:
            mask = cv2.resize(mask_small, (w_orig, h_orig), interpolation=cv2.INTER_NEAREST)
        else:
            mask = mask_small
            
        return mask

    @staticmethod
    def watershed(original_image: np.ndarray, gray_image: np.ndarray) -> np.ndarray:
        # 1. Binarize using Otsu's thresholding
        _, thresh = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # 2. Morphological opening
        kernel = np.ones((3, 3), np.uint8)
        opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)
        
        # 3. Sure background
        sure_bg = cv2.dilate(opening, kernel, iterations=3)
        
        # 4. Sure foreground
        dist_transform = cv2.distanceTransform(opening, cv2.DIST_L2, 5)
        _, sure_fg = cv2.threshold(dist_transform, 0.4 * dist_transform.max(), 255, 0)
        sure_fg = np.uint8(sure_fg)
        
        # 5. Unknown region
        unknown = cv2.subtract(sure_bg, sure_fg)
        
        # 6. Marker labeling
        _, markers = cv2.connectedComponents(sure_fg)
        markers = markers + 1
        markers[unknown == 255] = 0
        
        # 7. Apply Watershed
        markers_out = cv2.watershed(original_image, markers.copy())
        
        # Output: boundaries in white (255), regions in gray (127), background in black (0)
        mask = np.zeros(gray_image.shape, dtype=np.uint8)
        mask[markers_out > 1] = 127
        mask[markers_out == -1] = 255
        
        return mask

    @staticmethod
    def kmeans_clustering(image: np.ndarray, k: int = 3) -> np.ndarray:
        h, w = image.shape[:2]
        data = image.reshape((-1, 3))
        data = np.float32(data)
        
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
        _, labels, _ = cv2.kmeans(
            data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS
        )
        
        labels_reshaped = labels.reshape((h, w))
        segmented = (labels_reshaped * (255 // (k - 1))).astype(np.uint8)
        return segmented
