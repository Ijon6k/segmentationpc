import cv2
import base64
import numpy as np

def encode_image_to_base64(image: np.ndarray) -> str:
    success, encoded_img = cv2.imencode(".png", image)
    if not success:
        raise ValueError("Could not encode image to PNG.")
        
    base64_str = base64.b64encode(encoded_img).decode("utf-8")
    return f"data:image/png;base64,{base64_str}"
