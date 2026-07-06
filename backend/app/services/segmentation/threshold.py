import cv2
import numpy as np

class ThresholdService:
      @staticmethod
      def global_threshold(image: np.ndarray) -> np.ndarray:
          _, thresh = cv2.threshold(image, 127, 255, cv2.THRESH_BINARY)
          return thresh

      @staticmethod
      def adaptive_threshold(image: np.ndarray) -> np.ndarray:
          thresh = cv2.adaptiveThreshold(
              image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
          )
          return thresh

      @staticmethod
      def otsu_threshold(image: np.ndarray) -> np.ndarray:
          _, thresh = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
          return thresh
