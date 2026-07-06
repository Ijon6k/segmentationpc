import os

class Settings:
    API_PREFIX: str = "/api"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    PROJECT_NAME: str = "Image Segmentation Comparison"

settings = Settings()
