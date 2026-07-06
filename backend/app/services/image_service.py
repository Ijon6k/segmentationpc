import cv2
import numpy as np
from fastapi import UploadFile

class ImageService:
    @staticmethod
    async def decode_image(file: UploadFile) -> np.ndarray:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Failed to decode image bytes into valid format.")
        return image
